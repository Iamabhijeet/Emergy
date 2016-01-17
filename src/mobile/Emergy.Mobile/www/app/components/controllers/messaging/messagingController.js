'use strict';

var controllerId = 'messagingController';

app.controller(controllerId,
    ['$scope', '$state', '$rootScope', 'authService', 'notificationService', 'messagesService', 'accountService', 'connectionStatusService', 'signalR', 'hub', messagingController]);

function messagingController($scope, $state, $rootScope, authService, notificationService, messagesService, accountService, connectionStatusService, signalR, hub) {
    $scope.messagedUsers = [];
    $scope.isLoading = true;
    $scope.connectionStatus = "";

    $rootScope.$on(signalR.events.client.pushNotification, function (event, response) {
        $scope.notificationAvailable = true;
        var promise = notificationService.getNotification(response);
        promise.then(function (notification) {
            if (notification.Type === "MessageArrived") {
                notificationService.displaySuccessPopup("You have received a new message!", "Ok");
            }
            else if (notification.Type === "ReportUpdated") {
                notificationService.displaySuccessPopup("One of the reports that you submitted had it's status updated!", "Ok");
            }
        });
    });

    if (signalR.isConnecting) {
        $scope.connectionStatus = "connecting";
    }

    if (signalR.isConnected) {
        $scope.connectionStatus = "connected";
    }

    $rootScope.$on(signalR.events.realTimeConnected, function () {
        $scope.connectionStatus = "connected";
    });

    $rootScope.$on(signalR.events.connectionStateChanged, function (event, state) {
        $scope.connectionStatus = state;
    });

    $scope.openSettings = function() {
        connectionStatusService.displayConnectionStatusMenu($scope.connectionStatus);
    };

    $scope.openMessages = function (username) {
        notificationService.displayLoading("Loading messages...");
        var promise = accountService.getProfileByUsername(username);
        promise.then(function(user) {
            $state.go("tab.messages", { senderId: user.data.Id });
        }, function () {
            notificationService.displayErrorPopup("There has been an error loading messages.", "Ok");
        }).finally(function() {
            notificationService.hideLoading();
        });

    }

    var loadMessagedUsers = function() {
        notificationService.displayLoading("Loading messaged users...");
        var promise = messagesService.getMessagedUsers();
        promise.then(function (messagedUsers) {
            $scope.messagedUsers = messagedUsers;
        }, function (error) {
            notificationService.displayErrorPopup("There has been an error loading messaged users.", "Ok");
        }).finally(function() {
            notificationService.hideLoading();
            $scope.isLoading = false;
        });
    };

    loadMessagedUsers();
}