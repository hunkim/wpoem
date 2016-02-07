http://stackoverflow.com/questions/34586746/ng-click-not-working-on-ion-item-inside-ion-side-menu

app.directive('goSlide', function() {
    return {
        link: function($scope, element) {
            element.on('click', function() {
                goSlide(1);
            });
        }
    }
});