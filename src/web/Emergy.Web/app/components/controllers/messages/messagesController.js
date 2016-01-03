'use strict';

var controllerId = 'messagesController';

app.controller(controllerId,
    ['vm', '$state', '$rootScope', '$location', 'authService', 'notificationService', messagesController]);

function messagesController($scope, $state, $rootScope, $location, authService, notificationService) {
    $rootScope.title = 'Messages | Emergy';
}