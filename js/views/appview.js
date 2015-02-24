/*global define*/
define([
    "backbone",
    "models/progressbar",
    "views/progressbarview"
], function (Backbone, ProgressBar, ProgressBarView) {
    "use strict";

    //The overall Grid Component
    var AppView = Backbone.View.extend({

        initialize: function(){

            this.progressbar = new ProgressBar({
                target: "#ejemplo",
                loaded: 0,
                total: 100
            });

            this.progressbarview = new ProgressBarView({model:this.progressbar});
            this.jqueryButton();

            this.listenTo(this.progressbar, "bar:ready", function(){
                alert("complete!");
            });
        },

        jqueryButton: function(){
            var self = this;

            $("#elboton").on("click", function(){
                self.progressbar.add(5);
            });
        }
    });



    return AppView;
});
