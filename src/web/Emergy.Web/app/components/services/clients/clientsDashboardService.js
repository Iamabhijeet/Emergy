(function () {
    'use strict';

    function clientsDashboardService($http, authData) {
        function getData() { }

        var service = {
            getData: getData
        };
        return service;
    }

    services.factory('clientsDashboardService', clientsDashboardService);
    clientsDashboardService.$inject = ['$http', 'authData'];
})();