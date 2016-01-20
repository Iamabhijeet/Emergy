﻿'use strict';

var controllerId = 'notificationsController';

app.controller(controllerId,
    ['vm', '$state', '$rootScope', '$location', 'authService', 'notificationService', 'reportsService', 'signalR', 'ngDialog', notificationsController]);

function notificationsController($scope, $state, $rootScope, $location, authService, notificationService, reportsService, signalR, ngDialog) {
    $rootScope.title = 'Notifications | Emergy';
    $scope.isBusy = true;
    $scope.notifications = [];
    $scope.lastNotificationDateTime = '';

    $rootScope.$on(signalR.events.client.pushNotification, function (event, response) {
        var promise = notificationService.getNotification(response);
        promise.then(function (notification) {
            if (notification.Type === "ReportCreated") {
                var promise = reportsService.getReport(notification.ParameterId);
                promise.then(function (report) {
                    $scope.arrivedReport = {};
                    $scope.arrivedReport = report;
                    $scope.notifications = [];
                    $scope.lastNotificationDateTime = "";
                    $scope.loadNotifications();
                    $scope.reportMarker = {
                        latitude: report.Location.Latitude,
                        longitude: report.Location.Longitude
                    }
                    $scope.map = {
                        control: {},
                        options: { draggable: false, scrollwheel: false },
                        center: { latitude: report.Location.Latitude, longitude: report.Location.Longitude },
                        zoom: 10,
                        styles: [{ stylers: [{ hue: '#18C0D6' }, { visibility: 'simplified' }, { gamma: 0.5 }, { weight: 0.5 }] }, { featureType: 'water', stylers: [{ color: '#37474f' }] }]
                    };
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
                $scope.notifications = [];
                $scope.lastNotificationDateTime = "";
                $scope.loadNotifications();
                document.getElementById("notificationSound").play();
                notificationService.pushSuccess('<p><span>' + String(notification.Sender.UserName) + '</span> has sent you a message!</p> <a href="/dashboard/messages/' + String(notification.SenderId) + '">View</a>');
            }
            else if (notification.Type === "ReportUpdated" && notification.Content.length > 11) {
                $scope.notifications = [];
                $scope.lastNotificationDateTime = "";
                $scope.loadNotifications();
                document.getElementById("notificationSound").play();
                notificationService.pushSuccess('<p><span>' + String(notification.Sender.UserName) + '</span> has updated current location!</p> <a href="/dashboard/report/' + String(notification.ParameterId) + '">View</a>');
            }
            else if (notification.Type === "ReportUpdated" && notification.Content.length < 11) {
                $scope.notifications = [];
                $scope.lastNotificationDateTime = "";
                $scope.loadNotifications();
                document.getElementById("notificationSound").play();
                notificationService.pushSuccess('<p><span>' + String(notification.Sender.UserName) + '</span> has changed a report status to ' + String(notification.Content) + '!</p> <a href="/dashboard/report/' + String(notification.ParameterId) + '">View</a>');
            }
        });
    });

    $scope.loadNotifications = function () {
        $scope.isBusy = true;
        var promise = notificationService.getNotifications($scope.lastNotificationDateTime);
        promise.then(function (notifications) {
            $scope.notifications = $scope.notifications.concat(notifications);
            if (notifications.length % 20 === 0 && notifications.length !== 0) {
                $scope.lastNotificationDateTime = notifications[notifications.length - 1].Timestamp;
            }
        }, function (error) {
            notificationService.pushError("Error has happened while loading notifications.");
        })
            .finally(function () {
                $scope.isBusy = false;
            });
    };

    $scope.loadNotifications();
}