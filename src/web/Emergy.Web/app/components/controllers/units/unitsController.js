'use strict';

var controllerId = 'unitsController';

app.controller(controllerId,
    ['vm', '$rootScope', 'unitsService',
        'authService', 'notificationService', '$location', unitsController]);

function unitsController($scope, $rootScope, unitsService, authService, notificationService, $location) {
    $rootScope.title = 'Units | Emergy';
    $scope.units = [];
    $scope.searchTerm = '';
    $scope.isBusy = false;

    var loadUnits = function () {
        $scope.isBusy = true; 
        var promise = unitsService.getUnits();
        promise.then(function (units) {
            angular.copy(units, $scope.units);
        }, function (error) {
            notificationService.pushError("Error has happened while loading units.");
        }).finally(function() {
            $scope.isBusy = false;
        });
    };

    $scope.createUnit = function (unitName) {
        var promise = unitsService.createUnit({
            Name: unitName
        });
        promise.then(function () {
            loadUnits();
        },
        function (error) {
            notificationService.pushError("Error has happened while creating a new unit.");
        })
        .finally(function () {
            $scope.unitName = '';
        });
    }

    loadUnits();
}