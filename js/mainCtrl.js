app.controller('MainCtrl', function($scope, $timeout, $filter, $ionicSlideBoxDelegate, 
  $firebaseObject, $firebaseArray, timeAgo, $LocList, $MsgService, $ionicPopup) {
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
    // https://forum.ionicframework.com/t/ios-recieved-memory-warning-then-terminated-due-to-memory-pressure/3399/12
    // IOS Memory warning?
    $scope.currentSlide = index;
    // last page? 
    // timout gives me the correct $ionicSlideBoxDelegate.slidesCount()
    // Bug fix! : no correct title from the first map add 
    // FIXME? memory leak here?
    setTimeout(function () {
      if (index>=$ionicSlideBoxDelegate.slidesCount()-1
        || $scope.locs[index]==undefined ) {
        $scope.title = "지역 설정및 추가";
        $scope.inConfigPage = true;
        return;
      } 

      $scope.inConfigPage = false;
      $scope.title = $scope.locs[index].city + " " + $scope.locs[index].region;
    });
  }

  // goto slide
  $scope.goSlide = function(index) {
    $ionicSlideBoxDelegate.slide(index);
  }

  // http://stackoverflow.com/questions/27853431/ion-list-does-not-refresh-after-state-go-is-called
  $scope.$on('$ionicView.beforeEnter', function () {
    // update slides

    // http://www.sitepoint.com/understanding-angulars-apply-digest/
    // Note: By the way, you should use $timeout service whenever possible which is setTimeout()
    // with automatic $apply() so that you don’t have to call $apply() manually.

    // update, since there might some additions
    $ionicSlideBoxDelegate.update();

    $ionicSlideBoxDelegate.slide(0);
    $scope.slideHasChanged(0);
  });


  $scope.remove = function($index, $loc) {
    $scope.locs.splice($index, 1);

    // let's remove the meta
    $scope.loc_meta.splice($index, 1);

    // let's add this into the local storage
    // FIXME: It seems they are bounded
    // No need to add
    
    // update slides
    $timeout(function() {
        var lastSlide = $scope.locs.length;
        $ionicSlideBoxDelegate.slide(lastSlide);
        $ionicSlideBoxDelegate.update();
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
    $timeout(function() {
        $ionicSlideBoxDelegate.update();
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
      $MsgService.success('추가 되었습니다.', loc.city + " " + loc.region);
    } else {
      $MsgService.warning('이미 추가된 곳입니다.', loc.city + " " + loc.region);
      return; // move on
    }

    $timeout(function() {
      var lastSlide = $ionicSlideBoxDelegate.slidesCount();
      $ionicSlideBoxDelegate.slide(lastSlide);
      $ionicSlideBoxDelegate.update();
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


// ---------------------- About pop up --
// Triggered on a button click, or some other target
$scope.showAbout = function() {
  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    templateUrl: "about.html",
    title: '시와 날씨 시험버전 0.2',
    subTitle: '실시간 대기상태와 날씨를 확인하면서 이와 어울리는 시 한구절 어때요? 날씨에 대해 수다도 나누어요.',
    buttons: [{ text: '닫기', type: 'button-positive'}]
  });

  myPopup.then(function(res) {
  });
};



// X scroll
// http://stackoverflow.com/questions/35308264/ionic-can-i-disable-the-swipe-action-in-a-certain-area-div-in-ion-slide/35311465#35311465
$scope.mouseoverWideDiv = function() {
    $ionicSlideBoxDelegate.enableSlide(false);
};

$scope.mouseleaveWideDiv = function() {
    $ionicSlideBoxDelegate.enableSlide(true);
};

});
