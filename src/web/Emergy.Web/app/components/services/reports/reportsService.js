'use strict';
services.factory('reportsService', reportsService);

reportsService.$inject = ['$http', '$q', 'serviceBase', 'authData'];

function reportsService($http, $q, serviceBase, authData) {
    var getReports = function (lastDateTime, isAdmin) {
        var deffered;
        if (lastDateTime) {
            deffered = $q.defer();
            if (authData.isAdmin()) {
                $http.get(serviceBase + 'api/reports/get-admin/' + lastDateTime)
                    .success(function (response) { deffered.resolve(response); })
                    .error(function (response) { deffered.reject(response); });
            }
            else {
                $http.get(serviceBase + 'api/reports/get-client')
                  .success(function (response) { deffered.resolve(response); })
                  .error(function (response) { deffered.reject(response); });
            }
            return deffered.promise;
        }

        deffered = $q.defer();

        $http.get(serviceBase + 'api/reports/get-admin')
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    }

    var getReport = function (reportId) {
        var deffered = $q.defer();
        $http.get(serviceBase + 'api/reports/get/' + reportId)
        .success(function (unit) {
            deffered.resolve(unit);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

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
        getReports: getReports,
        getReport: getReport,
        changeStatus: changeStatus,
        deleteReport: deleteReport
    };

    return service;
}
