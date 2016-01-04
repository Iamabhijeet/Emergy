'use strict';

var controllerId = 'shellController';

app.controller(controllerId,
    ['vm', '$rootScope', 'authData', 'signalR', 'hub', 'notificationService', shellCtrl]);

function shellCtrl($scope, $rootScope, authData, signalR, hub, notificationService) {
    $rootScope.background = 'background-white';
    $scope.authData = authData;
    $scope.signalR = signalR;

    $rootScope.$on(signalR.events.realTimeConnected, function () {
        $scope.signalR.connectionState = 'connected';
        if (!$scope.$$phase) {
            scope.$apply();
        }
    });

    $rootScope.$on(signalR.events.connectionStateChanged, function (event,state) {
        $scope.signalR.connectionState = state;
        if (!$scope.$$phase) {
            scope.$apply();
        }
    });

    $scope.reconnect = function () {
        if (!signalR.isConnected) {
            hub.connectionManager.startConnection(function () {
                notificationService.pushSuccess('The realtime connection is now active!');
                $scope.$apply();
            });
        } else {
            notificationService.pushSuccess('The realtime connection is already active!');
        }
    };
}