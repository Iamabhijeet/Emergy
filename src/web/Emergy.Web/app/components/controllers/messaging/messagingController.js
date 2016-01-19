﻿'use strict';

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
                    document.getElementById("notificationSound").play();
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
                loadMessagedUsers();
                document.getElementById("notificationSound").play();
                notificationService.pushSuccess('<p><span>' + String(notification.Sender.UserName) + '</span> has sent you a message!</p> <a href="/dashboard/messages/' + String(notification.SenderId) + '">View</a>');
            }
            else if (notification.Type === "ReportUpdated" && notification.Content.length > 11) {
                document.getElementById("notificationSound").play();
                notificationService.pushSuccess('<p><span>' + String(notification.Sender.UserName) + '</span> has updated current location!</p> <a href="/dashboard/report/' + String(notification.ParameterId) + '">View</a>');
            }
            else if (notification.Type === "ReportUpdated" && notification.Content.length < 11) {
                document.getElementById("notificationSound").play();
                notificationService.pushSuccess('<p><span>' + String(notification.Sender.UserName) + '</span> has changed a report status to ' + String(notification.Content) + '!</p> <a href="/dashboard/report/' + String(notification.ParameterId) + '">View</a>');
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