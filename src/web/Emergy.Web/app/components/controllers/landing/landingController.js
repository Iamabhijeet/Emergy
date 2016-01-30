'use strict';

var controllerId = 'landingController';

app.controller(controllerId,
    ['$rootScope', '$state', 'authData', landingController]);

function landingController($rootScope, $state, authData) {
    $rootScope.title = 'Landing';
    $rootScope.background = 'background-white';
    
    if (authData.loggedIn && authData.isAdmin()) {
        $state.go('Units');
    } else if (authData.loggedIn && authData.isClient()) {
        $state.go('ClientDashboard', authData.userId);
    }

}