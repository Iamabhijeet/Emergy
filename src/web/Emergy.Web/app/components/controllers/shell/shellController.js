'use strict';

var controllerId = 'shellController';

app.controller(controllerId,
    ['vm', '$rootScope', 'authData', 'signalR', shellCtrl]);

function shellCtrl($scope, $rootScope, authData, signalR) {
    $rootScope.background = 'background-white';
    $scope.authData = authData;
    $scope.signalR = signalR;

    $rootScope.$on(signalR.events.realTimeConnected, function () {
        $scope.signalR.connectionState = 'connected';
        $scope.$apply();
    });
}