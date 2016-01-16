'use strict';

var controllerId = 'messagingController';

app.controller(controllerId,
    ['vm', '$state', '$rootScope', '$location', 'authService', 'notificationService', 'messageService', 'accountService', 'reportsService', 'signalR', 'ngDialog', messagingController]);

function messagingController($scope, $state, $rootScope, $location, authService, notificationService, messageService, accountService, reportsService, signalR, ngDialog) {
    $rootScope.title = 'Messaging | Emergy';
    $scope.userName = "";
    $scope.messagedUsers = [];
    $scope.notificationAvailable = false;

    $rootScope.$on(signalR.events.client.pushNotification, function (event, response) {
        $scope.notificationAvailable = true;
        var promise = notificationService.getNotification(response);
        promise.then(function (notification) {
            if (notification.Type === "ReportCreated") {
                var promise = reportsService.getReport(notification.ParameterId);
                promise.then(function (report) {
                    $scope.arrivedReport = {};
                    $scope.arrivedReport = report;
                    ngDialog.close();
                    ngDialog.open({
                        template: "reportCreatedModal",
                        disableAnimation: true,
                        scope: $scope
                    });
                }, function (error) {
                    notificationService.pushError("Error has happened while loading notification.");
                });
            }
            else if (notification.Type === "MessageArrived") {

            }
        });
    });
    
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