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


    var service = {
        getUnits: getUnits,
        getLocations: getLocations,
        getCategories: getCategories
};

    return service;
}