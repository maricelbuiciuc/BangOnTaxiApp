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

      var newMessage = firebase.database().ref('messages').push();
      newMessage.set({
        uid       : user.uid,
        email     : user.email,
        message   : report.text,
        type      : report.type,
        //created   : firebase.database.ServerValue.TIMESTAMP
        date      : new Date().getTime()
      });
    }
  }
/*
  $scope.doRefresh = function() {
     $http.get('/new-items')
      .success(function(newItems) {
        $scope.items = newItems;
      })
      .finally(function() {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
   };
*/

});