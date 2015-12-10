'use strict';

var controllerId = 'notificationsController';

app.controller(controllerId,
    ['$scope', '$state', '$rootScope', '$location', 'authService', 'notificationService', notificationsController]);

function notificationsController($scope, $state, $rootScope, $location, authService, notificationService) {
    $rootScope.title = 'Notifications | Emergy';
    $scope.isBusy = false;

}