angular.module('starter.controllers', [])

.controller('WelcomeCtrl', function($scope, $state) {

  $scope.register = function () {
    $state.go('register');
  };

  $scope.login = function () {
    $state.go('login');
  };

})

.controller('RegisterCtrl', function($scope, $state) {
  $scope.register = function () {
    $state.go('mainmenu');
  };
})

.controller('LoginCtrl', function($scope, $state) {
  $scope.login = function () {
    $state.go('mainmenu');
  };
})

.controller('MainMenuCtrl', function($scope, $state) {
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
  google.maps.event.addDomListener(window, "load", function(){
    var myLatlng = new google.maps.Latlng(37.3000, -120.4833);
    var mapOption = {
      center:myLatlng,
      zoom: 16,
      mapTypeId: google.maps.mapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    $scope.map = map;
  })
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
