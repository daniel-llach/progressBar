/*global define*/
define([
    "backbone",
    "models/mapper/definition"
], function (Backbone, Definition) {
    "use strict";

    var Definitions = Backbone.Collection.extend({
        model: Definition
    });

    return Definitions;
});
