'use strict';

var controllerId = 'messagingController';

app.controller(controllerId,
    ['$scope', '$rootScope', 'authService', 'notificationService', 'messagesService', messagingController]);

function messagingController($scope, $rootScope, authService, notificationService, messagesService) {
    $scope.messagedUsers = [];

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