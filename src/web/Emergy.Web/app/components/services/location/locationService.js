(function () {
    'use strict';

    function locationService($http, serviceBase) {
        var getLatestUserLocation = function (userId) {
            return $http.get(serviceBase + 'api/locations/get-user/latest/' + userId)
                .success(function (response) {
                    return response.data;
                })
                .error(function (response) {
                    return response.data;
                });
        };
        

        var service = {
            getLatestUserLocation: getLatestUserLocation
        };
        return service;
    }

    services.factory('locationService', locationService);

    locationService.$inject = ['$http', 'serviceBase'];
})();
