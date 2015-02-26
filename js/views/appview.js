/*global define*/
define([
    "backbone",
    "models/progressbar",
    "views/progressbarview",
    "views/mapper/mapperview",
], function (Backbone, ProgressBar, ProgressBarView, MapperView) {
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

            //this.call(this.progressbar.get("total"));
            this.mapperview = new MapperView();

            this.listenTo(this.mapperview, "map:ready", this.ProgressBarLoad);

            this.listenTo(this.progressbar, "bar:ready", function(){
                console.log("complete progressbar 1!");
            });
        },

        ProgressBarLoad: function(status){
          var step = 100/status.totalDefinitions;
          var name = status.modelName;
          var activity = status.activity;
          console.log(step, name, activity);
          this.progressbar.add(step, name, activity);
        }

    });



    return AppView;
});
