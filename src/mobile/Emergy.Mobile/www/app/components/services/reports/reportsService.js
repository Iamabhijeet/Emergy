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

    var addCustomPropertyValue = function(customPropertyValue, customPropertyId) {
        var deffered = $q.defer();

        var customPropertyValueModel = {
            SerializedValue: customPropertyValue,
            PropertyId: customPropertyId
        }

        $http.post(serviceBase + 'api/custom-props/add-value', customPropertyValueModel)
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    }

    var service = {
        createReport: createReport,
        setCustomProperties: setCustomProperties,
        addCustomPropertyValue: addCustomPropertyValue
    };

    return service;
}