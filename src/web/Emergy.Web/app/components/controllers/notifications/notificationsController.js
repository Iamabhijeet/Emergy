'use strict';

var controllerId = 'notificationsController';

app.controller(controllerId,
    ['vm', '$state', '$rootScope', '$location', 'authService', 'notificationService', 'reportsService', 'signalR', 'ngDialog', notificationsController]);

function notificationsController($scope, $state, $rootScope, $location, authService, notificationService, reportsService, signalR, ngDialog) {
    $rootScope.title = 'Notifications | Emergy';
    $scope.isBusy = true;
    $scope.notifications = [];
    $scope.lastNotificationDateTime = '';
    $scope.showMore = false; 

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
                        zoom: 12,
                        styles: [{ 'featureType': 'landscape.natural', 'elementType': 'geometry.fill', 'stylers': [{ 'visibility': 'on' }, { 'color': '#e0efef' }] }, { 'featureType': 'poi', 'elementType': 'geometry.fill', 'stylers': [{ 'visibility': 'off' }, { 'hue': '#1900ff' }, { 'color': '#c0e8e8' }] }, { 'featureType': 'road', 'elementType': 'geometry', 'stylers': [{ 'lightness': 100 }, { 'visibility': 'simplified' }] }, { 'featureType': 'road', 'elementType': 'labels', 'stylers': [{ 'visibility': 'on' }] }, { 'featureType': 'transit.line', 'elementType': 'geometry', 'stylers': [{ 'visibility': 'on' }, { 'lightness': 700 }] }, { 'featureType': 'water', 'elementType': 'all', 'stylers': [{ 'color': '#00ACC1' }] }]
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
            if (notifications.length % 20 === 0 && notifications.length !== 0) {
                $scope.showMore = true;
            }
            if (notifications.length && notifications[0].Timestamp !== $scope.lastNotificationDateTime) {
                $scope.lastNotificationDateTime = notifications[notifications.length - 1].Timestamp;
                $scope.notifications = $scope.notifications.concat(notifications);
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