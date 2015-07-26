/**
 * @fileoverview Rule to check if action block has a segment call
 * @author A. Chris Manson
 * @copyright 2015 A. Chris Manson All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function checkForTrackCall(expression){
    var analyticsTrackFound = false;

    expression.forEach(function(expression) {
        if (expression.expression &&
            expression.expression.callee &&
            expression.expression.callee.object.name === "analytics" && expression.expression.callee.property.name === "track") {
            analyticsTrackFound = true;
        } else if(expression.type === "IfStatement") {
            analyticsTrackFound = checkForTrackCall(expression.consequent.body) || (expression.alternate && checkForTrackCall(expression.alternate.body));
        }
    });

    return analyticsTrackFound;
}


module.exports = function(context) {
    return {
        "FunctionExpression": function(node) {

            var ancestors = context.getAncestors();
            // minimum number of parents for an action block
            if (ancestors.length < 3) {
                return;
            }

            var preceedingComments = context.getComments(ancestors[ancestors.length - 1]);

            var noTrackFound;
            preceedingComments.leading.forEach(function(comment) {
                if (comment.value === "no-track") {
                    noTrackFound = true;
                }
            });

            if (noTrackFound) {
                return;
            }

            var actionsNode = ancestors[ancestors.length - 3];

            if (actionsNode.type !== "Property" || actionsNode.key.name !== "actions") {
                return;
            }

            var analyticsTrackFound = checkForTrackCall(node.body.body);

            if (!analyticsTrackFound) {

                context.report(node, "no analytics.track() found for action \"" + node.parent.key.name + "\"");
            }
        }
    };

};
