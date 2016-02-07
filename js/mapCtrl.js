/*
 * Map controlelr
 */
app.controller('MapCtrl', function($scope, $filter,
   $firebaseArray, timeAgo, $LocList, $ionicLoading,
    uiGmapGoogleMapApi, uiGmapIsReady, toastr) {

  var firebaseURL = "https://wair.firebaseio.com";

  $scope.locs = $LocList.getLoc();

  // Let's save meta data using nx and ny
  $scope.loc_meta = $LocList.getLocMeta();

  $scope.myLocation = {
    lng : '',
    lat: ''
  }

  $scope.options = {
    enableHighAccuracy: false,
    timeout: 50000,
    maximumAge: 0
  };

  $scope.addMapLoc = function(mapLoc) {
    console.log("Adding ..." + mapLoc);
    
    // no state? Let's make it empty
    if (mapLoc.loc.state==undefined || mapLoc.loc.state=="") {
      mapLoc.loc.state=mapLoc.loc.city;
      mapLoc.loc.city ="";
    }

    var loc = {state:mapLoc.loc.state, 
              city:mapLoc.loc.city, 
              region: mapLoc.loc.region, 
              nx:mapLoc.loc.nx, ny:mapLoc.loc.ny};
    
    // add in the factory
    if ($LocList.add(loc)==true) {
      //toastr.success('등록 되었습니다.', loc.city + " " + loc.region, {timeOut: 2000});
    } else {
      toastr.warning('이미 등록된 곳입니다.', loc.city + " " + loc.region, {timeOut: 2000});
    }

    
    console.log(loc);
    mapLoc.added = true;
  }

  $scope.loading = function(msg) {
    $ionicLoading.show({
      template: msg
    });
  };

  $scope.done = function(){
    $ionicLoading.hide();
  };


  // get firebase data
  // I am not sure this is the right place to read
  var ref = new Firebase(firebaseURL + "/map/");
  var query = ref;

  $scope.alldata = $firebaseArray(query);
  $scope.loading("날씨 정보 가져오는중...");

  $scope.alldata.$loaded().then(function(x) {
    for (var i=0; i<x.length; i++) {
      if (x[i].loc == undefined || 
          x[i].weather===undefined ||
          x[i].air === undefined) {
        continue;
      }

      //var sNo =  $filter('skyindex')(x[i].weather.SKY);
      sNo = x[i].weather.SKY;
      var cNo =  $filter('kindex')(x[i].air.khaiValue); 

      var iconUrl = 'img/i_s' + sNo + "_c" + cNo + '.png';
     
      x[i].id = i; 
      x[i].coords = {
          latitude: x[i].loc.latitude,
          longitude: x[i].loc.longtitude
      };

      x[i].showWindow = false;
      x[i].closeClick = true;
      x[i].show = true;
      x[i].icon = {url: iconUrl};
      // labelClass:'marker_labels',labelAnchor:'12 60',labelContent:'title'
      // http://stackoverflow.com/questions/29589911/showing-marker-labels-using-angular-google-maps-directive

      if (i%2==0) {
        x[i].options = {
            draggable: false,
            labelAnchor: "-11 52",
            labelClass: "glabel",
            labelContent: x[i].weather.T1H + "&#x2103;"
        };
      } else {
        x[i].options = {
            draggable: false,
         //   labelAnchor: "-11 52",
         //   labelClass: "glabel",
         //   labelContent: x[i].weather.T1H + "&#x2103;"
        };
      }

    }

    $scope.done();  
  });


  $scope.drawMapOld = function(position) {

    //$scope.$apply is needed to trigger the digest cycle when the geolocation arrives and to update all the watchers
    $scope.$apply(function() {
      $scope.myLocation.lng = position.coords.longitude;
      $scope.myLocation.lat = position.coords.latitude;

      $scope.myLocation.lng = "";
      $scope.myLocation.lat = "";

      $scope.map = {
        center: {
          latitude: $scope.myLocation.lat,
          longitude: $scope.myLocation.lng
        },
        zoom: 7,
        pan: 1
      };
    });
  }

// http://stackoverflow.com/questions/28247260/angular-google-maps-run-function-once-after-initial-map-load
$scope.drawMap = function(position) {
 // $scope.loading("지도 그리는 중...");

  uiGmapGoogleMapApi
    .then(function(maps){
        $scope.googlemap = {};
        $scope.map = {
            center: {
              // 대전 유성구 신성동
                latitude: position.coords.latitude, //35.9, 
                longitude: position.coords.longitude //127.7 
            },
            zoom: 10,
            pan: 1,
         //  options: myAppServices.getMapOptions().mapOptions,
            control: {},
            events: {
                tilesloaded: function (maps, eventName, args) {
                },
                dragend: function (maps, eventName, args) {
                },
                zoom_changed: function (maps, eventName, args) {
                  console.log(args);
                }
            }
        };
    });

  uiGmapIsReady.promise()                     // this gets all (ready) map instances - defaults to 1 for the first map
  .then(function(instances) {                 // instances is an array object
    // var maps = instances[0].map;            // if only 1 map it's found at index 0 of array
    //  $scope.myOnceOnlyFunction(maps);        // this function will only be applied on initial map load (once ready)
    // $scope.done();
  });

  $scope.myOnceOnlyFunction = function(maps){  // this will only be run once on initial load
      var center = maps.getCenter();           // examples of 'map' manipulation
      var lat = center.lat();
      var lng = center.lng();
      console.log('I\'ll only say this once ! \n Lat : ' + lat + '\n Lng : ' + lng);
  };

}

  $scope.handleError = function(error) {  
    console.warn('ERROR(' + error.code + '): ' + error.message);
    if(error.code==1) { //User denied Geolocation
      var position = {coords: {latitude: 35.9, longitude:127.7}}
      $scope.drawMap(position);
    }
  }

 // navigator.geolocation.getCurrentPosition($scope.drawMap, $scope.handleError, $scope.options);  
 // let's not use the location
 var position = {coords: {latitude: 37.43328611111111, longitude:126.9948}}
 $scope.drawMap(position);

 //  turnof all
 $scope.done();  

});