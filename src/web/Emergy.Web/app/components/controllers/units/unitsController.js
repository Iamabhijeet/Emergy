'use strict';

var controllerId = 'unitsController';

app.controller(controllerId,
    ['$scope', '$rootScope', 'unitsService',
        'authService', 'notificationService', '$location', unitsController]);

function unitsController($scope, $rootScope, unitsService, authService, notificationService, $location) {
    $rootScope.title = 'Units | Emergy';
    $scope.units = [];
    $scope.searchTerm = '';
    $scope.clientsCount = 0;
    var sumClients = function () {
        _.for($scope.units, function (unit) {
            $scope.clientsCount += unit.Clients.length;
        });
    };
    var loadUnits = function () {
        var promise = unitsService.getUnits();
        promise.then(function (units) {
            angular.copy(units, $scope.units);
        }, function (error) {
            notificationService.pushError(error.Message);
        })
            .finally(function () {
                sumClients();
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
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.unitName = '';
        });
    }

    loadUnits();
}