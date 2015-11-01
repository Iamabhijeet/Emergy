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
    var getUnit = function (id) {
        var deffered = $q.defer();
        $http.get(serviceBase + 'api/units/get/' + id)
        .success(function (unit) {
            deffered.resolve(unit);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var getClients = function(id) {
        var deffered = $q.defer();
        $http.get(serviceBase + 'api/units/clients/get/' + id)
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

    var service = {
        getUnits: getUnits,
        getUnit: getUnit,
        getClients: getClients,
        removeClient: removeClient
    };
    return service;

}
