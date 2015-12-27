'use strict';

var controllerId = 'notificationsController';

app.controller(controllerId,
    ['$scope', '$state', '$rootScope', '$location', 'authService', 'notificationService', notificationsController]);

function notificationsController($scope, $state, $rootScope, $location, authService, notificationService) {
    $rootScope.title = 'Notifications | Emergy';
    $scope.isBusy = true;
    $scope.notifications = [];
    $scope.lastNotificationDateTime = '';

    var loadNotifications = function () {
        $scope.isBusy = true;
        var promise = notificationService.getNotifications($scope.lastNotificationDateTime);
        promise.then(function (notifications) {
            angular.copy(notifications, $scope.notifications);
                $scope.lastNotificationDateTime = notifications[notifications.length - 1].Timestamp;
            }, function (error) {
            notificationService.pushError(error.Message);
        })
            .finally(function () {
                $scope.isBusy = false;
            });
    };

    loadNotifications();
}