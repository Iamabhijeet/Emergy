(function () {
    'use strict';

    function statsService($http, $q, serviceBase, authData) {

        var service = {
            getStats: getStats
        };
        return service;
    }

    services.factory('statsService', statsService);

    statsService.$inject = ['$http', '$q', 'serviceBase', 'authData'];
})();