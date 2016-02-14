//http://stackoverflow.com/questions/34586746/ng-click-not-working-on-ion-item-inside-ion-side-menu

app.directive('weatherCard', function($compile) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      weather: '=weather'
    }, 
    templateUrl: 'templates/weatherCard.html'
  }
})

app.directive('weatherListItem', function($compile) {
  return {
    restrict: 'E',
    replace: false,
    scope: {
      weather: '=weather',
      air: '=air'
    }, 
    templateUrl: 'templates/weatherListItem.html'
  }
})

.directive('airCard', function($compile) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      air: '=air',
      airpred: '=airpred',
    }, 
    templateUrl: 'templates/airCard.html'
  }
})

.directive('weatherForcast', function($compile) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      shortpred: '=shortpred',
      longpred: '=longpred',
    }, 
    templateUrl: 'templates/weatherForcast.html'
  }
});