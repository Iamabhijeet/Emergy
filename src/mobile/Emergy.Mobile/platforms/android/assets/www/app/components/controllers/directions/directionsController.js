'use strict';

var controllerId = 'directionsController';

app.controller(controllerId,
    ['$scope', '$state', '$rootScope', '$stateParams', '$cordovaGeolocation', 'authService', 'notificationService', 'reportsService', 'connectionStatusService', 'hub', 'signalR', 'locationService', 'authData', directionsController]);

function directionsController($scope, $state, $rootScope, $stateParams, $cordovaGeolocation, authService, notificationService, reportsService, connectionStatusService, hub, signalR, locationService, authData) {
    $scope.isLoading = true;
    $scope.destinationLatitude = {};
    $scope.destinationLatitude = {};
    $scope.originLatitude = {};
    $scope.originLongitude = {};
    var posOptions = { timeout: 10000, enableHighAccuracy: false };

    $scope.goBack = function() {
        $state.go("tab.assignments");
    };

    $rootScope.$on(signalR.events.client.pushNotification, function (event, response) {
        $scope.notificationAvailable = true;
        var promise = notificationService.getNotification(response);
        promise.then(function (notification) {
            if (notification.Type === "MessageArrived") {
                notificationService.displaySuccessWithActionPopup("You have received a new message!", "VIEW", function () { $state.go("tab.messages", { senderId: notification.SenderId }); });
            }
            else if (notification.Type === "ReportUpdated") {
                notificationService.displaySuccessWithActionPopup("Report that you submitted had its status changed to " + notification.Content + "!", "VIEW", function () { $state.go("tab.reports"); });
            }
        });
    });

    var loadDestination = function() {
        notificationService.displayLoading("Loading directions...");
        var promise = locationService.getLocationForReport($stateParams.reportId);
        promise.then(function(location) {
            $scope.destinationLatitude = location.Latitude;
            $scope.destinationLongitude = location.Longitude;
        });
    };

    var loadOrigin = function() {
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
            $scope.originLatitude = position.coords.latitude;
            $scope.originLongitude = position.coords.longitude;
        }, function() {
            var promise = locationService.getLatestUserLocation(authData.userId);
            promise.then(function(location) {
                $scope.originLatitude = location.data.Latitude;
                $scope.originLongitude = location.data.Longitude; 
            });
        }).finally(function () {
            $scope.isLoading = false;
            notificationService.hideLoading();
        });
    };

    loadDestination();
    loadOrigin();
}