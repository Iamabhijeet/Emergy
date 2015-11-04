'use strict';

var controllerId = 'unitDetailsController';

app.controller(controllerId,
    ['$scope', '$rootScope', '$stateParams', 'unitsService',
        'authService', 'notificationService', 'authData', unitDetailsController]);

function unitDetailsController($scope, $rootScope, $stateParams, unitsService, authService, notificationService, authData) {
    $rootScope.title = "Unit | Details";

    var loadUnit = function () {
        $scope.isBusy = true;
        var promise = unitsService.getUnit($stateParams.unitId);
        promise.then(function (unit) {
            $scope.unit = unit;
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    };

    var loadClients = function () {
        $scope.isBusy = true;
        var promise = unitsService.getClients($stateParams.unitId);
        promise.then(function (clients) {
            $scope.clients = clients;
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    };

    var loadLocations = function () {
        $scope.isBusy = true;
        var promise = unitsService.getLocations($stateParams.unitId);
        promise.then(function (locations) {
            $scope.locations = locations;
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    };

    $scope.removeClient = function(id) {
        $scope.isBusy = true;
        var promise = unitsService.removeClient($scope.unit.Id, JSON.stringify(id));
        promise.then(function (response) {
                loadClients();
            }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    }

    loadUnit();
    loadClients();
    loadLocations();
}