'use strict';

var controllerId = 'messagesController';

app.controller(controllerId,
    ['vm', '$state', '$stateParams', '$rootScope', '$location', 'authService', 'notificationService', messagesController]);

function messagesController($scope, $state, $stateParams, $rootScope, $location, authService, notificationService) {
    $rootScope.title = 'Messages | Emergy';
}