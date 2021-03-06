// Local storage management 
app.factory ('StorageService', function ($localStorage) {
  $localStorage = $localStorage.$default({
    wair_locations: []
  });

  var _getAll = function () {
    return $localStorage.wair_locations;
  };

  var _add = function (thing) {
    $localStorage.wair_locations.push(thing);
  }

  var _remove = function (thing) {
    $localStorage.wair_locations.splice($localStorage.wair_locations.indexOf(thing), 1);
  }

  return {
    getAll: _getAll,
    add: _add,
    remove: _remove
  };
});

// Local storage management 
app.factory ('$MapService', function () {

  var factory = {map:null, infoWindow:null, markers:[]}; 
  return factory;

});

// Local storage management 
app.factory ('$MsgService', function ($ionicLoading, toastr) {

  var factory = {}; 

  factory.show = function(msg) {
    $ionicLoading.show({
      template: msg
    });
  };

  factory.hide = function(){
    $ionicLoading.hide();
  };

  factory.success = function(title, msg) {
    toastr.success(title, msg, {timeOut: 2000});
  }

  factory.warning = function(title, msg) {
    toastr.warning(title, msg, {timeOut: 2000});
  }

  return factory;
});


// Loc and Metadata management
app.factory('$LocList', function(StorageService, $firebaseArray, ngAudio, $http, $firebaseObject) {
	     
	var factory = {}; 

  var FBtalkURL = "https://wtalk.firebaseio.com";
  var FBWeatherURL = "https://wair.firebaseapp.com/";

    
	// Loc and meta data
	factory.locs = [];
	factory.loc_meta = [];

	factory.getLoc = function(func) {
		loadAll(func);
		return factory.locs;      
	}

	factory.getLocMeta = function() {
		return factory.loc_meta;
	}

  var _loadTalk = function(loc, loc_meta) {
    var ref = new Firebase(FBtalkURL + "/talks/");
    var query = ref.child(loc.nx).child(loc.ny).orderByChild("timestamp").limitToFirst(10);
    loc_meta.talks =  $firebaseArray(query);
  }


  factory.loadTalk = function(index) {
    for (var i=0; i<factory.locs.length; i++) {
      if (i==index) {
        _loadTalk(factory.locs[i], factory.loc_meta[i])
      } else {
        // FIXME: Is this the way to unlink the firebase array?
        factory.loc_meta[i].talks = null;     
      }
    }
  }


  // Music related ones
  // http://stackoverflow.com/questions/29208069/how-to-play-audio-mp3-in-ionic-when-page-view-is-loaded
  var loadTTS = function(loc, loc_meta) {
    var ttsURL = "http://a.kbill.org/tts.php?text=";
    var text = "안녕하세요."
    
    if (loc===undefined || loc_meta === undefined) {
        text = "정보가 없습니다.";
    } else {
        text = loc.region + " 기온은 " + loc_meta.data.weather.T1H + "도 이며 습도는" + 
        loc_meta.data.weather.REH + "프로 입니다.";
        text += " 미세먼지 농도는" + loc_meta.data.air.pm10Value  + "입니다.";
    }
    
    //var media = new Media(ttsURL+text, null, null, mediaStatusCallback);
    loc_meta.sound = ngAudio.load(ttsURL+encodeURI(text)); // returns NgAudioObject
  } 

  function inLoc(needle) {
  	var haystack = factory.locs;
    var count=haystack.length;

    for(var i=0;i<count;i++) {
        if(haystack[i].state===needle.state && 
        	haystack[i].city===needle.city && 
        	haystack[i].region===needle.region) {
        	return true;
        }
    }
    return false;
  }

  // Add a new localton
  factory.add = function(loc) {
  	// make sure we add a valid LOC
  	if (loc === undefined || 
  		loc.nx == undefined || 
  		loc.ny==undefined) {
		console.log("No NX and Ny for ");
		console.log(loc);
		return;
	}

  	// No need to add. It's already there
  	if (inLoc(loc)) {
  		return false;
  	}

    // add to the memory
    factory.locs.unshift(loc);
    
    // add empty metadata to meta
    factory.loc_meta.unshift({});

    // get weather and air for the top
    loadAllForLOC(loc, 0);

    // Added!
    return true;
  }

// Load all for LOC
var loadAllForLOC = function(loc, index, func) {
	if (loc === undefined || loc.nx == undefined || loc.ny==undefined) {
		console.log("No NX and Ny for ");
		console.log(loc);
		return;
	}

	if (factory.loc_meta[index]==undefined) {
  		factory.loc_meta[index]={};
	}

	var loc_meta =  factory.loc_meta[index];

  // Let's load talks
  //loadTalks(loc, loc_meta);

  var statPromise = $http.get(FBWeatherURL + loc.nx + '-' + loc.ny + ".json")
        .success(function(response) {
          loc_meta.data = response;
        })
        .error(function(response) {
          var errorFlag = true;
        });
  }


  var loadAll = function(func) {
    factory.locs = StorageService.getAll();
   
    for (var i=0; i<factory.locs.length; i++) {
      loadAllForLOC(factory.locs[i], i, func);
    }
  }


return factory;
});