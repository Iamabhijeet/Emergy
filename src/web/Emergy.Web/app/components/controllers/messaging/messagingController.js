'use strict';

var controllerId = 'messagingController';

app.controller(controllerId,
    ['vm', '$state', '$rootScope', '$location', 'authService', 'notificationService', messagingController]);

function messagingController($scope, $state, $rootScope, $location, authService, notificationService) {
    $rootScope.title = 'Messaging | Emergy';
    $scope.userName = "";

    $scope.initiateMessaging = function(userName) {
    };
}