﻿'use strict';

var controllerId = 'unitsController';

app.controller(controllerId,
    ['$scope', '$rootScope', 'unitsService',
        'authService', 'notificationService', 'authData', unitsController]);

function unitsController($scope, $rootScope, unitsService, authService, notificationService, authData) {
    $rootScope.title = 'Units';
    $scope.units = [];
    $scope.searchTerm = '';
    $scope.isBusy = true;

    var onLoaded = function () {
        $scope.isBusy = true;
        var promise = unitsService.getUnits();
        promise.then(function (units) {
            angular.copy(units, $scope.units);
        }, function (error) {
            notificationService.pushError(error.Message);
        })
            .finally(function () {
                $scope.isBusy = false;
            });
    };
    onLoaded();
}