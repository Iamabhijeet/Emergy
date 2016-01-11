'use strict';
services.factory('reportsService', reportsService);

reportsService.$inject = ['$http', '$q', 'serviceBase', 'authData'];

function reportsService($http, $q, serviceBase, authData) {
    var getReports = function (lastDateTime) {
        var deffered = $q.defer();

        if (lastDateTime) {
            $http.post(serviceBase + 'api/reports/get/', JSON.stringify(lastDateTime))
                .success(function (response) { deffered.resolve(response); })
                .error(function (response) { deffered.reject(response); });
            return deffered.promise;
        }

        $http.get(serviceBase + 'api/reports/get/')
           .success(function (response) { deffered.resolve(response); })
           .error(function (response) { deffered.reject(response); });
        return deffered.promise;
    }
    var getReportsForUnit = function (unitId, lastDateTime) {
        var deffered = $q.defer();
        var reportsForUnit = [];
        getReports(lastDateTime)
        .then(function (response) {
            reportsForUnit = _.filter(response.data, function (report) {
                return report.Unit.Id === unitId;
            });
            deffered.resolve(reportsForUnit);
        }, function (response) { deffered.reject(response) });
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

    var service = {
        getReports: getReports,
        getReportsForUnit: getReportsForUnit,
        getReport: getReport,
        changeStatus: changeStatus,
        deleteReport: deleteReport
    };

    return service;
}
