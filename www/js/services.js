angular.module('bangOnTaxiApp.services', ['firebase'])
//this our firebase service
.factory('Firebase', function($http, $q) {
  return {
    //that funcion here is to save the licence to the firebase
    saveLicence: function(id, email, licence) {
//we are saving the email and licence fom the user id
      firebase.database().ref('users/' + id).set({
        email   : email,
        licence : licence
      });
    },
//this function is to save one user message to the database
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
