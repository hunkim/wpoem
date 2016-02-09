app.controller('MapCtrl', function($scope, $compile, $firebaseArray, $filter, $LocList, 
  $MsgService, $MapService, $timeout) {
   
  // default coordinate
  $scope.coords = {latitude: 37.52, longitude:126.9948};  

  var makeContent = function(i) {
    var m = $scope.alldata[i];
    // http://stackoverflow.com/questions/14226975/angularjs-ng-include-inside-of-google-maps-infowindow
    var info = 
           '<div class="text-center">' +
           '<h5>' + ' ' + m.loc.city + ' ' + m.loc.region +
           '</H5>' +
           '<h4>' + m.weather.T1H + '&#x2103; ' +
           '<small>습도: ' + m.weather.REH + '%</small></h4>' + 

           '<H4><small>대기환경</small> ' + $filter('khai')(m.air.khaiValue) + ' (' + m.air.khaiValue+')</H4>'+
           '<p>미세먼지 ' + $filter('pm10')(m.air.pm10Value) +' (' + m.air.pm10Value + ')<p>' +
           '<p ng-show="alldata[' + i + '].air.pm25Grade">' +
            '초미세먼지 ' + $filter('pm25')(m.air.pm25Value) + ' (' + m.air.pm25Value  + ')</p>' +

            '<button ng-hide="alldata[' + i + '].added" ng-click="addMapLoc('+ i + ')" ' + 
            'class="button button-positive icon-left ion-android-add-circle">' +
            '지역추가' +
            '</button>' +
            '<button ng-show="alldata[' + i + '].added"  class="button button-positive icon-left ion-checkmark-round" disabled>'+
            '추가 되었습니다.' +
            '</button></div>';

    var compiled = $compile(info)($scope);
    $scope.$apply();//must be inside write new values for each marker
    return compiled[0];
  };
 
  $scope.addMapLoc = function(i) {
    var mapLoc = $scope.alldata[i];

    // no state? Let's make it empty
    if (mapLoc.loc.state==undefined || mapLoc.loc.state=="") {
      mapLoc.loc.state=mapLoc.loc.city;
      // mapLoc.loc.city ="";
    }

    if (mapLoc.$id === undefined) {
       $MsgService.warning('이 지역을 등록할수 없습니다. ($id 없슴)', loc.city + " " + loc.region);
       return;
    }

    var nxny = mapLoc.$id.split("-");
    if (nxny.length!=2) {
       $MsgService.warning('이 지역을 등록할수 없습니다. 잘못된 $id:' + mapLoc.$id, loc.city + " " + loc.region);
       return; 
    }

    var loc = {state: mapLoc.loc.state, 
              city: mapLoc.loc.city, 
              region: mapLoc.loc.region, 
              nx: nxny[0], ny: nxny[1]};
    
    // add in the factory
    if ($LocList.add(loc)==false) {
       $MsgService.warning('이미 등록된 곳입니다.', loc.city + " " + loc.region);
    }

    mapLoc.added = true;
  };

    
  var addMarkers = function(x) {
    for (var i=0; i<x.length; i++) {
      if (x[i].loc == undefined || 
          x[i].weather===undefined ||
          x[i].air === undefined) {
        continue;
      }

      // http://wrightshq.com/playground/placing-multiple-markers-on-a-google-map-using-api-3/
      var pos = new google.maps.LatLng(x[i].loc.latitude, x[i].loc.longtitude);

      var sNo =  $filter('skyindex')(x[i].weather);
      var cNo =  $filter('kindex')(x[i].air.khaiValue); 
      var iconUrl = 'img/i_s' + sNo + "_c" + cNo + '.png';
      

      // bounds.extend(position);
      var marker = new google.maps.Marker({
            position: pos,
            map: $scope.map,
            icon: {url: iconUrl},
            draggable:false,
            title: "test"
      });
        
      // Allow each marker to have an info window    
      google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                if(marker.open) {                
                  infoWindow.close();
                  marker.open = false;
                  return;
                }
                
                var info = makeContent(i);
                infoWindow.setContent(info);
                infoWindow.open($scope.map, marker);
                marker.open = true;
          }
      })(marker, i));

      // Finally we are done
      $MsgService.hide();
    }
  };


var infoWindow = new google.maps.InfoWindow();
var latLng = new google.maps.LatLng($scope.coords.latitude, $scope.coords.longitude);
 
var mapOptions = {
      center: latLng,
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP};
  
 
$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);


$scope.centerMap = function(pos) {
    // No position? Let's use default
    if (pos === undefined || pos.coords===undefined ||
          pos.coords.latitude === undefined) {
      return;
    }  
  $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
}

 
  
if (true) {
    navigator.geolocation.getCurrentPosition
          ($scope.centerMap, null,
          { maximumAge: 10000, timeout: 10000, enableHighAccuracy: true });  
} 

 
  var ref = new Firebase("https://wair.firebaseio.com" + "/map/");
  $scope.alldata = $firebaseArray(ref);
  $scope.alldata.$loaded(addMarkers);
  $MsgService.show("날씨 정보 가져오는중...");


});