import { Template } from 'meteor/templating';

import '../api/lib.js';

import './body.html';


export function update() {
  var myCanvas = document.getElementById('canv');
  var ctx = myCanvas.getContext('2d');
  var img = new Image();
  var _color = document.getElementById('color').value;
  var _slop = document.getElementById('slop').value;
  myCanvas.style.height = 'auto';

  img.onload = function(){
    height = img.height;
    width = img.width;
    //Set the canvas width to whatever the pic was
    myCanvas.width = width;
    myCanvas.height = height;
    ctx.drawImage(img, 0, 0);
    if (Meteor.Device.isDesktop()) {
      myCanvas.style.width = "55%";
      myCanvas.style.height = 'auto';
      myCanvas.style.left = ((window.width + width) / 2 + 64) + "px";
      myCanvas.style.top = 180 + "px";
    } else {
      myCanvas.style.width = "95%";
      myCanvas.style.height = 'auto';
      //myCanvas.style.left = ((window.width) / 2 + width / 6 + 8) + "px";
      myCanvas.style.left = (window.width + width) / 2 - 110 + "px";
      myCanvas.style.top = "100px";
    }
    find_patterns(myCanvas, _color, _slop);
  };
  img.src = global_image;
}

//Click phot button
Template.example.events({
  'click .takePhoto': function(event, template) {
        //We ask them for a picture
        var camop = {};
        MeteorCamera.getPicture(camop, function (error, data) {
           if (!error) { //no errors
            global_image = data;
            update();
          }
        });
event.preventDefault();
},
  'click .center': function(event, template) {
    update();
}
});