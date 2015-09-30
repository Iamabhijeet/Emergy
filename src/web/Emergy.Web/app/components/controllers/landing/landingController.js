'use strict';

var controllerId = 'landingController';

app.controller(controllerId,
    ['$scope', '$timeout', '$rootScope', '$state', 'authService', 'authData', landingController]);

function landingController($scope, $timeout, $rootScope, $state, authService, authData) {
    $rootScope.title = 'Landing';
    $rootScope.background = 'background-cyan';

    $timeout(function () {
        $state.go('Home');
    }, 5000);
}