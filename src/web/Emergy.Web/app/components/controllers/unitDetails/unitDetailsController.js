'use strict';

var controllerId = 'unitDetailsController';

app.controller(controllerId,
    ['$scope', '$state', '$rootScope', '$stateParams', 'unitsService',
        'authService', 'accountService', 'notificationService', 'authData',
        'mapService', unitDetailsController]);

function unitDetailsController($scope, $state, $rootScope, $stateParams, unitsService, authService, accountService, notificationService, authData, mapService) {
    $rootScope.title = "Unit | Details";

    var createMarker = function (latitude, longitude, title) {
        var marker = {
            latitude: latitude,
            longitude: longitude,
            title: title,
            id: title,
            icon: 'assets/img/location.png'
        };
        return marker;
    };

    $scope.map = {
        control: {},
        options: { draggable: true },
        center: { latitude: 0, longitude: 0 },
        events: {
            click: function (map, eventName, args) {
                $scope.markers = [];
                $scope.markers.push(createMarker(args[0].latLng.lat(), args[0].latLng.lng(), 'Location'));
                $scope.currentLocation = {
                    latitude: args[0].latLng.lat(),
                    longitude: args[0].latLng.lng()
                };
                $scope.location.Latitude = $scope.currentLocation.latitude;
                $scope.location.Longitude = $scope.currentLocation.longitude;
            }
        },
        zoom: 8,
        styles: [{ stylers: [{ hue: '#18C0D6' }, { visibility: 'simplified' }, { gamma: 0.5 }, { weight: 0.5 }] }, { featureType: 'water', stylers: [{ color: '#37474f' }] }]
    };
    $scope.markers = [];
    $scope.refreshMap = function () {
        $scope.map.control.refresh();
    };
    $scope.places = [];
    $scope.currentLocation = {};
    $scope.searchQuery = '';
    $scope.queryPlaces = function (query) {
        if (query !== '' &&
            query !== undefined &&
            query !== null) {
            mapService.queryPlaces(query, $scope.map.control.getGMap())
                .then(function (places) {
                    if (places.length > 0) {
                        $scope.places = places;
                    }
                }, function () { $scope.places = []; });
        } else {
            $scope.places = [];
        }
    };
    $scope.placeSelected = function (place) {
        $scope.markers = [];
        $scope.markers.push(createMarker(place.geometry.location.lat(), place.geometry.location.lng(), 'Location'));
        $scope.currentLocation = {
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng()
        };
        $scope.location.Name = place.name;
        $scope.location.Latitude = $scope.currentLocation.latitude;
        $scope.location.Longitude = $scope.currentLocation.longitude;
        $scope.markers.push(createMarker($scope.currentLocation.latitude, $scope.currentLocation.longitude, 'Location'));
    };
    $scope.placeLocation = {};
    $scope.location = {
        Name: '',
        Latitude: '',
        Longitude: ''
    };

    $scope.userFromUserName = {};
    $scope.userFromKey = {};
    $scope.clientValid = false;

    var tryNavigateToCurrentLocation = function () {
        mapService.getCurrentLocation()
            .then(function (position) {
                $scope.currentLocation = position;
                $scope.currentLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                $scope.location.Latitude = $scope.currentLocation.latitude;
                $scope.location.Longitude = $scope.currentLocation.longitude;
                $scope.markers = [];
                $scope.markers.push(createMarker($scope.currentLocation.latitude, $scope.currentLocation.longitude, 'Location'));
            });
    };
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

    $scope.editUnit = function (unitId) {
        $scope.isBusy = true;

        var unitEdit = {
            Id: unitId,
            Name: $scope.unit.Name
        };
        var promise = unitsService.editUnit(unitEdit);
        promise.then(function () {
            notificationService.pushSuccess("Successfully changed name!");
            loadUnit();
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    };
    $scope.deleteUnit = function (unitId) {
        $scope.isBusy = true;

        var promise = unitsService.deleteUnit(unitId);
        promise.then(function () {
            notificationService.pushSuccess("Unit has been deleted!");
            $state.go("Units");
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    };
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
            };
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.categoryName = '';
            $scope.isBusy = false;
        });
    };
    $scope.removeCategory = function (categoryId) {
        $scope.isBusy = true;
        var promise = unitsService.removeCategory(categoryId);
        promise.then(function () {
            notificationService.pushSuccess("Successfully removed category!");
            loadCategories();
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    };
    $scope.addLocation = function (unitId, location) {
        $scope.isBusy = true;
        location = {
            Latitude: location.Latitude,
            Longitude: location.Longitude,
            Name: location.Name,
            Type: "Fixed"
        };
        var promise = unitsService.createLocation(location);
        promise.then(function (locationId) {
            promise = unitsService.addLocationToUnit(unitId, locationId);
            promise.then(function () {
                notificationService.pushSuccess("Location has been successfully added!");
                loadLocations();
            }), function (error) {
                notificationService.pushError(error.Message);
            };
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    };
    $scope.removeLocation = function (locationId) {
        $scope.isBusy = true;
        var promise = unitsService.removeLocation(locationId);
        promise.then(function () {
            notificationService.pushSuccess("Successfully removed location!");
            loadLocations();
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    };
    $scope.addCustomProperty = function (unitId, customPropertyName, customPropertyType) {
        $scope.isBusy = true;
        var customProperty = {
            Name: customPropertyName,
            CustomPropertyType: customPropertyType,
            UnitId: unitId
        };
        var promise = unitsService.createCustomProperty(customProperty);
        promise.then(function (customPropertyId) {
            promise = unitsService.addCustomPropertyToUnit(unitId, customPropertyId);
            promise.then(function () {
                notificationService.pushSuccess("Custom property has been successfully added!");
                loadCustomProperties();
            }), function (error) {
                notificationService.pushError(error.Message);
            };
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.customPropertyName = '';
            $scope.CustomPropertyType = '';
            $scope.isBusy = false;
        });
    };
    $scope.removeCustomProperty = function (customPropertyId) {
        $scope.isBusy = true;
        var promise = unitsService.removeCustomProperty(customPropertyId);
        promise.then(function () {
            notificationService.pushSuccess("Successfully removed custom property!");
            loadCustomProperties();
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    };
    $scope.getUserByUsername = function (userName) {
        accountService.getProfileByUsername(userName).then(function (response) { angular.copy(response.data, $scope.userFromUserName); });
    };
    $scope.getUserByKey = function (key) {
        accountService.getProfileByKey(key).then(function (response) { angular.copy(response.data, $scope.userFromKey); });
    };
    $scope.verifyUserIdAndKey = function (id, key) {
        accountService.verifyKeyAndId(key, id).then(function (response) {
            $scope.clientValid = response.data;
        });
    };

    $scope.addClient = function (unitId, clientKey) {
        $scope.isBusy = true;
        var promise = unitsService.getClientByKey(clientKey);
        promise.then(function (client) {
            promise = unitsService.addClient(unitId, JSON.stringify(client.Id));
            promise.then(function (response) {
                notificationService.pushSuccess("Client has been successfully added!");
                loadClients();
            }), function (error) {
                notificationService.pushError(error.Message);
            };
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    };
    $scope.removeClient = function (clientId) {
        $scope.isBusy = true;

        var client = {
            UnitId: $scope.unit.Id,
            ClientId: clientId
        };
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
    };
    loadUnit();
    loadClients();
    loadLocations();
    loadCategories();
    loadCustomProperties();

    tryNavigateToCurrentLocation();
}
