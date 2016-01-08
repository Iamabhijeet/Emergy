'use strict';

var controllerId = 'messagesController';

app.controller(controllerId,
    ['$scope', '$stateParams', '$rootScope', 'authService', 'notificationService', 'messagesService', messagesController]);

function messagesController($scope, $stateParams, $rootScope, authService, notificationService, messagesService) {
}