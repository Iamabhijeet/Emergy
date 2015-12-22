(function () {
    'use strict';

    function statsService($http, $q, serviceBase, authData) {
        function getStats() {
            var deffered = $q.defer();
            $http.get(serviceBase + 'api/statistics/compute')
                 .success(function (response) { deffered.resolve(response); })
                 .error(function (response) { deffered.reject(response); });
            return deffered.promise;
        };
        var service = {
            getStats: getStats
        };
        return service;
    }

    services.factory('statsService', statsService);

    statsService.$inject = ['$http', '$q', 'serviceBase', 'authData'];
})();