app.controller('MainCtrl', function($rootScope, $scope, $filter, $ionicSlideBoxDelegate, 
  $firebaseObject, $firebaseArray, timeAgo, $LocList, $MsgService) {
  // timeago setting
  timeAgo.settings.overrideLang = 'kr_KR';

  // initially let's set setting
  $scope.title = "지역 설정및 추가";
  $scope.inConfigPage = true;

  $scope.stateNames = ['서울특별시',
        '부산광역시', '대구광역시', 
        '인천광역시', '광주광역시', 
        '대전광역시', '울산광역시', 
        '경기도', '강원도', 
        '충청북도', '충청남도', 
        '전라북도', 
        '전라남도', 
        '경상북도', 
        '경상남도', 
        '제주특별자치도'];

  $scope.locs = $LocList.getLoc(function() {
    $scope.slideHasChanged(0);
  });

  // Let's save meta data using nx and ny
  $scope.loc_meta = $LocList.getLocMeta();

  // ng-model form
  $scope.addform = {
    city: null,
    region: null,
    state: null
  };

  $scope.talk = {};
  
  // onSuccess Callback
  // This method accepts a Position object, which contains the
  // current GPS coordinates
  //
  $scope.geoSuccess = function(position) {
    $scope.position = position;

      console.log('Latitude: '          + position.coords.latitude          + '\n' +
            'Longitude: '         + position.coords.longitude         + '\n' +
            'Altitude: '          + position.coords.altitude          + '\n' +
            'Accuracy: '          + position.coords.accuracy          + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
            'Heading: '           + position.coords.heading           + '\n' +
            'Speed: '             + position.coords.speed             + '\n' +
            'Timestamp: '         + position.timestamp                + '\n');
  };

  // onError Callback receives a PositionError object
  //
  $scope.geoError = function(error) {
      console.log('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
  };


  // No location? Let's fire the geoLocation
  if (false && $scope.locs.length==0) {
      // get location
      navigator.geolocation.getCurrentPosition
        ($scope.geoSuccess, $scope.geoError,
        { maximumAge: 10000, timeout: 10000, enableHighAccuracy: true });  

  }

  
  $scope.goConfig = function() {
    var lastSlide = $ionicSlideBoxDelegate.slidesCount()-1;
    $ionicSlideBoxDelegate.slide(lastSlide);
  }

  // based on the slides, update the title
  $scope.slideHasChanged = function(index) {
    // last page?
    if (index>=$ionicSlideBoxDelegate.slidesCount()-1
      || $scope.locs[index]==undefined ) {
      $scope.title = "지역 설정및 추가";
      $scope.inConfigPage = true;

      return;
    } 

    $scope.inConfigPage = false;
    $scope.title = $scope.locs[index].city + " " + $scope.locs[index].region;
  }

  // goto slide
  $scope.goSlide = function(index) {
    $ionicSlideBoxDelegate.slide(index);
  }

  // http://stackoverflow.com/questions/27853431/ion-list-does-not-refresh-after-state-go-is-called
  $scope.$on('$ionicView.beforeEnter', function () {
    // update slides
    setTimeout(function() {
        $ionicSlideBoxDelegate.slide(0);
        $scope.slideHasChanged(0);
        $ionicSlideBoxDelegate.update();
        $scope.$apply();
    });
  });


  $scope.remove = function($index, $loc) {
    $scope.locs.splice($index, 1);

    // let's remove the meta
    $scope.loc_meta.splice($index, 1);

    // let's add this into the local storage
    //$localstorage.setArray('locs', $scope.locs);

    //setTimeout(function() {
    var lastSlide = $scope.locs.length;
    $ionicSlideBoxDelegate.slide(lastSlide);
    
    // update slides
    setTimeout(function() {
        $ionicSlideBoxDelegate.update();
        $scope.$apply();
      });
    
    $MsgService.success('삭제 되었습니다.', $loc.city + " " + $loc.region);
  }

  $scope.reorder = function(item, fromIndex, toIndex) {
    //Move the item in the array
    $scope.locs.splice(fromIndex, 1);
    $scope.locs.splice(toIndex, 0, item);

    var loc_meta = $scope.loc_meta[fromIndex];
    // let's remove the meta
    $scope.loc_meta.splice(fromIndex, 1);
    $scope.loc_meta.splice(toIndex, 0, loc_meta);


    // update slides
    setTimeout(function() {
        $ionicSlideBoxDelegate.update();
        $scope.$apply();
      });
  };

  $scope.addTalk = function(item) {
    var currentDate = new Date();
    var newTalk = {msg: $scope.talk.msg, 
      timestamp: -currentDate};

    item.talks.$add(newTalk).then(function (x) 
      {$scope.talk = {};});
  }

  
  $scope.addCity = function() {   
    var regionInfo = $scope.getRegionInfo($scope.addform.region);

    var loc = {state: $scope.addform.state,
              city:$scope.addform.city,
              region: $scope.addform.region, 
        nx:regionInfo.nx, ny:regionInfo.ny};

    if ($LocList.add(loc)==true) {
      $MsgService.success('등록 되었습니다.', loc.city + " " + loc.region);
    } else {
      $MsgService.warning('이미 등록된 곳입니다.', loc.city + " " + loc.region);
      return; // move on
    }

    setTimeout(function() {
      var lastSlide = $ionicSlideBoxDelegate.slidesCount();
      $ionicSlideBoxDelegate.slide(lastSlide);
      $ionicSlideBoxDelegate.update();
      $scope.$apply();
    });
    // reset the form
    $scope.addform = {};
    // reset the results
    $scope.regionNames = null;
    
  }

  // use already selected data. So we need only rgion name
  $scope.getRegionInfo = function(region) {
    return $scope.regions[region];
  };

  $scope.getCities = function() {
    // reset the previous data if any
    $scope.cities = null;
    $scope.addform.loaded = false; 

    $MsgService.show($scope.addform.state + "지역정보 얻어오기...");
    var ref = new Firebase("https://wair.firebaseio.com/loc/name");
    $scope.cities =  $firebaseArray(ref.child($scope.addform.state));

    $scope.cities.$loaded().then(function(x) {
      $scope.addform.loaded = true;
      $MsgService.hide();
    });
  }

  $scope.getRegions = function() {
    //  console.log($scope.cities);
    for(var i=0; i<$scope.cities.length; i++) {
      if ($scope.cities[i].$id==$scope.addform.city) {
          $scope.regions = $scope.cities[i];
      }
    }
  }


  // Music related ones
  // http://stackoverflow.com/questions/29208069/how-to-play-audio-mp3-in-ionic-when-page-view-is-loaded
  $scope.tts = function(loc) {
    if (loc.sound.canPlay) {
      if(loc.sound.paused) {
        loc.sound.play();
      } else {
        loc.sound.pause();
      }
    }
  }

// turn off all loading message just in case
$MsgService.hide();  

});
