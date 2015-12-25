'use strict';

var controllerId = 'unitsController';

app.controller(controllerId,
    ['$scope', '$rootScope', 'unitsService',
        'authService', 'notificationService', '$location', unitsController]);

function unitsController($scope, $rootScope, unitsService, authService, notificationService, $location) {
    $rootScope.title = 'Units | Emergy';
    $scope.units = [];
    $scope.searchTerm = '';
    $scope.isBusy = true;
    $scope.clientsCount = 0;
    var sumClients = function () {
        _.for($scope.units, function (unit) {
            $scope.clientsCount += unit.Clients.length;
        });
    };
    var loadUnits = function () {
        $scope.isBusy = true;
        var promise = unitsService.getUnits();
        promise.then(function (units) {
            angular.copy(units, $scope.units);
        }, function (error) {
            notificationService.pushError(error.Message);
        })
            .finally(function () {
                sumClients();
                $scope.isBusy = false;
            });
    };

    $scope.onUnitSelected = function (id) {
        $location.path('/dashboard/unit/' + id + '/details');
    }

    $scope.createUnit = function (unitName) {
        $scope.isBusy = true;
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
            $scope.isBusy = false;
        });
    }

    loadUnits();
}