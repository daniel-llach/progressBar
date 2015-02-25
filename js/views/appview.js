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

            this.progressbar2 = new ProgressBar({
                target: "#ejemplo2",
                loaded: 0,
                total: 600
            });

            this.progressbarview = new ProgressBarView({model:this.progressbar});
            this.progressbarview2 = new ProgressBarView({model:this.progressbar2});
            this.jqueryButton();

            this.listenTo(this.progressbar, "bar:ready", function(){
                alert("complete progressbar 1!");
            });
            this.listenTo(this.progressbar2, "bar:ready", function(){
                alert("complete progressbar 2!");
            });
        },

        jqueryButton: function(){
            var self = this;

            $("#elboton").on("click", function(){
                self.progressbar.add(5);
            });

            $("#elboton2").on("click", function(){
                self.progressbar2.add(55);
            });
        }
    });



    return AppView;
});
