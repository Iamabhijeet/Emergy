'use strict';

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
    $scope.search = function (searchTerm) {
        if (searchTerm !== undefined) {
            $scope.isBusy = true;
            var results = [];
            _.forEach($scope.units, function (unit) {
                if (unit.Name.toLowerCase().indexOf(searchTerm) >= 0) {
                    results.push(unit);
                }
            });
            angular.copy(results, $scope.units);
            $scope.isBusy = false;
        }
    }
    $scope.refresh = function () {
        onLoaded();
    }
    onLoaded();
}