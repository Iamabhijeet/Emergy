﻿'use strict';
services.factory('reportsService', reportsService);

reportsService.$inject = ['$http', '$q', 'serviceBase', 'authData'];

function reportsService($http, $q, serviceBase, authData) {

    var getReports = function (lastDateTime) {
        var deffered;
        if (lastDateTime) {
            
            deffered = $q.defer();
            $http.get(serviceBase + 'api/reports/get-admin/' + lastDateTime)
            .success(function (response) {
                deffered.resolve(response);
            })
                .error(function (response) {
                    deffered.reject(response);
                });
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
        changeStatus: changeStatus,
        deleteReport: deleteReport
    };

    return service;
}
