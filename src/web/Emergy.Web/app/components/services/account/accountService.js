(function () {
    'use strict';

    function accountService($http, serviceBase) {
        function getProfile() {
            return $http.get(serviceBase + 'api/account/profile')
                .success(function (response) {
                    return response.data;
                })
                .error(function (response) {
                    return response.data;
                });
        }

        var service = {
            getProfile: getProfile
        };
        return service;
    }

    services.factory('accountService', accountService);

    accountService.$inject = ['$http', 'serviceBase'];
})();