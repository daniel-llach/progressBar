/*global define*/
define([
    "backbone"
], function (Backbone) {
    "use strict";

    var DarwinStore = Backbone.Model.extend({
        initialize: function(darwin) {
            this.definitions = darwin.Definitions;
            this.models = darwin.Models;
            this.collections = darwin.Collections;

            // Build collections for each model
            this.definitions.each(function(definition){
                var modelName = definition.get('name'),
                    collectionName = definition.get('collectionName'),
                    collection = this.collections[collectionName];

                this.set(modelName, new collection());
            }, this);
        },

        fetchChainFor: function(modelName) {
            var self = this;
            // First, get the chain of collections we need to fetch
            var dependencies = this.getDependencyListFor(modelName);
            var totalDependencies = dependencies.length;

            // Build requests
            var requests = _.map(dependencies, function(dep){
                // Get collection
                var collection = this.get(dep);

                // Already fetched
                if (collection.size() > 0) {
                    return false;
                } else {
                    return collection.fetch({complete: function(){
                        self.storeStatus(totalDependencies, dep, "cargado(a)");
                        //alert('step');
                    }});
                }
            }, this);

            // Filter the already done
            requests = _.reject(requests, function(r) { return r == false });

            // Also, perform the actual fetch for the requested model
            var current_collection = this.get(modelName);
            requests.unshift(current_collection.fetch());

            // Perform all in parallel and build links when done
            var that = this;
            $.when.apply($, requests).done(function() {
                // Build links
                console.log("All Requests done");

                // Build links for the model
                that.buildRelationshipsForModel(modelName);

                // And its dependencies
                _.each(dependencies, function(dep) {
                    that.buildRelationshipsForModel(dep);
                }, that);
            });


        },

        buildRelationshipsForModel: function(modelName) {
            // Get definition
            var definition = this.definitions.get(modelName);

            // Build deps
            _.each(definition.get('deps'), function(dep) {
                // Where to look
                var target_collection = this.get(dep.model);

                // Now, for each item in the collection
                var collection = this.get(modelName);
                collection.each(function(model) {
                    // Get lookup key
                    var lookup_value = model.get(dep.lookup);
                    // Find store name
                    var target_model = target_collection.get(lookup_value);

                    // Store
                    model.set(dep.key, target_model);
                });
            }, this);
        },

        getDependencyListFor: function(modelName) {
            // TODO: Refactor this one, it's a mess @_@
            console.log("Fetching chain for ", modelName);
            var initial_model = this.definitions.get(modelName);

            // Dependency list
            var dependency_chain = [];

            // If any deps, proceed
            if (initial_model.get('deps').length > 0) {
                var visited_models = {};

                // Model names => ["Sede", "Sala", ...]
                var dependencies = _.pluck(initial_model.get('deps'), 'model');

                // Loop
                while (dependencies.length > 0) {
                    // Pick a dependency
                    var dependency = dependencies.shift();

                    // Only proceed if we haven't seen it already
                    if (visited_models[dependency]) {
                        continue;
                    }

                    // Add it to the dependency list
                    dependency_chain.push(dependency);

                    // Fetch the actual model using its name
                    var dependency_model = this.definitions.get(dependency);

                    // Add its deps to the list
                    dependencies.push.apply(
                        dependencies, _.pluck(dependency_model.get('deps'), 'model'));

                    // Mark it as visited
                    visited_models[dependency] = true;
                }
            }

            return dependency_chain;
        },

        storeStatus: function(totalDefinitions, modelName, activity){
            var status = {
                "totalDefinitions": totalDefinitions,
                "modelName": modelName,
                "activity": activity
            }
            this.trigger("map:ready", status);

        }
    });

    return DarwinStore;
});
