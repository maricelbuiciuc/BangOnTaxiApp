angular.module('bangOnTaxiApp.services', ['firebase'])

.factory('Firebase', function($http, $q) {
  return {
    saveLicence: function(id, email, licence) {
      console.log('ID: ' + id);
      console.log('Email: ' + email);
      console.log('Licence: ' + licence);

      firebase.database().ref('users/' + id).set({
        email   : email,
        licence : licence
      });
    },
    saveReport: function(user, report) {
      console.log('User: ' + JSON.stringify(user));
      console.log('Report: ' + JSON.stringify(report));

      console.log('Date: ' + new Date());

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
