'use strict';

var controllerId = 'directionsController';

app.controller(controllerId,
    ['$scope', '$state', '$rootScope', 'authService', 'notificationService', 'reportsService', 'connectionStatusService', 'hub', 'signalR', directionsController]);

function directionsController($scope, $state, $rootScope, authService, notificationService, reportsService, connectionStatusService, hub, signalR) {
    $rootScope.$on(signalR.events.client.pushNotification, function (event, response) {
        $scope.notificationAvailable = true;
        var promise = notificationService.getNotification(response);
        promise.then(function (notification) {
            if (notification.Type === "MessageArrived") {
                notificationService.displaySuccessPopup("You have received a new message!", "Ok");
            }
        });
    });
}