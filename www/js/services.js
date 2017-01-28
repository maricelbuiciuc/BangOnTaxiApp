angular.module('starter.services', ['firebase'])

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

    }

  }
});
