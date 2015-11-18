'use strict';

var controllerId = 'reportsController';

app.controller(controllerId,
    ['$scope', '$rootScope', 'unitsService',
        'authService', 'notificationService', 'authData', reportsController]);

function reportsController($scope, $rootScope, unitsService, authService, notificationService, authData) {
    $rootScope.title = 'Reports | Emergy';
    $scope.isBusy = false; 

}