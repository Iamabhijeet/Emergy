'use strict';

var controllerId = 'assignmentsController';

app.controller(controllerId,
    ['$scope', '$rootScope', 'authService', 'notificationService', 'reportsService', 'connectionStatusService', 'hub', 'signalR', assignmentsController]);

function assignmentsController($scope, $rootScope, authService, notificationService, reportsService, connectionStatusService, hub, signalR) {
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

    $scope.openSettings = function() {
        connectionStatusService.displayConnectionStatusMenu($scope.connectionStatus);
    };
    
}