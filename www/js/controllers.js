angular.module('bangOnTaxiApp.controllers', ['firebase'])
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
  $scope.goBack = function() {
    $state.go('welcome');
  };
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
  $scope.goBack = function() {
    $state.go('welcome');
  };
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

.controller('MainMenuCtrl', function($scope, $state, $http) {
  // Get the current user
  var user = firebase.auth().currentUser;
  if (user) {
    // User is signed in.
    console.log('USER: ' + JSON.stringify(user));
    $scope.user = {
      'email' : user.email
    }
  }

  $scope.goHome = function() {
    $state.go('mainMenu');
  };
  $scope.goLeaderboard = function() {
    $state.go('leaderboard');
  };

  $scope.userProfile = function () {
    $state.go('userProfile');
  };
  $scope.streetMap = function () {
    $state.go('streetMap');
  };
  $scope.roadInfo = function () {
    $state.go('roadInfo');
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

.controller('RoadInfoCtrl', function($scope, $state) {
  $scope.goBack = function() {
    $state.go('mainMenu');
  };
  $scope.accidents = function () {
    $state.go('accidents');
  };
  $scope.checkpoints = function () {
    $state.go('checkpoints');
  };
  $scope.traffic = function () {
    $state.go('traffic');
  };
  $scope.ranks = function () {
    $state.go('ranks');
  };

  $scope.goHome = function() {
    $state.go('mainMenu');
  };
  $scope.goLeaderboard = function() {
    $state.go('leaderboard');
  };
})

.controller('UserProfileCtrl', function($scope, $state) {
  $scope.goBack = function() {
    $state.go('mainMenu');
  };
  $scope.goHome = function() {
    $state.go('mainMenu');
  };
  $scope.goLeaderboard = function() {
    $state.go('leaderboard');
  };
})

.controller('StreetMapCtrl', function($scope, $state, $cordovaGeolocation) {
  $scope.goBack = function() {
    $state.go('mainMenu');
  };
  $scope.goHome = function() {
    $state.go('mainMenu');
  };
  $scope.goLeaderboard = function() {
    $state.go('leaderboard');
  };

  var options = {
    timeout             : 10000,
    enableHighAccuracy  : true
  };

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){

      var ref = firebase.database().ref('messages');
      ref.on('value', function(snapshot) {

        if (snapshot) {
          snapshot.forEach(function (childSnapshot) {

            var color,
                item = childSnapshot.val(),
                location = new google.maps.LatLng(item.location.latitude, item.location.longitude);

            console.log('Item: ' + JSON.stringify(item));
            console.log('location: ' + location);
            console.log('latLng: ' + latLng);

            switch (item.type) {
              case 'accident':
                color = 'FF0000';
                break;
              case 'traffic':
                color = 'FFFF00';
                break;
              case 'checkpoint':
                color = '00FF00';
                break;
              case 'rank':
                color = '6699FF';
                break;
              default:
                color = '9933FF';
            }

            var image = {
              url: 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=|' + color
            };

            var geocoder = new google.maps.Geocoder;
            geocoder.geocode({'location': location}, function(results, status) {
              if (status === 'OK') {
                if (results[1]) {

                  var marker = new google.maps.Marker({
                    icon      : image,
                    map       : $scope.map,
                    animation : google.maps.Animation.DROP,
                    position  : location
                  });

                  var infoWindow = new google.maps.InfoWindow({
                    content   : '<b>' + item.type.charAt(0).toUpperCase() + item.type.slice(1) + '</b><br />' + results[1].formatted_address
                  });

                  google.maps.event.addListener(marker, 'click', function () {
                    infoWindow.open($scope.map, marker);
                  });

                }
                else {
                  window.alert('No results found');
                }
              }
              else {
                window.alert('Geocoder failed due to: ' + status);
              }
            });
          });
        }
      });
    });

  }, function(error){
    console.log("Could not get location");
  });
})

.controller('LeaderboardCtrl', function($scope, $state) {
  $scope.goBack = function() {
    $state.go('mainMenu');
  };
  $scope.goHome = function() {
    $state.go('mainMenu');
  };
})

.controller('SpeechRecognitionCtrl', function($scope, $state, Firebase, $cordovaGeolocation) {
  $scope.goBack = function() {
    $state.go('mainMenu');
  };
  $scope.goHome = function() {
    $state.go('mainMenu');
  };
  $scope.goLeaderboard = function() {
    $state.go('leaderboard');
  };
  $scope.saveReport = function (user, report) {
    Firebase.saveReport(user, report);
  };

  var latitude,
      longitude,
      options = {
        timeout             : 10000,
        enableHighAccuracy  : true
      };

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
  });

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

    'checkpoint *val' : function(val) {
      console.log('Checkpoint: ' + val);
      $scope.report = {
        'text': val,
        'type': 'checkpoint'
      };
      $scope.$apply();
    },

    'rank *val' : function(val) {
      console.log('Rank: ' + val);
      $scope.report = {
        'text': val,
        'type': 'rank'
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

        $scope.report.location = {
          'longitude' : longitude,
          'latitude'  : latitude
        };

        $scope.saveReport(user, $scope.report);

          // Depends of the type do one action or one other
          switch ($scope.report.type) {
            case 'accident':
              $state.go('accidents');
              break;
            case 'traffic':
              $state.go('traffic');
              break;
            case 'checkpoint':
              $state.go('checkpoints');
              break;
            case 'rank':
                $state.go('ranks');
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
  $scope.goBack = function() {
    $state.go('roadInfo');
  };
  $scope.goHome = function() {
    $state.go('mainMenu');
  };
  $scope.goLeaderboard = function() {
    $state.go('leaderboard');
  };

  var ref = firebase.database().ref('messages');
  ref.orderByChild("type").equalTo("accident").on('value', function(snapshot) {
    $scope.messages = snapshot.val();
    //$scope.$apply();
  });

/*
    var d1 = new Date();
    console.log(d1);

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

.controller('CheckpointsCtrl', function($scope, $state) {
  $scope.goBack = function() {
    $state.go('roadInfo');
  };
  $scope.goHome = function() {
    $state.go('mainMenu');
  };
  $scope.goLeaderboard = function() {
    $state.go('leaderboard');
  };
    var ref = firebase.database().ref('messages');
    ref.orderByChild("type").equalTo("checkpoint").on('value', function(snapshot) {
      $scope.messages = snapshot.val();
  });
})

.controller('RanksCtrl', function($scope, $state) {
  $scope.goBack = function() {
    $state.go('roadInfo');
  };
  $scope.goHome = function() {
    $state.go('mainMenu');
  };
  $scope.goLeaderboard = function() {
    $state.go('leaderboard');
  };
  var ref = firebase.database().ref('messages');
  ref.orderByChild("type").equalTo("rank").on('value', function(snapshot) {
    $scope.messages = snapshot.val();
  });
})

.controller('TrafficCtrl', function($scope, $state) {
  $scope.goBack = function() {
    $state.go('roadInfo');
  };
  $scope.goHome = function() {
    $state.go('mainMenu');
  };
  $scope.goLeaderboard = function() {
    $state.go('leaderboard');
  };
  var ref = firebase.database().ref('messages');
  ref.orderByChild("type").equalTo("traffic").on('value', function(snapshot) {
    $scope.messages = snapshot.val();
    //$scope.$apply();
  });
//  $state.go($state.current, {}, {reload: true});
});
