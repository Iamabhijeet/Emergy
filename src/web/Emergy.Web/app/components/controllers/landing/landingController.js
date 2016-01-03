'use strict';

var controllerId = 'landingController';

app.controller(controllerId,
    ['vm', '$timeout', '$rootScope', '$state', 'authService', 'authData', landingController]);

function landingController($scope, $timeout, $rootScope, $state, authService, authData) {
    $rootScope.title = 'Landing';
    $rootScope.background = 'background-cyan';

    $timeout(function () {
        if (authData.loggedIn && authData.isAdmin()) {
            $state.go('Units');
        } else if (authData.loggedIn && authData.isClient()) {
            $state.go('ClientDashboard', authData.userId);
        } else {
            $state.go('Login');
        }
    }, 5000);
}