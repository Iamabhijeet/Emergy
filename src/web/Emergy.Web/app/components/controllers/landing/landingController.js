'use strict';

var controllerId = 'landingController';

app.controller(controllerId,
    ['$scope', '$rootScope', 'authService', 'authData', landingController]);

function landingController($scope, $rootScope, authService, authData) {
    $rootScope.title = 'Landing';


}