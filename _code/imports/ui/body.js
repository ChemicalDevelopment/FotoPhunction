import { Template } from 'meteor/templating';

import '../api/lib.js';

import './body.html';


Template.example.events({
    'click .takePhoto': function(event, template) {
        var cameraOptions = {
            width: 800,
            height: 800
        };
        MeteorCamera.getPicture(cameraOptions, function (error, data) {
           if (!error) {
              var myCanvas = document.getElementById('canv');
              var ctx = myCanvas.getContext('2d');
              var img = new Image();
              img.onload = function(){
                ctx.drawImage(img, 0, 0);
                find_patterns(document.getElementById('canv'));

              };
            img.src = data;
           }
        });
        event.preventDefault();
    }
});