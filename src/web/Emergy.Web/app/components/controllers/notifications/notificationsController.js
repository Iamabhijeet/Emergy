'use strict';

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