angular.module('bangOnTaxiApp.services', ['firebase'])
//This is our firebase service
.factory('Firebase', function($http, $q) {
  return {
//That function here is to save the licence to the firebase
    saveLicence: function(id, email, licence) {
//We are saving the email and licence from the user id
      firebase.database().ref('users/' + id).set({
        email   : email,
        licence : licence
      });
    },
    
//This function is to save on user's messages to the database
    saveReport: function(user, report) {
      var newMessage = firebase.database().ref('messages').push();
      newMessage.set({
        uid       : user.uid,
        email     : user.email,
        message   : report.text,
        type      : report.type,
        date      : new Date().getTime(),
        location  : report.location
      });
    }
  }
});
