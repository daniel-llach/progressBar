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
            var calculateBarWidth = parseInt( (this.model.get("loaded")*100) / this.model.get("total") );
            this.$el.find(".barProgress").css({"width": calculateBarWidth + "%"});
            this.$el.find(".percent").html( calculateBarWidth + "%" );
        }

    });

    return ProgressBarView;
});
