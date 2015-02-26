/*global define*/
define([
    "backbone",
    "models/mapper/mapper",
    "models/mapper/collections/definitions",
    "models/mapper/darwinstore"
], function (Backbone, Mapper, Definitions, DarwinStore) {
    "use strict";

    var MapperView = Backbone.View.extend({
        initialize: function(){
            this.base_url = '/darwined/testing';
            this.model = new Mapper();
            this.listenTo(this.model, "mapper:ready", this.logMapper);
            this.model.getConfig();
        },

        logMapper: function(){
            this.definitions = new Definitions(this.model.get("modelsDefinition"));
            this.generateModelsDefinitions();
            this.generateModels();
        },

        generateModelsDefinitions: function(){
            // Generate Models and Collections based on definitions
            this.Darwin = {
                Definitions: this.definitions,
                Models: {},
                Collections: {}
            };

        },

        generateModels: function(){
            var self = this;
            var base_url = self.base_url;

            var totalDefinitions = this.Darwin.Definitions.length;

            this.Darwin.Definitions.each(function(def){
                var modelName = def.get('name');
                var collectionName = def.get('collectionName');

                // Create a new Model class
                var model = Backbone.Model.extend({
                    // URL root for this model
                    urlRoot: base_url + def.get('urlRoot')
                });

                // Backbone Collection
                var collection = Backbone.Collection.extend({
                    url: base_url + def.get('urlRoot'),
                    model: model
                });

                // Store in Darwin structure
                self.Darwin.Models[modelName] = model;
                self.Darwin.Collections[collectionName] = collection;

            });

            this.store = new DarwinStore(this.Darwin);
            this.listenTo(this.store, "map:ready", function(status){
                self.trigger("map:ready", status);
            });
            // this.store.fetchChainFor('Sala');
            this.store.fetchChainFor('Asignatura');
            // this.store.fetchChainFor('Profesor');

            this.export();
        },

        export: function(){
            // Export
            window.Darwin = this.Darwin;
            window.DarwinStore = this.store;
        }

    });



    return MapperView;
});
