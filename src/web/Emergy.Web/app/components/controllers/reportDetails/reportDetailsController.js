'use strict';

var controllerId = 'reportDetailsController';

app.controller(controllerId,
    ['vm', '$state', '$rootScope', '$stateParams', 'unitsService',
        'authService', 'notificationService', 'authData', reportDetailsController]);

function reportDetailsController($scope, $state, $rootScope, $stateParams, unitsService, authService, notificationService, authData) {
    $rootScope.title = "Report | Details";

}
