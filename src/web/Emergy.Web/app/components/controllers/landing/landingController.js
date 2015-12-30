'use strict';

var controllerId = 'landingController';

app.controller(controllerId,
    ['vm', '$timeout', '$rootScope', '$state', 'authService', 'authData', landingController]);

function landingController($scope, $timeout, $rootScope, $state, authService, authData) {
    $rootScope.title = 'Landing';
    $rootScope.background = 'background-cyan';

    $timeout(function () {
        $state.go('Units');
    }, 5000);
}