//the file controller is controling the app
angular.module('bangOnTaxiApp.controllers', ['firebase'])
//this controls welcome page
.controller('WelcomeCtrl', function($scope, $state) {
  // Check in the app if the user is loged in
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in redirect to main menu.
      console.log('User is signed in!');
      console.log('USER: ' + JSON.stringify(user));
      $state.go('mainMenu');
    }
  });
//two buttons one to go to egister and one for login
  $scope.register = function () {
    $state.go('register');
  };
  $scope.login = function () {
    $state.go('login');
  };
})

//this register controller that controls register activity
.controller('RegisterCtrl', function($scope, $state, Firebase) {
  $scope.goBack = function() {// arrow from top that brings user back
    $state.go('welcome');
  };
  $scope.form = {};//this is empty object for the form

  //this is register button when is clicket creates user name and password
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
            //we also added and updated the firebase with the licence
            Firebase.saveLicence(user.uid, user.email, licence);
        },
        function(error) {
            // here the is to Handle Errors.
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
      //if already loged in redirect him to main menu
      $state.go('mainMenu');
    }
  });
//this for the login button when a user try to log in
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
      });
    }
  };
})

.controller('MainMenuCtrl', function($scope, $state, $http) {

  // Get the current user and display the name and email
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
//these are buttons on the main menu
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
//by default we the details form wit this code
  $scope.showDetailsForm = true;
  $scope.showPasswordForm = false;

  // we are Geting  the current user and display on the detail user form
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      //we are going to firebase with these details and filing the form
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
//this is for update button to update user information on the database
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

      // this is to say that details were updated successfully
      var alert1 = $ionicPopup.alert({
        title: 'Success',
        template: 'Details updated successfully'
      });

      $timeout(function() {
        alert1.close(); //close the popup after 3 seconds
      }, 3000);
    }
  };
//this is the button to change the password
  $scope.changePassword = function(form) {
    if (form.$valid) {
      var password = $scope.form.password,
          password2 = $scope.form.password2;

      if (password === password2) {
        var user = firebase.auth().currentUser;
//we are updating the password on the database with this code
        user.updatePassword($scope.form.password).then(function() {

          // if everything is ok will say Success
          var alertSuccess = $ionicPopup.alert({
            title: 'Success',
            template: 'Update successful.'
          });

        }, function(error) {

          // if is not ok will show a error
          var alertError = $ionicPopup.alert({
            title: 'Error',
            template: error.message
          });

        });
      }
      else {

        // we are checking that both value are equal and if are not same will give a Error
        var alert2 = $ionicPopup.alert({
          title: 'Error',
          template: 'The values must be the same'
        });
      }
    }
  };
// this to display passwod form and change the view either for details or password forms
  $scope.displayPasswordForm = function() {
    $scope.showDetailsForm = false;
    $scope.showPasswordForm = true;
  };

  $scope.displayDetailsForm = function() {
    $scope.showDetailsForm = true;
    $scope.showPasswordForm = false;
  };
// this again for the back arrow button
  $scope.goBack = function() {
    $state.go('mainMenu');
  };
//this is for the home icon
  $scope.goHome = function() {
    $state.go('mainMenu');
  };
//this is for the ledearboard icon
  $scope.goLeaderboard = function() {
    $state.go('leaderboard');
  };
})
// street map section tha controls everithing for the map
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
//this are options to get the current position using the google maps API
  var options = {
    timeout             : 10000,
    enableHighAccuracy  : true
  };
//we are geting the current position of our browser
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
//we are centering the map wit our current position
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //here is the code where Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
//we are checking the current date
      var today = new Date();
      var ref = firebase.database().ref('messages');
//we are taking all the messages from the database
      ref.on('value', function(snapshot) {
//for all the messages...
        if (snapshot) {
          snapshot.forEach(function (childSnapshot) {

            var item = childSnapshot.val(),
                date = new Date(item.date);
//we are checking that the message date is from today
            if (
              today.getDate() == date.getDate() &&
              today.getMonth() == date.getMonth() &&
              today.getFullYear() == date.getFullYear()
            ) {
  //we are taking the location and the date from the message
              var color,
                  location = new google.maps.LatLng(item.location.latitude, item.location.longitude),
                  stringDate = '';

              stringDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
//depending on the message type we are using different colors on the map markers
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
//this is the URL for the marker icon
              var image = {
                url: 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=|' + color
              };
//here we are transforming longitude and latitude information into strings like addres and date
              var geocoder = new google.maps.Geocoder;
              geocoder.geocode({'location': location}, function(results, status) {
                if (status === 'OK') {
                  if (results[1]) {
//we are building the marker object
                    var marker = new google.maps.Marker({
                      icon      : image,
                      map       : $scope.map,
                      animation : google.maps.Animation.DROP,
                      position  : location
                    });
//we are building marker information. this is displayng information about a particular incident
                    var infoWindow = new google.maps.InfoWindow({
                      content   : '<b>' + item.type.charAt(0).toUpperCase() + item.type.slice(1) + '</b><br />' + results[1].formatted_address + '<br />' + stringDate
                    });
//this the function when click on particular incident
                    google.maps.event.addListener(marker, 'click', function () {
                      infoWindow.open($scope.map, marker);
                    });

                  }
                  else {
                    //if something goes wrong this display an error
                    window.alert('No results found');
                  }
                }
                else {
                //if something goes wrong this display an error
                  window.alert('Geocoder failed due to: ' + status);
                }
              });
            }

          });
        }
      });
    });

  },

//if something goes wrong with the location this display an error
  function(error){
    console.log("Could not get location");
  });
})

.controller('LeaderboardCtrl', function($scope, $state) {
  $scope.goBack = function() {//button to go back on main menu
    $state.go('mainMenu');//button to go back on main menu
  };
  $scope.goHome = function() {//function to go back on main menu
    $state.go('mainMenu');
  };

  var leaderboard = [];
  var ref = firebase.database().ref('messages');//take all the messages from the database

  ref.on('value', function(snapshot) {
    $scope.ranking = [];

    snapshot.forEach(function (childSnapshot) {//for ech message we are taking the value
      var item = childSnapshot.val();
      var email = item.email;

      if (leaderboard[email]) {//we checking if email(user name) exist
        leaderboard[email] += 1;//and adding plus 1
      }
      else {
        leaderboard[email] = 1;//we are adding the email for first time and give the value of 1 because is first time
      }
    });
//this array where email is saved and how many times that email is found
    var values = [];

    for (var key in leaderboard) {
      values.push([key, leaderboard[key]]);
    }
//we are sorting the array by the value
    function cmp(a, b) {
      return a[1] < b[1];
    }

    values.sort(cmp);

    for (var key in values) {
      let value = values[key];
//we are updating the ranking list with these values
      $scope.ranking.push({
        email: value[0],
        messages: value[1]
      });
    }
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
  //here we save the messages to the firebase
  $scope.saveReport = function (user, report) {
    Firebase.saveReport(user, report);
  };
//we are initialisating value
  var latitude,
      longitude,
      options = {
        timeout             : 10000,
        enableHighAccuracy  : true
      };
//here we get our current position
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
  });

//this are some voice commands for the speech recogition Library
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
//this is the clear command to clear meassage
    'clear' : function() {
      console.log('Action clear');
      $scope.report = null;
      $scope.$apply();
    },
    // this is the send command and here also saves the mesage to the databese
    'send' : function() {
      console.log('Action send');

      // this for the text form where we speak to Check if the report exist
      if ($scope.report) {
        // here Saves the report to the database
        var user = firebase.auth().currentUser;
//this to update the report with the current location
        $scope.report.location = {
          'longitude' : longitude,
          'latitude'  : latitude
        };
//this is the function to save the report to the database
        $scope.saveReport(user, $scope.report);
          // Depends of the type of the message we are redirecting to do one action or one other
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

        // this Clears the message form once is sended
        $scope.report = null;
      }
    }
  }
//here we are implementing the speech recognition library
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
//we are saving the current date to compare with the message dates
  var today = new Date();
  var ref = firebase.database().ref('messages');
//we are taking all the messages from the database with type=accident
  ref.orderByChild("type").equalTo("accident").on('value', function(snapshot) {
    $scope.messages = [];
//for each message we are taking their date
    snapshot.forEach(function (childSnapshot) {
      var item = childSnapshot.val();
      var date = new Date(item.date);
//down here we comparing the message date with the current date
      if (
        today.getDate() == date.getDate() &&
        today.getMonth() == date.getMonth() &&
        today.getFullYear() == date.getFullYear()
      ) {
        //if the message is from today we are buiding the date with different format
        item.date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
//here we are saving this message on the messages list wich is an array
        $scope.messages.push(item);
      }
    });
//we are checking if we have no message from today and displa a message "no messages today"
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
