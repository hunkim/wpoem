// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', 
  ['ionic', 'ngCordova', 'firebase', 'yaru22.angular-timeago']);

app.controller('PoemCtrl', function($scope, $ionicSlideBoxDelegate, 
  $firebaseObject, $firebaseArray, $ionicLoading,  timeAgo) {

  
  $scope.skyStatus = [{id:1, label:"맑음"}, {id:2, label:"구름조금"}, 
                      {id:3, label:"구름많음"}, {id:4, label: "흐림"}];  

  $scope.snowStatus = [{id: 0, label: "없슴"}, {id: 1, label: "싸라기"}, 
                    {id: 3, label: "흘날림"}, {id: 4, label: "함박눈"}, {id:5, label: "폭설"}];  

  $scope.rainStatus = [{id: 0, label: "없슴"}, {id:1, label: "내리다말다"}, 
                        {id:2, label: "이슬비"}, {id: 3, label: "주룩주룩"},
                        {id:4, label: "폭우"}, {id: 5, label: "장마"}];  

  $scope.windStatus = [{id: 0, label: "없슴"}, {id: 1, label: "바람조금"}, 
                      {id: 2, label: "약한바람"}, {id: 3, label: "강한바람"}, 
                      {id: 4, label: "폭풍바람"}];  

  // ago setting
  timeAgo.settings.overrideLang = 'kr_KR';
  var firebaseURL = "https://wair.firebaseio.com";

  var ref = new Firebase(firebaseURL + "/poem/");
  var query = ref.orderByChild("timestamp").limitToFirst(100);
  $scope.poemList =  $firebaseArray(query);

  $scope.poem = {};

  $scope.addPoem = function() {
    var currentDate = new Date();
    $scope.poem.timestamp = -currentDate;

    $scope.poemList.$add($scope.poem).then(function (x) 
      {$scope.poem.msg= "";});
  };


});

app.run(function($ionicPlatform) {
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
