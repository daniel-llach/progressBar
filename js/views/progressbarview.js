/*global define*/
define([
    "backbone",
    "text!templates/progressbar.html"
], function (Backbone, ProgressBarTemplate) {
    "use strict";

    var ProgressBarView = Backbone.View.extend({

        template: _.template(ProgressBarTemplate),

        initialize: function(){
            this.$el = $(this.model.get("target"));

            this.listenTo(this.model, "change:loaded", this.update);

            this.render();
        },

        render: function(){
            this.$el.html( this.template(this.model.toJSON()) );
        },

        update: function(){
            console.log('ok');
            this.$el.find(".barProgress").css({"width":this.model.get("loaded") + "%"});
            this.$el.find(".percent").html( this.model.get("loaded") + "%" );
        }

    });

    return ProgressBarView;
});
