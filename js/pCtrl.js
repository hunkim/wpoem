/*
 * Map controlelr
 */
app.controller('PCtrl', function($scope, $filter,
   $firebaseArray, timeAgo, $LocList, $ionicLoading,
    uiGmapGoogleMapApi, uiGmapIsReady, toastr) {

  var firebaseURL = "https://fwair.firebaseio.com";

  
  // get firebase data
  // I am not sure this is the right place to read
  var ref = new Firebase(firebaseURL + "/data/");
  var query = ref.orderByChild("air").startAt(1);
  $scope.alldata = $firebaseArray(query);
});