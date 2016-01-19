'use strict';

var controllerId = 'messagesController';

app.controller(controllerId,
    ['vm', '$state', '$stateParams', '$rootScope', '$location', 'authService', 'notificationService', 'messageService', 'reportsService', 'signalR', 'ngDialog', 'hub', messagesController]);

function messagesController($scope, $state, $stateParams, $rootScope, $location, authService, notificationService, messageService, reportsService, signalR, ngDialog, hub) {
    $rootScope.title = 'Messages | Emergy';
    $scope.messages = [];
    $scope.notificationAvailable = false;
    $scope.message = "";
    $scope.targetId = $stateParams.targetId;

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
                loadMessages();
            }
            else if (notification.Type === "MessageArrived" && notification.SenderId !== $stateParams.targetId) {
                notificationService.pushSuccess('<p><span>' + String(notification.Sender.UserName) + '</span> has sent you a message!</p> <a href="/dashboard/messages/' + String(notification.SenderId) + '">View</a>');
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
            var notification = {
                Content: "has sent a message",
                TargetId: $stateParams.targetId,
                Type: "MessageArrived",
                ParameterId: messageId
            }
            var promise = notificationService.createNotification(notification);
            promise.then(function(notificationId) {
                loadMessages();
                try {
                    hub.server.sendNotification(notificationId); 
                } catch (err) {
                    notificationService.pushError("Error has happened while pushing a notification.");
                }
            }, function() {
                notificationService.pushError("Error has happened while creating a notification.");
            });
            loadMessages();
        }, function (error) {
            notificationService.pushError("Error has happened while sending message.");
        }).finally(function() {
            delete $scope.message;
        });
    };

    loadMessages();
}