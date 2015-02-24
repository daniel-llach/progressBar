/*global define*/
define([
    "backbone"
], function (Backbone) {
    "use strict";

    var ProgressBar = Backbone.Model.extend({
        defaults: function () {
            return {
                target: "",
                loaded: 0,
                total: 0
            };
        },

        add: function(step){
            if( this.get("loaded") + step >= this.get("total") ){
                this.set( "loaded",this.get("total") );
                this.trigger("bar:ready");
            }else{
                this.set( "loaded", this.get("loaded") + step );
            }
        }
    });

    return ProgressBar;
});
