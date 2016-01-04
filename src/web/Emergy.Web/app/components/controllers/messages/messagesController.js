'use strict';

var controllerId = 'messagesController';

app.controller(controllerId,
    ['vm', '$state', '$stateParams', '$rootScope', '$location', 'authService', 'notificationService', 'messageService', messagesController]);

function messagesController($scope, $state, $stateParams, $rootScope, $location, authService, notificationService, messageService) {
    $rootScope.title = 'Messages | Emergy';
    $scope.messages = [];

    var loadMessages = function() {
        var promise = messageService.getMessages(String($stateParams.targetId));
        promise.then(function (messages) {
            $scope.messages = messages;
        }, function(error) {
            notificationService.pushError("Error has happened while loading messages.");
        });
    };

    $scope.sendMessage = function (message) {
        var promise = messageService.createMessage(message, $stateParams.targetId);
        promise.then(function (messageId) {
            loadMessages();
        }, function (error) {
            notificationService.pushError("Error has happened while sending message.");
        });
    };

    loadMessages();
}