'use strict';
services.factory('reportsService', reportsService);

reportsService.$inject = ['$http', '$q', 'serviceBase', 'authData'];

function reportsService($http, $q, serviceBase, authData) {

    var deleteReport = function (reportId) {
        var deffered = $q.defer();
        $http.delete(serviceBase + 'api/reports/delete/' + reportId)
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    }

    var changeStatus = function (reportId, newStatus) {
        var deffered = $q.defer();
        $http.post(serviceBase + 'api/reports/change-status/' + reportId, newStatus)
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    }

    var service = {
        deleteReport: deleteReport,
        changeStatus: changeStatus
    };

    return service;
}
