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
               template.$('.photo').attr('src', data); 
           }
        });
        event.preventDefault();
    }
});

Template.body.helpers({
  tasks() {
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
});

Template.body.events({
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const text = target.text.value;
 
    // Insert a task into the collection
    /*Tasks.insert({
      text,
      createdAt: new Date(), // current time,
      hash: _hash,
    });*/
 
    // Clear form
    Meteor.call('tasks.insert', text);

    target.text.value = '';
  },
});
