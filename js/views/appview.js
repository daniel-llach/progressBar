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

            this.call(this.progressbar.get("total"));

            this.listenTo(this.progressbar, "bar:ready", function(){
                console.log("complete progressbar 1!");

            });
        },

        call: function(total){
            var self = this;
            $.ajax({
                xhr: function() {
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", function(evt) {
                        if (evt.lengthComputable) {
                            var percentComplete = evt.loaded / evt.total;
                            //Do something with upload progress here
                            self.progressbar.add(percentComplete);
                        }else{
                            self.progressbar.add(total/4);
                        }
                   }, false);

                   xhr.addEventListener("progress", function(evt) {
                       if (evt.lengthComputable) {
                           var percentComplete = evt.loaded / evt.total;
                           //Do something with download progress
                           self.progressbar.add(percentComplete);
                       }else{
                           console.log("not computable");
                           self.progressbar.add(total/4);
                       }
                   }, false);

                   return xhr;
                },
                type: 'GET',
                url: "http://localhost/darwined/testing/api_asignaturas",
                data: {},
                success: function(data){
                    //Do something on success
                    console.log(data);
                    self.progressbar.add(total/2);

                }
            });

        }
    });



    return AppView;
});
