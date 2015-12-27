'use strict';
services.factory('reportsService', reportsService);

reportsService.$inject = ['$http', '$q', 'serviceBase', 'authData'];

function reportsService($http, $q, serviceBase, authData) {
    var createReport = function (report) {
        var deffered = $q.defer();
        $http.post(serviceBase + 'api/reports/create', report)
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var service = {
        createReport: createReport
    };

    return service;
}