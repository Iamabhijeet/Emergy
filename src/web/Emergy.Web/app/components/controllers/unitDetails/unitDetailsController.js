'use strict';

var controllerId = 'unitDetailsController';

app.controller(controllerId,
    ['$scope', '$state', '$rootScope', '$stateParams', 'unitsService',
        'authService', 'notificationService', 'authData', 'NgMap', unitDetailsController]);

function unitDetailsController($scope, $state, $rootScope, $stateParams, unitsService, authService, notificationService, authData, NgMap) {
    $rootScope.title = "Unit | Details";
    var marker;

    $scope.reRenderMap = function () {
        google.maps.event.trigger(this.map, 'resize');
    }
    
    NgMap.getMap().then(function (map) {
        $scope.map = map;
    });

    $scope.pickLocation = function (e) {
        if (marker) {
            marker.setMap(null);
            marker = new google.maps.Marker({ position: e.latLng, map: $scope.map });
            $scope.latitude = e.latLng.lat();
            $scope.longitude = e.latLng.lng();
        } else {
            marker = new google.maps.Marker({ position: e.latLng, map: $scope.map });
            $scope.latitude = e.latLng.lat();
            $scope.longitude = e.latLng.lng();
        }
    }

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

        var client = {
            UnitId: $scope.unit.Id,
            ClientId: clientId
        }

        var promise = unitsService.removeClient(client);
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
            $state.go("Units");
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    }

    $scope.addCategory = function (unitId, categoryName) {
        $scope.isBusy = true;
        var promise = unitsService.createCategory(categoryName);
        promise.then(function (categoryId) {
            promise = unitsService.addCategoryToUnit(unitId, categoryId);
            promise.then(function (response) {
                notificationService.pushSuccess("Category has been successfully added!");
                loadCategories();
            }), function (error) {
                notificationService.pushError(error.Message);
            }
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.categoryName = '';
            $scope.isBusy = false;
        });
    }

    $scope.removeCategory = function (categoryId) {
        $scope.isBusy = true;
        var promise = unitsService.removeCategory(categoryId);
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

    $scope.addLocation = function (unitId, locationName, latitude, longitude) {
        $scope.isBusy = true;
        var location = {
            Latitude: latitude,
            Longitude: longitude,
            Name: locationName,
            Type: "Fixed"
        }
        var promise = unitsService.createLocation(location);
        promise.then(function (locationId) {
            promise = unitsService.addLocationToUnit(unitId, locationId);
            promise.then(function (response) {
                notificationService.pushSuccess("Location has been successfully added!");
                loadLocations();
            }), function (error) {
                notificationService.pushError(error.Message);
            }
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    }

    $scope.removeLocation = function (locationId) {
        $scope.isBusy = true;
        var promise = unitsService.removeLocation(locationId);
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

    $scope.addCustomProperty = function (unitId, customPropertyName, customPropertyType) {
        $scope.isBusy = true;
        var customProperty = {
            Name: customPropertyName,
            CustomPropertyType: customPropertyType,
            UnitId: unitId
        }
        var promise = unitsService.createCustomProperty(customProperty);
        promise.then(function (customPropertyId) {
            promise = unitsService.addCustomPropertyToUnit(unitId, customPropertyId);
            promise.then(function (response) {
                notificationService.pushSuccess("Custom property has been successfully added!");
                loadCustomProperties();
            }), function (error) {
                notificationService.pushError(error.Message);
            }
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.customPropertyName = '';
            $scope.CustomPropertyType = '';
            $scope.isBusy = false;
        });
    }

    $scope.removeCustomProperty = function (customPropertyId) {
        $scope.isBusy = true;
        var promise = unitsService.removeCustomProperty(customPropertyId);
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

    $scope.addClient = function (unitId, clientKey) {
        $scope.isBusy = true;
        var promise = unitsService.getClientByKey(clientKey);
        promise.then(function (client) {
            promise = unitsService.addClient(unitId, JSON.stringify(client.Id));
            promise.then(function(response) {
                notificationService.pushSuccess("Client has been successfully added!");
                loadClients();
            }), function(error) {
                notificationService.pushError(error.Message);
            }
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
