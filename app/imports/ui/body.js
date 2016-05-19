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
      var screenwidth = window.innerWidth || document.body.clientWidth;
      myCanvas.style.height = 'auto';
      myCanvas.style.left = ((screenwidth - width - (120 + 2 * 8)) / 2) + "px";
      myCanvas.style.top = "-225px";
    } else {
      myCanvas.style.height = 'auto';
      //myCanvas.style.left = ((window.width) / 2 + width / 6 + 8) + "px";
      //myCanvas.style.left = (window.width + width) / 2 - 110 + "px";
      //myCanvas.style.top = "100px";
    }
    find_patterns(myCanvas, _color, _slop);
  };
  img.src = global_image;
}

export function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

export function findPos(obj) {
  var curleft = 0, curtop = 0;
  if (obj.offsetParent) {
          do {
              curleft += obj.offsetLeft;
              curtop += obj.offsetTop;
          } while (obj = obj.offsetParent);
          return { x: curleft, y: curtop };
      }
  return undefined;
}

//Click phot button
Template.example.events({
  'click .takePhoto': function(event, template) {
        //Var that tells us to us my EyeDropper
        lookingForColor = false;
        //We ask them for a picture
        var camop = {  };
        MeteorCamera.getPicture(camop, function (error, data) {
           if (!error) { //no errors
            global_image = data;
            //By default, we look for whatever color was left
            update();
          }
        });
event.preventDefault();
},
  'click .updateTrigger': function(event, template) {
    if (lookingForColor == false) {
      update();
    }
},
  'click .colorpickerTrigger': function(event, template) {
    lookingForColor = true;
}
});


Template.canvas.events({
  'click': function(e, template) {
      if (true) {
          var ca = document.getElementById("canv")
        var pos = findPos(ca);
        var x = e.pageX - pos.x;
        var y = e.pageY - pos.y;
        var coord = "x=" + x + ", y=" + y;
        var c = ca.getContext('2d');
        var p = c.getImageData(x, y, 1, 1).data; 
        //var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
        console.log(coord + "       " + p);
        lookingForColor = false;
      }
    }
});
