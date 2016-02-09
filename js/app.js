// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', 
  ['ionic', 'ngCordova', 'firebase',
  'yaru22.angular-timeago', 'ngStorage', 'ngAudio', 
  'ngAnimate', 'toastr', 'angular.filter']);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);

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


app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('map', {
      //cache: false,
      url: '/map',
      templateUrl: 'g.html',
      controller: 'MapCtrl'
    });

/*
 $stateProvider
    .state('ngmap', {
      url: '/ngmap',
      templateUrl: 'ngg.html',
      controller: 'ngMap2Ctrl'
    });


$stateProvider
    .state('p', {
     url: '/p',
     templateUrl: 'p.html',
     controller: 'PCtrl'
    });


 $stateProvider
    .state('x2', {
     url: '/x2',
     templateUrl: 'm.html',
     controller: 'MCtrl'
    });

*/
  $stateProvider
    .state('index', {
      //cache: false,
      url: '/',
      templateUrl: 'i.html',
      controller: 'MainCtrl'
    });

  $urlRouterProvider.otherwise("/");

});

