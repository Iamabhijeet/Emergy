﻿'use strict';
services.factory('locationService', locationService);

locationService.$inject = ['$http', '$q', 'serviceBase'];

function locationService($http, $q, serviceBase, authData) {
    var updateUserLocation = function (locationId) {
        var deffered = $q.defer();
        $http.post(serviceBase + 'api/locations/users/update/' + locationId)
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var getLatestUserLocation = function (userId) {
            return $http.get(serviceBase + 'api/locations/get-user/latest/' + userId)
                .success(function (response) {
                    return response.data;
                })
                .error(function (response) {
                    return response.data;
                });
        };

    var getLocationForReport = function(reportId) {
        var deffered = $q.defer();
        $http.get(serviceBase + 'api/locations/get-report/' + reportId)
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    }

    var service = {
        updateUserLocation: updateUserLocation,
        getLocationForReport: getLocationForReport, 
        getLatestUserLocation: getLatestUserLocation
    };

    return service;
}