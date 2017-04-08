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

.controller('LoginCtrl', function($scope, $state, $ionicPopup, $timeout) {
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
      var email = $scope.form.email,
          password = $scope.form.password;
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {

        // Error
        var alertError = $ionicPopup.alert({
          title: 'Login Error',
          template: error.message
        });

        /*$timeout(function() {
          alertError.close();
        }, 3000);*/
      });
    }
  };
})

.controller('MainMenuCtrl', function($scope, $state, $http) {

  // Get the current user
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var ref = firebase.database().ref('users/' + user.uid);
      ref.on('value', function(snapshot) {
        var obj = snapshot.val();

        $scope.user = {
          name      : obj.name,
          email     : obj.email
        }
      });
    }
  });

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

.controller('UserProfileCtrl', function($scope, $state, $ionicPopup, $timeout) {
  $scope.showDetailsForm = true;
  $scope.showPasswordForm = false;

  // Get the current user
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var ref = firebase.database().ref('users/' + user.uid);
      ref.on('value', function(snapshot) {
        var obj = snapshot.val();
        $scope.form = {
          id        : user.uid,
          name      : obj.name,
          surname   : obj.surname,
          email     : obj.email,
          licence   : obj.licence
        }
      });
    }
  });

  $scope.update = function(form) {
    if (form.$valid) {
      var id = $scope.form.id;
      var name = $scope.form.name;
      var surname = $scope.form.surname;
      var email = $scope.form.email;
      var licence = $scope.form.licence;

      firebase.database().ref('users/' + id).set({
        name: name,
        surname: surname,
        email: email,
        licence : licence
      });

      // Success message
      var alert1 = $ionicPopup.alert({
        title: 'Success',
        template: 'Details updated successfully'
      });

      $timeout(function() {
        alert1.close(); //close the popup after 3 seconds for some reason
      }, 3000);
    }
  };

  $scope.changePassword = function(form) {
    if (form.$valid) {
      var password = $scope.form.password,
              password2 = $scope.form.password2;
          if (password === password2) {
      var user = firebase.auth().currentUser;
        user.updatePassword($scope.form.password).then(function() {

          // Success
      var alertSuccess = $ionicPopup.alert({
        title: 'Success',
        template: 'Update successful.'
      });

      $timeout(function() {
            alertSuccess.close();
          }, 3000);

        }, function(error) {

          // Error
          var alertError = $ionicPopup.alert({
            title: 'Error',
            template: error.message
          });

          $timeout(function() {
            alertError.close();
          }, 3000);

        });
      }
      else {

        // Error
        var alert2 = $ionicPopup.alert({
          title: 'Error',
          template: 'The values must be the same'
        });

        $timeout(function() {
          alert2.close(); //close the popup after 3 seconds for some reason
        }, 3000);
      }
    }
  };

  $scope.displayPasswordForm = function() {
    $scope.showDetailsForm = false;
    $scope.showPasswordForm = true;
  };

  $scope.displayDetailsForm = function() {
    $scope.showDetailsForm = true;
    $scope.showPasswordForm = false;
  };

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

  var leaderboard = [];
  var ref = firebase.database().ref('messages');

  ref.on('value', function(snapshot) {
    $scope.ranking = [];

    snapshot.forEach(function (childSnapshot) {
      var item = childSnapshot.val();

      console.log('item', item);

      var email = item.email;
      console.log('email', email);

      if (leaderboard[email]) {
        //var val = leaderboard[email];
        leaderboard[email] += 1;
        console.log('exist');
        console.log('leaderboard[email]: ', leaderboard[email]);
      }
      else {
        leaderboard[email] = 1;
        console.log('no exist');
        console.log('leaderboard[email]: ', leaderboard[email]);
      }

    });

    console.log('leaderboard: ', leaderboard);

    //$scope.ranking = leaderboard;

    for (var key in leaderboard) {
      let value = leaderboard[key];
      console.log(value);

      $scope.ranking.push({
        email: key,
        messages: value
      });
    }

    /*forEach (leaderboard as key => value) {

      console.log('key: ' + key);
      console.log('value: ' + value);

    }*/

  });

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

  var today = new Date();
  var ref = firebase.database().ref('messages');

  ref.orderByChild("type").equalTo("accident").on('value', function(snapshot) {
    $scope.messages = [];

    snapshot.forEach(function (childSnapshot) {
      var item = childSnapshot.val();
      var date = new Date(item.date);

      if (
        today.getDate() == date.getDate() &&
        today.getMonth() == date.getMonth() &&
        today.getFullYear() == date.getFullYear()
      ) {
        item.date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
        $scope.messages.push(item);
      }
    });

    if ($scope.messages.length == 0) {
      $scope.messages.push({
        email: 'No messages for today.',
        date: '',
        message: ''
      });
    }

  });
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

  var today = new Date();
  var ref = firebase.database().ref('messages');

  ref.orderByChild("type").equalTo("checkpoint").on('value', function(snapshot) {
    $scope.messages = [];

    snapshot.forEach(function (childSnapshot) {
      var item = childSnapshot.val();
      var date = new Date(item.date);

      if (
        today.getDate() == date.getDate() &&
        today.getMonth() == date.getMonth() &&
        today.getFullYear() == date.getFullYear()
      ) {
        item.date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
        $scope.messages.push(item);
      }
    });

    if ($scope.messages.length == 0) {
      $scope.messages.push({
        email: 'No messages for today.',
        date: '',
        message: ''
      });
    }

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

  var today = new Date();
  var ref = firebase.database().ref('messages');

  ref.orderByChild("type").equalTo("rank").on('value', function(snapshot) {
    $scope.messages = [];

    snapshot.forEach(function (childSnapshot) {
      var item = childSnapshot.val();
      var date = new Date(item.date);

      if (
        today.getDate() == date.getDate() &&
        today.getMonth() == date.getMonth() &&
        today.getFullYear() == date.getFullYear()
      ) {
        item.date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
        $scope.messages.push(item);
      }
    });

    if ($scope.messages.length == 0) {
      $scope.messages.push({
        email: 'No messages for today.',
        date: '',
        message: ''
      });
    }

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

  var today = new Date();
  var ref = firebase.database().ref('messages');

  ref.orderByChild("type").equalTo("traffic").on('value', function(snapshot) {
    $scope.messages = [];

    snapshot.forEach(function (childSnapshot) {
      var item = childSnapshot.val();
      var date = new Date(item.date);

      if (
        today.getDate() == date.getDate() &&
        today.getMonth() == date.getMonth() &&
        today.getFullYear() == date.getFullYear()
      ) {
        item.date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
        $scope.messages.push(item);
      }
    });

    if ($scope.messages.length == 0) {
      $scope.messages.push({
        email: 'No messages for today.',
        date: '',
        message: ''
      });
    }

  });
});
