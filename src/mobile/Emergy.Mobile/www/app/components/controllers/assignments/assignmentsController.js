'use strict';

var controllerId = 'assignmentsController';

app.controller(controllerId,
    ['$scope', '$state', '$rootScope', 'authService', 'notificationService', 'reportsService', 'connectionStatusService', 'hub', 'signalR', assignmentsController]);

function assignmentsController($scope, $state, $rootScope, authService, notificationService, reportsService, connectionStatusService, hub, signalR) {
    $rootScope.$on(signalR.events.client.pushNotification, function (event, response) {
        $scope.notificationAvailable = true;
        var promise = notificationService.getNotification(response);
        promise.then(function (notification) {
            if (notification.Type === "MessageArrived") {
                notificationService.displaySuccessPopup("You have received a new message!", "Ok");
            }
            else if (notification.Type === "ReportUpdated") {
                notificationService.displaySuccessPopup("One of the reports that you submitted had its status updated to " + notification.Content + "!", "Ok");
            }
        });
    });

    $scope.viewDirections = function() {
        $state.go("tab.directions");
    };
}