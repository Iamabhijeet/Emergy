﻿(function () {
    'use strict';

    function accountService($http, serviceBase) {

        var getProfile = function () {
            return $http.get(serviceBase + 'api/account/profile')
                .success(function (response) {
                    return response.data;
                })
                .error(function (response) {
                    return response.data;
                });
        };
        var editProfile = function (profile) {
            return $http.put(serviceBase + 'api/account/profile/edit', profile)
                .success(function (response) {
                    return response.data;
                })
                .error(function (response) {
                    return response.data;
                });
        };
        var getProfileByUsername = function (username) {
            return $http.get(serviceBase + 'api/account/with-username/' + username);
        };
        var getProfileByKey = function (key) {
            return $http.get(serviceBase + 'api/account/with-key/' + key);
        };
        var verifyKeyAndId = function (key, id) {
            return $http.get(serviceBase + 'api/account/isvalidkey?id=' + id + '&key=' + key);
        };
        var isUserNameTaken = function (userName) {
            return $http.post(serviceBase + 'api/account/isusernametaken', JSON.stringify(userName));
        };
        var isEmailTaken = function (email) {
            return $http.post(serviceBase + 'api/account/isemailtaken/', JSON.stringify(email));
        };

        var service = {
            getProfile: getProfile,
            getProfileByUsername: getProfileByUsername,
            getProfileByKey: getProfileByKey,
            verifyKeyAndId: verifyKeyAndId,
<<<<<<< HEAD
            isUserNameTaken: isUserNameTaken,
            isEmailTaken: isEmailTaken,
=======
>>>>>>> 613626698b6c54488107e98bd0f0b54fe033d969
            editProfile: editProfile
        };
        return service;
    }

    services.factory('accountService', accountService);

    accountService.$inject = ['$http', 'serviceBase'];
})();
