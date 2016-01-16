'use strict';

var controllerId = 'reportsController';

app.controller(controllerId,
    ['$scope', '$rootScope', 'authService', 'notificationService', 'reportsService', 'connectionStatusService', 'hub', 'signalR', reportsController]);

function reportsController($scope, $rootScope, authService, notificationService, reportsService, connectionStatusService, hub, signalR) {
    $scope.reports = [];
    $scope.isLoading = true;
    $scope.connectionStatus = "";

    if (signalR.isConnecting) {
        $scope.connectionStatus = "connecting";
    }

    if (signalR.isConnected) {
        $scope.connectionStatus = "connected";
    }

    $rootScope.$on(signalR.events.realTimeConnected, function () {
        $scope.connectionStatus = "connected";
    });

    $rootScope.$on(signalR.events.connectionStateChanged, function (event, state) {
        $scope.connectionStatus = state;
    });

    $scope.openSettings = function () {
        connectionStatusService.displayConnectionStatusMenu($scope.connectionStatus);
    };  

    var loadReports = function () {
        notificationService.displayLoading("Loading reports...");
        var promise = reportsService.getReports();
        promise.then(function(reports) {
            $scope.reports = reports;
        }, function() {
            notificationService.displayErrorPopup("There has been an error loading reports.", "Ok");
        }).finally(function () {
            notificationService.hideLoading();
            $scope.isLoading = false;
        });
    };

    loadReports();
}