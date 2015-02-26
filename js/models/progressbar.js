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
                total: 0,
                name: "",
                activity: "cargando..."
            };
        },

        add: function(step, name, activity){

            if( this.get("loaded") + step >= this.get("total") ){
                this.set( "loaded",this.get("total") );
                this.set({ "name": name, "activity": activity });

                this.trigger("bar:ready");
            }else{
                this.set({ "name": name, "activity": activity });
                this.set( "loaded", this.get("loaded") + step );
            }
        }
    });

    return ProgressBar;
});
