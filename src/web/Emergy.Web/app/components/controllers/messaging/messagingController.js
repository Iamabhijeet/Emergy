'use strict';

var controllerId = 'messagingController';

app.controller(controllerId,
    ['vm', '$state', '$rootScope', '$location', 'authService', 'notificationService', 'messageService', 'accountService', messagingController]);

function messagingController($scope, $state, $rootScope, $location, authService, notificationService, messageService, accountService) {
    $rootScope.title = 'Messaging | Emergy';
    $scope.userName = "";
    $scope.messagedUsers = [];
    
    $scope.initiateMessaging = function (username) {
        var promise = accountService.getProfileByUsername(username);
        promise.then(function (user) {
            $state.go("Messages", { targetId: String(user.data.Id) });
        }, function (error) {
            notificationService.pushError("Specified username does not exist!");
        });
    }

    var loadMessagedUsers = function () {
        var promise = messageService.getMessagedUsers();
        promise.then(function (messagedUsers) {
            $scope.messagedUsers = messagedUsers;
        }, function (error) {
            notificationService.pushError("Error has happened while loading messaged users.");
        });
    };

    loadMessagedUsers();
}