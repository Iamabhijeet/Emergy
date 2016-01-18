'use strict';
services.factory('locationService', locationService);

locationService.$inject = ['$http', '$q', 'serviceBase'];

function locationService($http, $q, serviceBase, authData) {
    var updateUserLocation = function (locationId) {
        var deffered = $q.defer();
        $http.post(serviceBase + 'api/locations/users/update/' + locationId)
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var service = {
        updateUserLocation: updateUserLocation
    };

    return service;
}