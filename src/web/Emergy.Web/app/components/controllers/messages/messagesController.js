'use strict';

var controllerId = 'messagesController';

app.controller(controllerId,
    ['vm', '$state', '$stateParams', '$rootScope', '$location', 'authService', 'notificationService', 'messageService', 'reportsService', 'signalR', 'ngDialog', messagesController]);

function messagesController($scope, $state, $stateParams, $rootScope, $location, authService, notificationService, messageService, reportsService, signalR, ngDialog) {
    $rootScope.title = 'Messages | Emergy';
    $scope.messages = [];
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

    var loadMessages = function() {
        var promise = messageService.getMessages($stateParams.targetId);
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