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
            this.initProgressBar();
            this.mapperview = new MapperView();
            this.ProgressBarListener();
        },

        initProgressBar: function(){
            this.progressbar = new ProgressBar({
                target: "#ejemplo",
                loaded: 0,
                total: 100
            });
            this.progressbarview = new ProgressBarView({model:this.progressbar});
        },

        ProgressBarListener: function(){
            this.listenTo(this.mapperview, "map:ready", this.ProgressBarLoad);
            this.listenTo(this.progressbar, "bar:ready", this.ProgressBarReady);
        },

        ProgressBarLoad: function(status){
          var step = 100/status.totalDefinitions;
          var name = status.modelName;
          var activity = status.activity;
          this.progressbar.add(step, name, activity);
        },

        ProgressBarReady: function(){
            console.log("ProgressBar ready!");
        }



    });

    return AppView;
});
