﻿'use strict';

var controllerId = 'notificationsController';

app.controller(controllerId,
    ['vm', '$state', '$rootScope', '$location', 'authService', 'notificationService', notificationsController]);

function notificationsController($scope, $state, $rootScope, $location, authService, notificationService) {
    $rootScope.title = 'Notifications | Emergy';
    $scope.isBusy = true;
    $scope.notifications = [];
    $scope.lastNotificationDateTime = '';

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