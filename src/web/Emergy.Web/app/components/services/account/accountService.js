(function () {
    'use strict';

    function accountService($http, serviceBase) {

        var getProfile = function() {
            return $http.get(serviceBase + 'api/account/profile')
                .success(function(response) {
                    return response.data;
                })
                .error(function(response) {
                    return response.data;
                });
        };

        var editProfile = function(profile) {
            return $http.put(serviceBase + 'api/account/profile/edit', profile)
                .success(function(response) {
                    return response.data;
                })
                .error(function(response) {
                    return response.data;
                });
        };

        var service = {
            getProfile: getProfile,
            editProfile: editProfile
        };
        return service;
    }

    services.factory('accountService', accountService);

    accountService.$inject = ['$http', 'serviceBase'];
})();