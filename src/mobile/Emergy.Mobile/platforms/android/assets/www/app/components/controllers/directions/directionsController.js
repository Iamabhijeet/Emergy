'use strict';

var controllerId = 'directionsController';

app.controller(controllerId,
    ['$scope', '$state', '$rootScope', '$stateParams', 'authService', 'notificationService', 'reportsService', 'connectionStatusService', 'hub', 'signalR', 'locationService', directionsController]);

function directionsController($scope, $state, $rootScope, $stateParams, authService, notificationService, reportsService, connectionStatusService, hub, signalR, locationService) {
    $scope.isLoading = true;
    $scope.destinationLatitude = {};
    $scope.destinationLatitude = {};
    $scope.originLatitude = {};
    $scope.originLongitude = {};
    
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
            else if (notification.Type === "AssignedForReport") {
                notificationService.displaySuccessPopup("Administrator has assigned you to resolve a report! Head over to assignments screen to view more information.", "Ok");
            }
        });
    });

    var loadDestination = function () {
        notificationService.displayLoading("Loading directions information...");
        var promise = locationService.getLocationForReport($stateParams.reportId);
        promise.then(function (location) {
            $scope.destinationLatitude = location.Latitude;
            $scope.destinationLongitude = location.Longitude;
        }, function() {

        }).finally(function() {
            notificationService.hideLoading();
            $scope.isLoading = false;
        });
    }

    loadDestination();
}