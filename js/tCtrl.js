/*
 * Map controlelr
 */
app.controller('tCtrl', function($scope, $filter,
   $firebaseArray, timeAgo, $LocList, $ionicLoading, toastr) {

  var firebaseURL = "https://wair.firebaseio.com";

  
  // get firebase data
  // I am not sure this is the right place to read
  var ref = new Firebase(firebaseURL + "/map/");
  $scope.savedSnapshot = null;
  ref.on("value", function(snapshot) {
  	$scope.savedSnapshot = snapshot;
  });

});