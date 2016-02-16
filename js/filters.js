
/*
- 하늘상태(SKY) 코드 : 맑음(1), 구름조금(2), 구름많음(3), 흐림(4)
- 강수형태(PTY) 코드 : 없음(0), 비(1), 비/눈(2), 눈(3)
*/

app.filter('sky', function() {
  return function(w, optional1, optional2) {
  	if (w===undefined || w===null) {
  		return "로딩중";
  	}
  	// 비
  	if (w.PTY==1) {
  		if (w.RN1>10) {
  			return "많은비";
  		}
  		return "비";
  	} 

  	if (w.PTY==2) {
  		return "진눈개비";
  	}

  	// 눈
  	if (w.PTY==3) {
  		if (w.RN1>5) {
  			return "많은눈";
  		}
  		return "눈";
  	}

  	// 일반 날씨
  	if (w.SKY==1) {
  		return "맑음";
  	} 

  	if (w.SKY==2) {
  		return "구름조금";
  	} 

 	if (w.SKY==3) {
  		return "구름많음";
  	} 

 	if (w.SKY==4) {
  		return "흐림";
  	} 

    return "모름";
  }
});

app.filter('skyindex', function() {
  return function(w, optional1, optional2) {
  	if (w===undefined || w==null) {
  		return "0";
  	}
  	// 비
  	if (w.PTY==1) {
  		if (w.RN1>10) {
  			return "7";
  		}
  		return "6";
  	} 

  	if (w.PTY==2) {
  		return "6";
  	}

  	// 눈
  	if (w.PTY==3) {
  		if (w.RN1>5) {
  			return "9";
  		}
  		return "8";
  	}

  	// 일반 날씨
  	if (w.SKY==1) {
  		return "1";
  	} 

  	if (w.SKY==2) {
  		return "2";
  	} 

 	if (w.SKY==3) {
  		return "3";
  	} 

 	if (w.SKY==4) {
  		return "4";
  	} 

    return "0";
  }
});

// 	좋음	보통	나쁨	매우나쁨	
// 통합대기환경지수	0~50	51~100	101~250	251이상

app.filter('khai', function() {

	function isNumeric(input) {
    	return (input - 0) == input && (''+input).trim().length > 0;
	}
  // In the return function, we must pass in a single parameter which will be the data we will work on.
  // We have the ability to support multiple other parameters that can be passed into the filter optionally
  return function(input, optional1, optional2) {
  	if (!isNumeric(input)) {
  		return "모름";
  	}

  	if (input>=251) {
  		return "매우나쁨";
  	} 

  	if (input>=101) {
  		return "나쁨";
  	} 

  	if (input>=51) {
  		return "보통";
  	} 

    return "좋음";
  }
});

app.filter('kindex', function() {
	function isNumeric(input) {
    	return (input - 0) == input && (''+input).trim().length > 0;
	}

	return function(input, optional1, optional2) {
  	if (!isNumeric(input)) {
  		return "0";
  	}

  	if (input>=251) {
  		return "4";
  	} 

  	if (input>=101) {
  		return "3";
  	} 

  	if (input>=51) {
  		return "2";
  	} 

    return "1";
  }
});

app.filter('pm10', function() {

  // In the return function, we must pass in a single parameter which will be the data we will work on.
  // We have the ability to support multiple other parameters that can be passed into the filter optionally
  return function(input, optional1, optional2) {
  	if (input>=101) {
  		return "매우나쁨";
  	} 

  	if (input>=51) {
  		return "나쁨";
  	} 

  	if (input>=16) {
  		return "보통";
  	} 

    return "좋음";
  }
});


app.filter('kordate', function() {
 return function(input, optional1, optional2) {
 	return Date();
 }

});

app.filter('pm25', function() {

  // In the return function, we must pass in a single parameter which will be the data we will work on.
  // We have the ability to support multiple other parameters that can be passed into the filter optionally
  return function(input, optional1, optional2) {
  	if (input>=101) {
  		return "매우나쁨";
  	} 

  	if (input>=51) {
  		return "나쁨";
  	} 

  	if (input>=16) {
  		return "보통";
  	} 

    return "좋음";
  }
});