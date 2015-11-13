'use strict';
services.factory('unitsService', unitsService);

unitsService.$inject = ['$http', '$q', 'serviceBase', 'authData'];

function unitsService($http, $q, serviceBase, authData) {
    var getUnits = function () {
        var deffered = $q.defer();
        $http.get(serviceBase + 'api/units/get')
        .success(function (units) {
            deffered.resolve(units);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var getUnit = function (unitId) {
        var deffered = $q.defer();
        $http.get(serviceBase + 'api/units/get/' + unitId)
        .success(function (unit) {
            deffered.resolve(unit);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var getClients = function(unitId) {
        var deffered = $q.defer();
        $http.get(serviceBase + 'api/units/clients/get/' + unitId)
        .success(function (clients) {
            deffered.resolve(clients);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var removeClient = function(unitId, clientId) {
        var deffered = $q.defer();
        $http.post(serviceBase + 'api/units/clients/remove/' + unitId, clientId)
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var getClientByKey = function (clientKey) {
        var deffered = $q.defer();
        $http.get(serviceBase + 'api/account/with-key/' + clientKey)
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var addClient = function (unitId, clientId) {
        var deffered = $q.defer();
        $http.post(serviceBase + 'api/units/clients/add/' + unitId, clientId)
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var getLocations = function (unitId) {
        var deffered = $q.defer();
        $http.get(serviceBase + 'api/units/locations/get/' + unitId)
        .success(function (locations) {
            deffered.resolve(locations);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var getCategories = function (unitId) {
        var deffered = $q.defer();
        $http.get(serviceBase + 'api/units/categories/get/' + unitId)
        .success(function (categories) {
            deffered.resolve(categories);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var getCustomProperties = function (unitId) {
        var deffered = $q.defer();
        $http.get(serviceBase + 'api/units/custom-properties/get/' + unitId)
        .success(function (customProperties) {
            deffered.resolve(customProperties);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var editUnit = function(unitEdit) {
        var deffered = $q.defer();
        $http.put(serviceBase + 'api/units/edit/', unitEdit)
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    }

    var deleteUnit = function (unitId) {
        var deffered = $q.defer();
        $http.delete(serviceBase + 'api/units/delete/' + unitId)
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    }

    var removeLocation = function (unitId, locationId) {
        var deffered = $q.defer();
        $http.delete(serviceBase + 'api/units/locations/remove/' + unitId, locationId)
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var removeCategory = function (categoryId) {
        var deffered = $q.defer();
        $http.delete(serviceBase + 'api/units/categories/remove/' + categoryId)
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var createCategory = function (categoryName) {
        var deffered = $q.defer();
        $http.post(serviceBase + 'api/categories/create/' + categoryName)
        .success(function (response) {
            deffered.resolve(response);
        })
        .error(function (response) {
            deffered.reject(response);
        });
        return deffered.promise;
    };

    var addCategoryToUnit = function (unitId, categoryId) {
        var deffered = $q.defer();
        $http.post(serviceBase + 'api/units/categories/add/' + unitId, categoryId)
        .success(function (response) {
            deffered.resolve(response);
        })
        .error(function (response) {
            deffered.reject(response);
        });
        return deffered.promise;
    };

    var removeCustomProperty = function (unitId, customPropertyId) {
        var deffered = $q.defer();
        $http.delete(serviceBase + 'api/units/custom-property/remove/' + unitId, customPropertyId)
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var createCustomProperty = function (customProperty) {
        var deffered = $q.defer();
        $http.post(serviceBase + 'api/custom-props/create/', customProperty)
        .success(function (response) {
            deffered.resolve(response);
        })
        .error(function (response) {
            deffered.reject(response);
        });
        return deffered.promise;
    };

    var addCustomPropertyToUnit = function (unitId, customPropertyId) {
        var deffered = $q.defer();
        $http.post(serviceBase + 'api/units/custom-property/add/' + unitId, customPropertyId)
        .success(function (response) {
            deffered.resolve(response);
        })
        .error(function (response) {
            deffered.reject(response);
        });
        return deffered.promise;
    };

    var createLocation = function (location) {
        var deffered = $q.defer();
        $http.post(serviceBase + 'api/locations/create/', location)
        .success(function (response) {
            deffered.resolve(response);
        })
        .error(function (response) {
            deffered.reject(response);
        });
        return deffered.promise;
    };

    var addLocationToUnit = function (unitId, locationId) {
        var deffered = $q.defer();
        $http.post(serviceBase + 'api/units/locations/add/' + unitId, locationId)
        .success(function (response) {
            deffered.resolve(response);
        })
        .error(function (response) {
            deffered.reject(response);
        });
        return deffered.promise;
    };

    var service = {
        getUnits: getUnits,
        getUnit: getUnit,
        getClients: getClients,
        removeClient: removeClient,
        getClientByKey: getClientByKey,
        addClient: addClient, 
        getLocations: getLocations,
        getCategories: getCategories,
        getCustomProperties: getCustomProperties,
        editUnit: editUnit,
        deleteUnit: deleteUnit,
        removeLocation: removeLocation,
        removeCategory: removeCategory,
        removeCustomProperty: removeCustomProperty,
        createCategory: createCategory,
        addCategoryToUnit: addCategoryToUnit,
        createLocation: createLocation,
        addLocationToUnit: addLocationToUnit,
        createCustomProperty: createCustomProperty,
        addCustomPropertyToUnit: addCustomPropertyToUnit
    };
    return service;

}
