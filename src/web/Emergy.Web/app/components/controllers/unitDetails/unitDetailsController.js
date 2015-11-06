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

    var loadCategories = function () {
        $scope.isBusy = true;
        var promise = unitsService.getCategories($stateParams.unitId);
        promise.then(function (categories) {
            $scope.categories = categories;
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    };

    var loadCustomProperties = function () {
        $scope.isBusy = true;
        var promise = unitsService.getCustomProperties($stateParams.unitId);
        promise.then(function (customProperties) {
            $scope.customProperties = customProperties;
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    };

    $scope.removeClient = function(clientId) {
        $scope.isBusy = true;
        var promise = unitsService.removeClient($scope.unit.Id, JSON.stringify(clientId));
        promise.then(function (response) {
                notificationService.pushSuccess("Successfully removed client!"); 
                loadClients();
            }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    }

    $scope.editUnit = function(unitId) {
        $scope.isBusy = true;

        var unitEdit = {
            Id: unitId, 
            Name: $scope.unit.Name
        }

        var promise = unitsService.editUnit(unitEdit);
        promise.then(function (response) {
            notificationService.pushSuccess("Successfully changed name!");
            loadUnit();
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    }

    $scope.deleteUnit = function(unitId) {
        $scope.isBusy = true;

        var promise = unitsService.deleteUnit(unitId);
        promise.then(function (response) {
            notificationService.pushSuccess("Unit has been deleted!");
            $location.path("/dashboard/units")
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    }

    $scope.removeCategory = function (categoryId) {
        $scope.isBusy = true;
        var promise = unitsService.removeCategory($scope.unit.Id, categoryId);
        promise.then(function (response) {
            notificationService.pushSuccess("Successfully removed category!");
            loadCategories();
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    }

    $scope.removeLocation = function (locationId) {
        $scope.isBusy = true;
        var promise = unitsService.removeLocation($scope.unit.Id, locationId);
        promise.then(function (response) {
            notificationService.pushSuccess("Successfully removed location!");
            loadLocations();
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    }

    $scope.removeCustomProperty = function (customPropertyId) {
        $scope.isBusy = true;
        var promise = unitsService.removeCustomProperty($scope.unit.Id, customPropertyId);
        promise.then(function (response) {
            notificationService.pushSuccess("Successfully removed custom property!");
            loadCustomProperties();
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
    loadCategories();
    loadCustomProperties();
}
