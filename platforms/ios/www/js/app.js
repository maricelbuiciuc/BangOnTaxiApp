// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'firebase'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('welcome', {
      url: '/welcome',
      templateUrl: 'templates/welcome.html',
      controller: 'WelcomeCtrl'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'RegisterCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
    .state('mainmenu', {
      url: '/mainmenu',
      templateUrl: 'templates/mainmenu.html',
      controller: 'MainMenuCtrl'
    })
    .state('userprofile', {
      url: '/userprofile',
      templateUrl: 'templates/userprofile.html',
      controller: 'UserProfileCtrl'
    })
    .state('googlestreetmap', {
      url: '/googlestreetmap',
      templateUrl: 'templates/googlestreetmap.html',
      controller: 'GoogleStreetMapCtrl'
    })
    .state('trafficinformation', {
      url: '/trafficinformation',
      templateUrl: 'templates/trafficinformation.html',
      controller: 'TrafficInformationCtrl'
    })
    .state('parkingstatus', {
      url: '/parkingstatus',
      templateUrl: 'templates/parkingstatus.html',
      controller: 'ParkingStatusCtrl'
    })
    .state('leaderboard', {
      url: '/leaderboard',
      templateUrl: 'templates/leaderboard.html',
      controller: 'LeaderboardCtrl'
    })
    .state('voicemessage', {
      url: '/voicemessage',
      templateUrl: 'templates/voicemessage.html',
      controller: 'VoiceMessageCtrl'
    })
    .state('accidents', {
      url: '/accidents',
      templateUrl: 'templates/accidents.html',
      controller: 'AccidentsCtrl'
    })
    .state('radarscheckpoints', {
      url: '/radarscheckpoints',
      templateUrl: 'templates/radarscheckpoints.html',
      controller: 'RadarsCheckpointsCtrl'
    })
    .state('busyblockedroads', {
      url: '/busyblockedroads',
      templateUrl: 'templates/busyblockedroads.html',
      controller: 'BusyBlockedRoadsCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');

});
