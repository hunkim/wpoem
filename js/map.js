// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var nameApp = angular.module('starter', ['ionic', 'uiGmapgoogle-maps']);

nameApp.run(function($ionicPlatform) {
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


/*
nameApp.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'g.html',
      controller: 'HomeCtrl'
    });
  $urlRouterProvider.otherwise("/");

});
*/


nameApp.controller('HomeCtrl', function($scope, uiGmapGoogleMapApi) {

  $scope.myLocation = {
    lng : '',
    lat: ''
  }

  $scope.options = {
    enableHighAccuracy: true,
    timeout: 50000,
    maximumAge: 0
  };
  
  $scope.drawMap = function(position) {

    //$scope.$apply is needed to trigger the digest cycle when the geolocation arrives and to update all the watchers
    $scope.$apply(function() {
      $scope.myLocation.lng = position.coords.longitude;
      $scope.myLocation.lat = position.coords.latitude;

      $scope.map = {
        center: {
          latitude: $scope.myLocation.lat,
          longitude: $scope.myLocation.lng
        },
        zoom: 12,
        pan: 1
      };

      $scope.marker = {
        id: 0,
        coords: {
          latitude: $scope.myLocation.lat,
          longitude: $scope.myLocation.lng
        }
      }; 

      $scope.marker2 = {
        id: 1,
        coords: {
          latitude: $scope.myLocation.lat+10,
          longitude: $scope.myLocation.lng+10
        }
      }; 
      
      $scope.marker.options = {
        draggable: false,
        labelContent: "lat: " + $scope.marker.coords.latitude + '<br/> ' + 'lon: ' + $scope.marker.coords.longitude,
        labelAnchor: "80 120",
        labelClass: "marker-labels"
      };  
    });
  }

  $scope.handleError = function(error) {  
    console.warn('ERROR(' + error.code + '): ' + error.message);
  }

  navigator.geolocation.getCurrentPosition($scope.drawMap, $scope.handleError, $scope.options);  

});
