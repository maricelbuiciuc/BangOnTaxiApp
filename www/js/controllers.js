//This is the file controller which is manage the entire app controllers
angular.module('bangOnTaxiApp.controllers', ['firebase'])
//This controller is manage the welcome activity
.controller('WelcomeCtrl', function($scope, $state) {
// this Checks into the app if the user is loged in
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
// If the User is signed in successfully then is redirected to the main menu actvity
      console.log('User is signed in!');
      console.log('USER: ' + JSON.stringify(user));
      $state.go('mainMenu');
    }
  });
//Below are two buttons one to go to the register activity and one for login activity
  $scope.register = function () {
    $state.go('register');
  };
  $scope.login = function () {
    $state.go('login');
  };
})

//Below is the "Register" controller that manages "register" activity
.controller('RegisterCtrl', function($scope, $state, Firebase) {
// This is for the arrow from top that brings user back
  $scope.goBack = function() {
//That redirect's user to welcome activity
    $state.go('welcome');
  };
//This is the empty object for the form
  $scope.form = {};
//This is the register button and when is clicket creates user name and password
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
// Save the Licence number to the database.
            console.log('USER: ' + JSON.stringify(user));
//We also added and updated the firebase with the Taxi licence Number
            Firebase.saveLicence(user.uid, user.email, licence);
        },
        function(error) {S
// Below is the code that manages the Errors
            var errorCode = error.code;
            var errorMessage = error.message;
            // @TODO Below is showing the errors to the user
            console.log('errorCode: ' + errorCode);
            console.log('errorMessage: ' + errorMessage);
        });
      }
   };
})

//Below is the "Login" controller that manages "login" activity
.controller('LoginCtrl', function($scope, $state, $ionicPopup, $timeout) {
  $scope.goBack = function() {
    $state.go('welcome');
  };
  $scope.form = {};
// Below we check if the user is loged in
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
//If the user is already loged in redirect's him to the main menu
      $state.go('mainMenu');
    }
  });
//This is for the login button when a user try to log in
  $scope.login = function(form) {
    if (form.$valid) {
      var email = $scope.form.email,
          password = $scope.form.password;
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
// If details are not valid an Error will be displayed
        var alertError = $ionicPopup.alert({
          title: 'Login Error',
          template: error.message
        });
      });
    }
  };
})

//Below is the "Main Menu" controller that manages "main menu" activity
.controller('MainMenuCtrl', function($scope, $state, $http) {
// Get the current user and display the name and email
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
// This shows if user is signed in
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
//These are the function for the buttons on the main menu activity
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
// This shows when Sign-out was successful
      console.log('Sign-out successful!');
      $state.go('welcome');
    },
    function(error) {
// When an error was happened
      console.log('An error happened: ' + JSON.stringify(error));
    });
  }
})

//Below is the "Road Info" controller that manages "road info" activity
.controller('RoadInfoCtrl', function($scope, $state) {
//These are the functions for the buttons on the Road Info activity
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

//Below is the "User Profile" controller that manages "user profile" activity
.controller('UserProfileCtrl', function($scope, $state, $ionicPopup, $timeout) {
//By default we display the details form with this code
  $scope.showDetailsForm = true;
  $scope.showPasswordForm = false;
// We are geting the current user and display on the detail user form
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
// User is signed in AND
//We are going to firebase with these set of details and filing the form
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
//This is for update button to update user information on the database
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
// This is to say that the details were updated successfully
      var alert1 = $ionicPopup.alert({
        title: 'Success',
        template: 'Details updated successfully'
      });
      $timeout(function() {
        alert1.close(); //close the popup after 3 seconds
      }, 3000);
    }
  };
//This is the button to change the password
  $scope.changePassword = function(form) {
    if (form.$valid) {
      var password = $scope.form.password,
          password2 = $scope.form.password2;
      if (password === password2) {
        var user = firebase.auth().currentUser;
//We are updating the password on the database with this code
        user.updatePassword($scope.form.password).then(function() {
// If everything its ok a pop up message will say "Success"
          var alertSuccess = $ionicPopup.alert({
            title: 'Success',
            template: 'Update successful.'
          });
        }, function(error) {
// If its not ok a pop up message will say "Error"
          var alertError = $ionicPopup.alert({
            title: 'Error',
            template: error.message
          });
        });
      }
      else {
// We are checking that both value are equal and if they are not the same will give an "Error" message
        var alert2 = $ionicPopup.alert({
          title: 'Error',
          template: 'The values must be the same'
        });
      }
    }
  };
// This is to display passwod form and change the view either for details or for password forms
  $scope.displayPasswordForm = function() {
    $scope.showDetailsForm = false;
    $scope.showPasswordForm = true;
  };
  $scope.displayDetailsForm = function() {
    $scope.showDetailsForm = true;
    $scope.showPasswordForm = false;
  };
// This is again for the back arrow button
  $scope.goBack = function() {
    $state.go('mainMenu');
  };
//This is for the home icon button
  $scope.goHome = function() {
    $state.go('mainMenu');
  };
//This is for the ledearboard icon button
  $scope.goLeaderboard = function() {
    $state.go('leaderboard');
  };
})

//Below is the "Street Map" controller that manages "street map" activity
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
  //These are options to get the current position using the google maps API
  var options = {
    timeout             : 10000,
    enableHighAccuracy  : true
  };
//We are geting the current position of the browser
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
//We are centering the map with our current position
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
//Here is the code where it waits until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
//We are checking the current date
      var today = new Date();
      var ref = firebase.database().ref('messages');
//We are taking all the messages from the database
      ref.on('value', function(snapshot) {
//For all the messages...
        if (snapshot) {
          snapshot.forEach(function (childSnapshot) {
            var item = childSnapshot.val(),
                date = new Date(item.date);
//We are checking that the message date is from today
            if (
              today.getDate() == date.getDate() &&
              today.getMonth() == date.getMonth() &&
              today.getFullYear() == date.getFullYear()
            ) {
//We are taking the location and the date from the message
              var color,
                  location = new google.maps.LatLng(item.location.latitude, item.location.longitude),
                  stringDate = '';
              stringDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
//Depending on the message type we are using different colors on the map markers
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
//This is the URL for the marker icon
              var image = {
                url: 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=|' + color
              };
//Here we are transforming longitude and latitude information into strings like addres and date
              var geocoder = new google.maps.Geocoder;
              geocoder.geocode({'location': location}, function(results, status) {
                if (status === 'OK') {
                  if (results[1]) {
//Here we are building the marker object
                    var marker = new google.maps.Marker({
                      icon      : image,
                      map       : $scope.map,
                      animation : google.maps.Animation.DROP,
                      position  : location
                    });
//We are building marker information which displays details about a particular incident
                    var infoWindow = new google.maps.InfoWindow({
                      content   : '<b>' + item.type.charAt(0).toUpperCase() + item.type.slice(1) + '</b><br />' + results[1].formatted_address + '<br />' + stringDate
                    });
//This is the function when user clicks on particular incident
                    google.maps.event.addListener(marker, 'click', function () {
                      infoWindow.open($scope.map, marker);
                    });
                  }
                  else {
//If something goes wrong this code is to display an error message
                    window.alert('No results found');
                  }
                }
                else {
//If something goes wrong this code is to display an error message
                  window.alert('Geocoder failed due to: ' + status);
                }
              });
            }
          });
        }
      });
    });
  },
//If something goes wrong with the location this will display an error message
  function(error){
    console.log("Could not get location");
  });
})

//Below is the "Leaderboard" controller that manages "leaderboard" activity
.controller('LeaderboardCtrl', function($scope, $state) {
//Arrow button function to go back on main menu
  $scope.goBack = function() {
    $state.go('mainMenu');
  };
//The home icon button function to go back on main menu
  $scope.goHome = function() {
    $state.go('mainMenu');
  };
  var leaderboard = [];
//Take all the messages from the database
  var ref = firebase.database().ref('messages');
  ref.on('value', function(snapshot) {
    $scope.ranking = [];
//For ech message we are taking the value
    snapshot.forEach(function (childSnapshot) {
      var item = childSnapshot.val();
      var email = item.email;
//Here we checking if email(user name) exist
      if (leaderboard[email]) {
//We adding plus 1
        leaderboard[email] += 1;
      }
      else {
//We are adding the email for first time and give the value of 1 because is first time
        leaderboard[email] = 1;
      }
    });
//This is the array where the email is saved and how many times that emailhas been found
    var values = [];
    for (var key in leaderboard) {
      values.push([key, leaderboard[key]]);
    }
//We are sorting the array by the value
    function cmp(a, b) {
      return a[1] < b[1];
    }
    values.sort(cmp);
    for (var key in values) {
      var value = values[key];
//We are updating the ranking list with these values
      $scope.ranking.push({
        email: value[0],
        messages: value[1]
      });
    }
  });
})

//Below is the "Speech Recognition" controller that manages "speech recognition" activity
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
//Down here we save the reports/messages to the firebase
  $scope.saveReport = function (user, report) {
    Firebase.saveReport(user, report);
  };
//We are initialisation value
  var latitude,
      longitude,
      options = {
        timeout             : 10000,
        enableHighAccuracy  : true
      };
//Down here we get the current position
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
  });
//Below this are some voice commands functions for the speech recogition Library
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
//Below this is the code for "CLEAR" command function to clear report/meassage
    'clear' : function() {
      console.log('Action clear');
      $scope.report = null;
      $scope.$apply();
    },
// Below is the code for "SEND" command function
    'send' : function() {
      console.log('Action send');
// This for the text form where we speak to Check if the report exist
      if ($scope.report) {
// Here starts the process for saving the Message to the database
        var user = firebase.auth().currentUser;
//This is to update the Message with the current location
        $scope.report.location = {
          'longitude' : longitude,
          'latitude'  : latitude
        };
//This is the function to save the report to the database
        $scope.saveReport(user, $scope.report);
// Depends on the type of the message we are redirecting to do one action or one other
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
// Below is the code which Clears the message form once the report/message has been sent it
        $scope.report = null;
      }
    }
  }
//Below we are implementing the speech recognition library
  annyang.addCommands(commands);
  annyang.start();
})

//Below is the "Accidents" controller that manages "accidents" activity
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
//We are saving the current date to compare with the message dates
  var today = new Date();
  var ref = firebase.database().ref('messages');
//We are taking all the messages from the database with type=accident
  ref.orderByChild("type").equalTo("accident").on('value', function(snapshot) {
    $scope.messages = [];
//For each message we are taking their date
    snapshot.forEach(function (childSnapshot) {
      var item = childSnapshot.val();
      var date = new Date(item.date);
//Down here we comparing the message date with the current date
      if (
        today.getDate() == date.getDate() &&
        today.getMonth() == date.getMonth() &&
        today.getFullYear() == date.getFullYear()
      ) {
//If the message is from today we are building the date with different format
        item.date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
//Here we are saving this message on the messages list which is an array
        $scope.messages.push(item);
      }
    });
//We are checking if there are no messages from today and display a message "no messages today"
    if ($scope.messages.length == 0) {
      $scope.messages.push({
        email: 'No messages for today.',
        date: '',
        message: ''
      });
    }
  });
})

//Below is the "Checkpoints" controller that manages "checkpoints" activity
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
//We are saving the current date to compare with the message dates
  var today = new Date();
  var ref = firebase.database().ref('messages');
//We are taking all the messages from the database with type=Checkpoint
  ref.orderByChild("type").equalTo("checkpoint").on('value', function(snapshot) {
    $scope.messages = [];
//For each message we are taking their date
    snapshot.forEach(function (childSnapshot) {
      var item = childSnapshot.val();
      var date = new Date(item.date);
//Down here we comparing the message date with the current date
      if (
        today.getDate() == date.getDate() &&
        today.getMonth() == date.getMonth() &&
        today.getFullYear() == date.getFullYear()
      ) {
//If the message is from today we are building the date with different format
        item.date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
//Here we are saving this message on the messages list which is an array
        $scope.messages.push(item);
      }
    });
    //We are checking if there are no messages from today and display a message "no messages today"
    if ($scope.messages.length == 0) {
      $scope.messages.push({
        email: 'No messages for today.',
        date: '',
        message: ''
      });
    }
  });
})

//Below is the "Ranks" controller that manages "ranks" activity
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
//We are saving the current date to compare with the message dates
  var today = new Date();
  var ref = firebase.database().ref('messages');
//We are taking all the messages from the database with type=rank
  ref.orderByChild("type").equalTo("rank").on('value', function(snapshot) {
    $scope.messages = [];
//For each message we are taking their date
    snapshot.forEach(function (childSnapshot) {
      var item = childSnapshot.val();
      var date = new Date(item.date);
//Down here we comparing the message date with the current date
      if (
        today.getDate() == date.getDate() &&
        today.getMonth() == date.getMonth() &&
        today.getFullYear() == date.getFullYear()
      ) {
//If the message is from today we are building the date with different format
        item.date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
//Here we are saving this message on the messages list which is an array
        $scope.messages.push(item);
      }
    });
//We are checking if there are no messages from today and display a message "no messages today"
    if ($scope.messages.length == 0) {
      $scope.messages.push({
        email: 'No messages for today.',
        date: '',
        message: ''
      });
    }
  });
})

//Below is the "Traffic" controller that manages "traffic" activity
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
//We are saving the current date to compare with the message dates
  var today = new Date();
  var ref = firebase.database().ref('messages');
//We are taking all the messages from the database with type=traffic
  ref.orderByChild("type").equalTo("traffic").on('value', function(snapshot) {
    $scope.messages = [];
//For each message we are taking their date
    snapshot.forEach(function (childSnapshot) {
      var item = childSnapshot.val();
      var date = new Date(item.date);
//Down here we comparing the message date with the current date
      if (
        today.getDate() == date.getDate() &&
        today.getMonth() == date.getMonth() &&
        today.getFullYear() == date.getFullYear()
      ) {
//If the message is from today we are building the date with different format
        item.date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
//Here we are saving this message on the messages list which is an array
        $scope.messages.push(item);
      }
    });
//We are checking if there are no messages from today and display a message "no messages today"
    if ($scope.messages.length == 0) {
      $scope.messages.push({
        email: 'No messages for today.',
        date: '',
        message: ''
      });
    }
  });
});
