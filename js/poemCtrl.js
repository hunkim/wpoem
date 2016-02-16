// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
app.controller('PoemCtrl', function($scope, 
  $firebaseObject, $firebaseArray, $ionicLoading, $MsgService, timeAgo, toastr) {

  
  $scope.weather = ["맑음", "구름", "흐림", "비", "눈", "바람"];

  // ago setting
  timeAgo.settings.overrideLang = 'kr_KR';
  var firebaseURL = "https://wair.firebaseio.com";

  var ref = new Firebase(firebaseURL + "/poemcandidate/");
  var query = ref.orderByChild("timestamp").limitToFirst(100);
  $scope.poemList =  $firebaseArray(query);

  $scope.poem = {};

  var isSet = function($v) {
    return ($v!==undefined && $v != "");
  }

  $scope.addPoem = function() {
    console.log($scope.poem.msg);

    if (!isSet($scope.poem.msg)) {
      $MsgService.warning("싯구절을 입력해주세요.");
      return;
    }

    if (!isSet($scope.poem.author)) {
      $MsgService.warning("작가를 입력해주세요.");
      return;
    }


    if (!isSet($scope.poem.weather)) {
      $MsgService.warning("날씨를 선택해주세요.");
      return;
    }

    var currentDate = new Date();
    $scope.poem.timestamp = -currentDate;

    $scope.poemList.$add($scope.poem).then(function (x) {
      $MsgService.success( "검토후 반영됩니다.", "저장되었습니다. 감사합니다!");
      $scope.poem.msg= "";
    });
  };


});

