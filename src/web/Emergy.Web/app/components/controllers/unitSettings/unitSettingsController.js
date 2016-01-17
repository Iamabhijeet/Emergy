'use strict';

var controllerId = 'unitSettingsController';

app.controller(controllerId,
    ['vm', '$state', '$rootScope', '$stateParams', 'unitsService',
        'authService', 'accountService', 'notificationService', 'authData',
        'mapService', 'hub', 'signalR', 'reportsService', 'ngDialog', unitSettingsController]);

function unitSettingsController($scope, $state, $rootScope, $stateParams, unitsService, authService, accountService, notificationService, authData, mapService, hub, signalR, reportsService, ngDialog) {
    $rootScope.title = "Unit | Settings";
    $scope.notificationAvailable = false;

    $rootScope.$on(signalR.events.client.pushNotification, function (event, response) {
        $scope.notificationAvailable = true;
        var promise = notificationService.getNotification(response);
        promise.then(function (notification) {
            if (notification.Type === "ReportCreated") {
                var promise = reportsService.getReport(notification.ParameterId);
                promise.then(function (report) {
                    $scope.arrivedReport = {};
                    $scope.arrivedReport = report;
                    ngDialog.close();
                    ngDialog.open({
                        template: "reportCreatedModal",
                        disableAnimation: true,
                        scope: $scope
                    });
                }, function (error) {
                    notificationService.pushError("Error has happened while loading notification.");
                });
            }
            else if (notification.Type === "MessageArrived") {

            }
        });
    });

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
        center: { latitude: 49.088353, longitude: 7.112078 },
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
        zoom: 4,
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
        $scope.map.center = $scope.currentLocation;
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
                $scope.currentLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                $scope.location.Latitude = $scope.currentLocation.latitude;
                $scope.location.Longitude = $scope.currentLocation.longitude;
                $scope.markers = [];
                $scope.markers.push(createMarker($scope.currentLocation.latitude, $scope.currentLocation.longitude, 'Location'));
                $scope.map.center = $scope.currentLocation;
            });
    };

    var loadUnit = function () {
        $scope.isBusy = true;
        var promise = unitsService.getUnit($stateParams.unitId);
        promise.then(function (unit) {
            $scope.unit = unit;
        }, function (error) {
            notificationService.pushError("Error has happened while loading the unit.");
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
            notificationService.pushError("Error has happened while loading unit clients.");
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
            notificationService.pushError("Error has happened while loading unit locations.");
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
            notificationService.pushError("Error has happened while loading unit categories.");
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
            notificationService.pushError("Error has happened while loading unit custom properties.");
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    };

    $scope.editUnit = function (unitId) {
        $scope.isBusy = true;

        var unitEdit = {
            Id: unitId,
            Name: $scope.unitName
        };
        var promise = unitsService.editUnit(unitEdit);
        promise.then(function () {
            notificationService.pushSuccess("Successfully changed name!");
            delete $scope.unitName; 
            loadUnit();
        }, function (error) {
            notificationService.pushError("Error has happened while changing unit name.");
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    };

    $scope.openUnitDeleteDialog = function () {
        ngDialog.close();
        ngDialog.open({
            template: "confirmDeleteModal",
            disableAnimation: true,
            scope: $scope
        });
    };

    $scope.deleteUnit = function () {
        $scope.isBusy = true;

        var promise = unitsService.deleteUnit($scope.unit.Id);
        promise.then(function () {
            notificationService.pushSuccess("Unit has been deleted!");
            $state.go("Units");
        }, function (error) {
            notificationService.pushError("Error has happened while deleting the unit.");
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
            promise.then(function () {
                notificationService.pushSuccess("Category has been successfully added!");
                loadCategories();
            }), function (error) {
                notificationService.pushError("Error has happened while adding category to unit.");
            };
        }, function (error) {
            notificationService.pushError("Error has happened while creating category.");
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
            notificationService.pushError("Error has happened while ¸removing category.");
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    };

    $scope.addLocation = function (unitId, location) {
        $scope.map.center = $scope.currentLocation;
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
                notificationService.pushError("Error has happened adding location to unit.");
            };
        }, function (error) {
            notificationService.pushError("Error has happened while creating the location.");
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
            notificationService.pushError("Error has happened while removing location from unit.");
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
                notificationService.pushError("Error has happened while adding custom property to unit.");
            };
        }, function (error) {
            notificationService.pushError("Error has happened while creating the custom property.");
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
            notificationService.pushError("Error has happened while removing the custom property.");
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    };

    $scope.getUserByUsername = function (userName) {
        accountService.getProfileByUsername(userName).then(function (response) {
            angular.copy(response.data, $scope.userFromUserName);
            if ($scope.clientKey) {
                $scope.verifyUserIdAndKey($scope.clientKey);
            }
        });
    };

    $scope.verifyUserIdAndKey = function (key) {
        accountService.verifyKeyAndId(key, $scope.userFromUserName.Id).then(function (response) {
            $scope.clientValid = response.data;
            if ($scope.clientValid) {
                notificationService.pushSuccess('User Key is valid!');
            } else {
                notificationService.pushError('User Key is not valid!');
            }
        });
    };

    $scope.addClient = function (unitId) {
        $scope.isBusy = true;
        unitsService.addClient(unitId, JSON.stringify($scope.userFromUserName.Id))
            .then(function () {
                notificationService.pushSuccess("Client has been successfully added!");
                loadClients();
            })
            .finally(function () { $scope.isBusy = false; });
    };

    $scope.removeClient = function (clientId) {
        $scope.isBusy = true;

        var client = {
            UnitId: $scope.unit.Id,
            ClientId: clientId
        };
        var promise = unitsService.removeClient(client);
        promise.then(function () {
            notificationService.pushSuccess("Successfully removed client!");
            loadClients();
        }, function (error) {
            notificationService.pushError("Error has happened while removing client from unit.");
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
