// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('bangOnTaxiApp', ['ionic', 'bangOnTaxiApp.controllers', 'bangOnTaxiApp.services', 'firebase'])
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
    .state('mainMenu', {
      url: '/mainMenu',
      templateUrl: 'templates/mainMenu.html',
      controller: 'MainMenuCtrl'
    })
    .state('userProfile', {
      url: '/userProfile',
      templateUrl: 'templates/userProfile.html',
      controller: 'UserProfileCtrl'
    })
    .state('streetMap', {
      url: '/streetMap',
      templateUrl: 'templates/streetMap.html',
      controller: 'StreetMapCtrl'
    })
    .state('roadInfo', {
      url: '/roadInfo',
      templateUrl: 'templates/roadInfo.html',
      controller: 'RoadInfoCtrl'
    })
    .state('ranks', {
      url: '/ranks',
      templateUrl: 'templates/ranks.html',
      controller: 'RanksCtrl'
    })
    .state('leaderboard', {
      url: '/leaderboard',
      templateUrl: 'templates/leaderboard.html',
      controller: 'LeaderboardCtrl'
    })
    .state('speechRecognition', {
      url: '/speechRecognition',
      templateUrl: 'templates/speechRecognition.html',
      controller: 'SpeechRecognitionCtrl'
    })
    .state('accidents', {
      url: '/accidents',
      templateUrl: 'templates/accidents.html',
      controller: 'AccidentsCtrl'
    })
    .state('checkpoints', {
      url: '/checkpoints',
      templateUrl: 'templates/checkpoints.html',
      controller: 'CheckpointsCtrl'
    })
    .state('traffic', {
      url: '/traffic',
      templateUrl: 'templates/traffic.html',
      controller: 'TrafficCtrl'
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');
});
