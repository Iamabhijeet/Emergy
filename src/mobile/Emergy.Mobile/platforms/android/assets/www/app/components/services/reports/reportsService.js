﻿'use strict';
services.factory('reportsService', reportsService);

reportsService.$inject = ['$http', '$q', 'serviceBase', 'authData'];

function reportsService($http, $q, serviceBase, authData) {
    var getReports = function () {
        var deffered = $q.defer();
        $http.get(serviceBase + 'api/reports/get')
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var getReport = function (reportId) {
        var deffered = $q.defer();
        $http.get(serviceBase + 'api/reports/get/' + reportId)
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

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

    var setCustomProperties = function (reportId, customPropertyIds) {
        var deffered = $q.defer();
        $http.post(serviceBase + 'api/reports/set-properties/' + reportId, customPropertyIds)
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var setResources = function (reportId, resourceIds) {
        var deffered = $q.defer();
        $http.post(serviceBase + 'api/reports/set-resources/' + reportId, resourceIds)
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var addCustomPropertyValue = function(customPropertyValue, customPropertyId) {
        var deffered = $q.defer();

        var customPropertyValueModel = {
            SerializedValue: customPropertyValue,
            PropertyId: customPropertyId
        }

        $http.post(serviceBase + 'api/custom-props/add-value', customPropertyValueModel)
            .success(function(response) {
                deffered.resolve(response);
            })
            .error(function(response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var changeStatus = function(reportId, newStatus) {
        var deffered = $q.defer();
        $http.post(serviceBase + 'api/reports/change-status/' + reportId, newStatus)
            .success(function(response) {
                deffered.resolve(response);
            })
            .error(function(response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var service = {
        getReports: getReports,
        getReport: getReport, 
        createReport: createReport,
        setCustomProperties: setCustomProperties,
        setResources: setResources,
        addCustomPropertyValue: addCustomPropertyValue, 
        changeStatus: changeStatus
    };

    return service;
}