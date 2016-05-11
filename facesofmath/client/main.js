import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import '../imports/ui/body.js';
import './main.html';


//these functions are for html accessing width and height
Template.registerHelper('width', function() {
   return width;
});

Template.registerHelper('height', function() {
   return height;
});
