angular.module('starter.controllers', ['firebase'])

.controller('WelcomeCtrl', function($scope, $state) {

  // Check if the user is loged in
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log('User is signed in!');
      console.log('USER: ' + JSON.stringify(user));

      $state.go('mainmenu');
    }
  });

  $scope.register = function () {
    $state.go('register');
  };

  $scope.login = function () {
    $state.go('login');
  };

})

.controller('RegisterCtrl', function($scope, $state, Firebase) {

  $scope.form = {};

  // Check if the user is loged in
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log('User is signed in!');
      console.log('USER: ' + JSON.stringify(user));

      //$state.go('mainmenu');
    }
  });

  $scope.register = function (form) {

    if (form.$valid) {
      var email     = $scope.form.email,
          password  = $scope.form.password,
          licence   = $scope.form.licence;

      console.log('Email: ' + email);
      console.log('Password: ' + password);
      console.log('Licence: ' + licence);

      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(user) {
            var user = firebase.auth().currentUser;

            // Save the Licence to the database.
            console.log('USER: ' + JSON.stringify(user));
            Firebase.saveLicence(user.uid, user.email, licence);

        }, function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            // @TODO show errors to the user
            console.log('errorCode: ' + errorCode);
            console.log('errorMessage: ' + errorMessage);
        });


/*
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...


        console.log('errorCode: ' + errorCode);
        console.log('errorMessage: ' + errorMessage);
      });*/

    }
  };
})

.controller('LoginCtrl', function($scope, $state) {

  $scope.form = {};

  // Check if the user is loged in
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log('User is signed in!');
      console.log('USER: ' + JSON.stringify(user));

      $state.go('mainmenu');
    }
  });

  $scope.login = function(form) {

    if (form.$valid) {
      var email = $scope.form.email;
      var password = $scope.form.password;

      console.log('Email: ' + email);
      console.log('Password: ' + password);

      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...


        console.log('errorCode: ' + errorCode);
        console.log('errorMessage: ' + errorMessage);



      });

    }
  };
})

.controller('MainMenuCtrl', function($scope, $state) {

  // Get the current user
  var user = firebase.auth().currentUser;

  if (user) {
    // User is signed in.
    console.log('USER: ' + JSON.stringify(user));

    $scope.user = {
      'email' : user.email
    }
  }

  $scope.userprofile = function () {
    $state.go('userprofile');
  };
  $scope.googlestreetmap = function () {
    $state.go('googlestreetmap');
  };
  $scope.trafficinformation = function () {
    $state.go('trafficinformation');
  };
  $scope.parkingstatus = function () {
    $state.go('parkingstatus');
  };
  $scope.leaderboard = function () {
    $state.go('leaderboard');
  };
  $scope.voicemessage = function () {
    $state.go('voicemessage');
  };

  $scope.logOut = function() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log('Sign-out successful!');

      $state.go('welcome');

    }, function(error) {
      // An error happened.
      console.log('An error happened: ' + JSON.stringify(error));
    });
  }
})

.controller('TrafficInformationCtrl', function($scope, $state) {
  $scope.accidents = function () {
    $state.go('accidents');
  };
  $scope.radarscheckpoints = function () {
    $state.go('radarscheckpoints');
  };
  $scope.busyblockedroads = function () {
    $state.go('busyblockedroads');
  };
})
.controller('UserProfileCtrl', function($scope, $state) {
})
.controller('GoogleStreetMapCtrl', function($scope, $state) {
})
.controller('ParkingStatusCtrl', function($scope, $state) {
})
.controller('LeaderboardCtrl', function($scope, $state) {
})
.controller('VoiceMessageCtrl', function($scope, $state) {
})
.controller('AccidentsCtrl', function($scope, $state) {
})
.controller('RadarsCheckpointsCtrl', function($scope, $state) {
})
.controller('BusyBlockedRoadsCtrl', function($scope, $state) {
});
