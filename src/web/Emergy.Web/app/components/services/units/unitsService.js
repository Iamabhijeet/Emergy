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

    var service = {
        getUnits: getUnits,
        getUnit: getUnit
    };
    return service;

}
