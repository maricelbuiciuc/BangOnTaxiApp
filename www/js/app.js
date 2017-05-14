//This is the main file with all components for the app
angular.module('bangOnTaxiApp', ['ionic', 'ngCordova', 'bangOnTaxiApp.controllers', 'bangOnTaxiApp.services', 'firebase'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {

// This is for the form inputs
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
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


//These are the some sections of the application and for each we have different URLs, HTML templates and Controllers
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
  // If none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');
});
