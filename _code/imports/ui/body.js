import { Template } from 'meteor/templating';

import '../api/lib.js';

import './body.html';

//Click phot button
Template.example.events({
    'click .takePhoto': function(event, template) {
        //We ask them for a picture
        var camop = {};
        MeteorCamera.getPicture(camop, function (error, data) {
           if (!error) { //no errors
              //Get our canvas / context
              var myCanvas = document.getElementById('canv');
              var ctx = myCanvas.getContext('2d');
              var img = new Image();
              //We need to wait until it is loaded
              img.onload = function(){
                height = img.height;
                width = img.width;
                //Set the canvas width to whatever the pic was
                myCanvas.width = width;
                myCanvas.height = height;
                ctx.drawImage(img, 0, 0);
                //Find the patterns and draw
                find_patterns(myCanvas);
              };
            img.src = data;
           }
        });
        event.preventDefault();
    }
});