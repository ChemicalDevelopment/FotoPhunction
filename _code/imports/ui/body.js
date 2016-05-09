import { Template } from 'meteor/templating';
 
import './body.html';


Template.example.events({
    'click .takePhoto': function(event, template) {
        var cameraOptions = {
            width: 800,
            height: 600
        };
        MeteorCamera.getPicture(cameraOptions, function (error, data) {
           if (!error) {
              var myCanvas = document.getElementById('canv');
              var ctx = myCanvas.getContext('2d');
              var img = new Image();
              img.onload = function(){
                ctx.drawImage(img, 0, 0);
              };
            img.src = data;
           }
        });
        event.preventDefault();
    }
});