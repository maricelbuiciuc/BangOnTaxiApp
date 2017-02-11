angular.module('starter.controllers', ['firebase'])

.controller('WelcomeCtrl', function($scope, $state) {
  // Check if the user is loged in
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log('User is signed in!');
      console.log('USER: ' + JSON.stringify(user));
      $state.go('mainMenu');
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
        },
        function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // @TODO show errors to the user
            console.log('errorCode: ' + errorCode);
            console.log('errorMessage: ' + errorMessage);
        });
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

      $state.go('mainMenu');
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

  $scope.userProfile = function () {
    $state.go('userProfile');
  };
  $scope.streetMap = function () {
    $state.go('streetMap');
  };
  $scope.trafficInfo = function () {
    $state.go('trafficInfo');
  };
  $scope.parkingStatus = function () {
    $state.go('parkingStatus');
  };
  $scope.leaderboard = function () {
    $state.go('leaderboard');
  };
  $scope.speechRecognition = function () {
    $state.go('speechRecognition');
  };
  $scope.logOut = function() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log('Sign-out successful!');
      $state.go('welcome');
    },
    function(error) {
      // An error happened.
      console.log('An error happened: ' + JSON.stringify(error));
    });
  }
})

.controller('TrafficInfoCtrl', function($scope, $state) {
  $scope.accidents = function () {
    $state.go('accidents');
  };
  $scope.radarsCheckpoints = function () {
    $state.go('radarsCheckpoints');
  };
  $scope.busyBlockedRd = function () {
    $state.go('busyBlockedRd');
  };
})
.controller('UserProfileCtrl', function($scope, $state) {
})
.controller('StreetMapCtrl', function($scope, $state) {

  $scope.goHome = function() {
    $state.go('mainMenu');
  };

})
.controller('ParkingStatusCtrl', function($scope, $state) {
})
.controller('LeaderboardCtrl', function($scope, $state) {
})

.controller('SpeechRecognitionCtrl', function($scope, $state, Firebase) {

  $scope.saveReport = function (user, report) {
    Firebase.saveReport(user, report);
  };

  var commands = {
    'accident *val' : function(val) {
      console.log('Accident: ' + val);

      $scope.report = {
        'text': val,
        'type': 'accident'
      };

      $scope.$apply();
    },
    'traffic *val' : function(val) {
      console.log('Traffic: ' + val);

      $scope.report = {
        'text': val,
        'type': 'traffic'
      };

      $scope.$apply();
    },
    'clear' : function() {
      console.log('Action clear');

      $scope.report = null;
      $scope.$apply();
    },
    'send' : function() {
      console.log('Action send');

      // Check if the report exist
      if ($scope.report) {

        // Save the report to the database
        var user = firebase.auth().currentUser;

        $scope.saveReport(user, $scope.report);

        // Depends of the type do one action or one other
        switch ($scope.report.type) {
          case 'accident':
            $state.go('accidents');
            break;
          case 'traffic':
            $state.go('busyBlockedRd');
            break;
        };

        // Clear the object
        $scope.report = null;
      }
    }
  }

  annyang.addCommands(commands);
  annyang.start();
})

.controller('AccidentsCtrl', function($scope, $state) {

  var ref = firebase.database().ref('messages');

  ref.orderByChild("type").equalTo("accident").on('value', function(snapshot) {
    $scope.messages = snapshot.val();
    //$scope.$apply();
  });

/*
  var d1 = new Date();
  var d2 = new Date();

  //console.log('Hours: ' + d1.getHours());

  var now = d1.getTime();
  d2.setHours(d2.getHours() - 2);

  //console.log('Hours: ' + d2.getHours());
  var twoHoursAgo = d2.getTime();

  console.log('Start date: ' + now);
  console.log('End date: ' + twoHoursAgo);

  ref.orderByChild('date').startAt(now).endAt(twoHoursAgo).on('value', function(snapshot) {
    //console.log(snapshot.key());
    $scope.messages = snapshot.val();
  });
  */

})

.controller('RadarsCheckpointsCtrl', function($scope, $state) {
})

.controller('BusyBlockedRdCtrl', function($scope, $state) {

  var ref = firebase.database().ref('messages');

  ref.orderByChild("type").equalTo("traffic").on('value', function(snapshot) {
    $scope.messages = snapshot.val();
    //$scope.$apply();
  });

});
