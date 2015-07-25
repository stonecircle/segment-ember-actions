/**
 * @fileoverview Rule to check if action block has a segment call
 * @author A. Chris Manson
 * @copyright 2015 A. Chris Manson All rights reserved.
 */
"use strict";


var linter = require("eslint").linter;
var ESLintTester = require("eslint-tester");
var eslintTester = new ESLintTester(linter);

eslintTester.addRuleTest("lib/rules/segment-ember-actions", {
    valid: [{
        code: "import Ember from 'ember';\nexport default Ember.Controller.extend({\n  actions: {\n    exampleAction() {\n      analytics.track('somthing', {with: 'data'}); \n    }\n  }\n});",
        ecmaFeatures: {
            "modules": true
        },
        "env": {
            "browser": true,
            "es6": true
        }
    }, {
        code: "import Ember from 'ember';\nexport default Ember.Controller.extend({\n  actions: {\n    //no-track\n exampleAction() {}\n  }\n});",
        ecmaFeatures: {
            "modules": true
        },
        "env": {
            "browser": true,
            "es6": true
        }
    }, {
        code: "import Ember from 'ember';\nexport default Ember.Controller.extend({\n  notActions: {\n    exampleAction() {\n      notTheRightFunction.track('somthing', {with: 'data'}); \n    }\n  }\n});",
        ecmaFeatures: {
            "modules": true
        },
        "env": {
            "browser": true,
            "es6": true
        }
    }],
    invalid: [{
        code: "import Ember from 'ember';\nexport default Ember.Controller.extend({\n  actions: {\n    exampleAction() {}\n  }\n});",
        ecmaFeatures: {
            "modules": true
        },
        "env": {
            "browser": true,
            "es6": true
        },
        errors: [{
            message: "no analytics.track() found"
        }]
    }]
});
