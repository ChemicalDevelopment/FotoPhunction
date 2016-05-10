import { Template } from 'meteor/templating';

import '../api/lib.js';

import './body.html';


Meteor.startup(function () {
  //defaults
    /*width = 640;
    height = 640;*/
});

Template.example.events({
    'click .takePhoto': function(event, template) {
        var cameraOptions = {
            /*width: width,
            height: height,*/
        };
        MeteorCamera.getPicture(cameraOptions, function (error, data) {
           if (!error) {
            console.log(cameraOptions);
              var myCanvas = document.getElementById('canv');
              var ctx = myCanvas.getContext('2d');
              var img = new Image();
              img.onload = function(){
                height = img.height;
                width = img.width;
                myCanvas.width = width;
                myCanvas.height = height;
                ctx.drawImage(img, 0, 0);
                find_patterns(document.getElementById('canv'));
              };
            img.src = data;
           }
        });
        event.preventDefault();
    }
});