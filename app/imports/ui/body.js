import { Template } from 'meteor/templating';

import '../api/lib.js';

import './body.html';

function initColorPicker() {
  document.getElementById("canv_zoom").onclick = function(e) {
      if (Meteor.isDesktop) {
        var ca = document.getElementById("canv_zoom");
        var pos = findPos(ca);
        var x = e.pageX - pos.x;
        var y = e.pageY - pos.y;
        console.log(x + ", " + y);
        var c = ca.getContext('2d');
        var p = c.getImageData(50 * x / 200, 50 * y / 200, 1, 1).data;
        var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
        console.log(hex);
        document.getElementById('color').value = hex; 
      } else {
        var ca = document.getElementById("canv_zoom");
        var pos = findPos(ca);
        var x = e.pageX - pos.x;
        var y = e.pageY - pos.y;
        console.log(x + ", " + y);
        var c = ca.getContext('2d');
        var p = c.getImageData(50 * x / 200, 50 * y / 200, 1, 1).data;
        var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
        console.log(hex);
        document.getElementById('color').value = hex; 
      }
  };
  isInitColorPicker = true;
}

export function colorZoomCanvas() {
  var c=document.getElementById("canv_zoom");
  var ctx=c.getContext("2d");
  ctx.fillStyle="#FF0000";
  ctx.fillRect(0, 0, 400,400);
}


export function update() {
  initColorPicker();
  var myCanvas = document.getElementById('canv');
  var ctx = myCanvas.getContext('2d');
  var img = new Image();
  var _color = document.getElementById('color').value;
  var _slop = document.getElementById('slop').value;
  if (!_slop) {
    _slop = 50;
  }

  img.onload = function(){
    height = img.height;
    width = img.width;
    //Set the canvas width to whatever the pic was
    myCanvas.width = width;
    myCanvas.height = height;
    ctx.drawImage(img, 0, 0);
    var screenwidth = window.innerWidth || document.body.clientWidth;
    if (Meteor.Device.isDesktop()) {
      myCanvas.style.maxWidth = 100 * width / screenwidth+ "%";
      //myCanvas.style.maxHeight = 'auto';
      //myCanvas.style.left = 100 * ((screenwidth - width) / 2) / screenwidth  + "%";
      //myCanvas.style.top = "-210px";
      myCanvas.style.visibility = "visible";
    } else {
      var cz = document.getElementById("canv_zoom");
      cz.style.left = "160px";
      cz.style.top = "-180px";
      myCanvas.style.width = "100%";
      //myCanvas.style.maxHeight = 'auto';
      //
      myCanvas.style.left = "0px"
      myCanvas.style.top = "320px";
      myCanvas.style.visibility = "visible";
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
      update();
}
});

Template.canvas.events({
  'click': function(e, template) {
      if (true) {
        var ca = document.getElementById("canv");
        var pos = findPos(ca);
        var x = e.pageX - pos.x;
        var y = e.pageY - pos.y;
        if (!Meteor.isDesktop) {
          x = x * width / screen.width;
          y = y * width / screen.width;
        }
        if (!(x > 0 && y < 0 && x < width && y < height)) {
          //return;
        }
        var c = ca.getContext('2d');
        var p = c.getImageData(x - 25, y - 25, 50, 50);
        var color_pick = document.getElementById("canv_zoom");
        _hh = 500;
        _ww = _hh * (16.0 / 9) * (135.0 / 120);
        color_pick.style.width = _ww + "px";
        color_pick.style.height = _hh + "px";
        var cpx = color_pick.getContext('2d');
        cpx.putImageData(p, 0, 0, 0, 0, 200, 200);
        //cpx.scale(4, 4);
      }
    }
});
