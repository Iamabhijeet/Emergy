'use strict';

var controllerId = 'messagingController';

app.controller(controllerId,
    ['$scope', '$state', '$rootScope', 'authService', 'notificationService', 'messagesService', 'accountService', messagingController]);

function messagingController($scope, $state, $rootScope, authService, notificationService, messagesService, accountService) {
    $scope.messagedUsers = [];

    $scope.openMessages = function(username) {
        /*
         var promise = accountService.getProfileByUsername(username);
        promise.then(function(user) {
            $state.go("tab.messages", { senderId: String(user.data.Id) });
        }, function() {
            notificationService.displayErrorPopup("There has been an error loading messages.", "Ok");
        });
         */

        $state.go("tab.messages");
    }

    var loadMessagedUsers = function() {
        var promise = messagesService.getMessagedUsers();
        promise.then(function (messagedUsers) {
            $scope.messagedUsers = messagedUsers;
        }, function (error) {
            notificationService.displayErrorPopup("There has been an error loading messaged users.", "Ok");
        });
    };

    loadMessagedUsers();
}