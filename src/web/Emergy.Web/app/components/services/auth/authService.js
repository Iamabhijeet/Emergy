
'use strict';

var serviceId = 'authService';

services.factory(serviceId, ['$http', '$location', '$rootScope', '$q', 'serviceBase', 'localStorageService', 'authData', authService]);

function authService($http, $location, $rootScope, $q, serviceBase, localStorageService, authData) {
    function createRegisterData(name, surname, username, password,
        confirmPassword, email, profilePhoto,
        birthDate, gender, accountType) {
        var data = {
            Name: name,
            Surname: surname,
            Email: email,
            Username: username,
            Password: password,
            ConfirmPassword: confirmPassword,
            BirthDate: birthDate,
            Gender: gender,
            AccountType: accountType,
            ProfilePhoto: profilePhoto
        };
        return data;
    }

    function register(user) {
        var deffered = $q.defer();
        var data = user;
        $http.post(serviceBase + 'api/account/register', data).success(function (response) {
            deffered.resolve(response);
        }).error(function (response) {
            deffered.reject(response);
        });
        return deffered.promise;
    }

    function setAuthData(userId, username, password, token) {
        localStorageService.clearAll();
        localStorageService.set('userId', userId);
        localStorageService.set('username', username);
        localStorageService.set('password', password);
        localStorageService.set('token', token);
        localStorageService.set('loggedIn', true);

        authData.userId = userId;
        authData.userName = username;
        authData.password = password;
        authData.token = token;
        authData.loggedIn = true;
    }

    function createLoginData(username, password) {
        var data = {
            Username: username,
            Password: password
        };
        return data;
    }

    function login(user) {

        var deffered = $q.defer();

        $http.post(serviceBase + 'api/account/login', createLoginData(user.userName, user.password), { headers: { 'Content-Type': 'application/json' } }).success(function (data) {
            deffered.resolve(data);
            setAuthData(data.UserId, user.userName, user.password, data.Token);
            $rootScope.authData = authData;
            $location.path('/dashboard/units');

        }).error(function (data) {
            deffered.reject(data);
            authData.loggedIn = false;
            $rootScope.authData = authData;
        });

        return deffered.promise;
    }

    function logout() {
        localStorageService.remove('userId');
        localStorageService.remove('username');
        localStorageService.remove('password');
        localStorageService.remove('token');
        localStorageService.remove('loggedIn');
        localStorageService.set('loggedIn', false);
        authData.loggedIn = false;
        $location.path('/landing');
    }

    function changePassword(newPassword, confirmPassword) {
        var deffered = $q.defer();

        $http.post(serviceBase + 'api/account/changepassword', createChangePasswordData(newPassword, confirmPassword)).success(
            function (response) {
                deffered.resolve(response);
                authData.password = newPassword;
                localStorageService.set('password', newPassword);
            }).error(function (reason) {
                deffered.reject(reason);
            });

        return deffered.promise;
    }

    function getUserData(username) {
        var deffered = $q.defer();

        $http.get(serviceBase + 'api/account/user/' + username).success(function (response) {
            deffered.resolve(response);
        }).error(function (reason) {
            deffered.reject(reason);
        });

        return deffered.promise;
    }

    function fillAuthData() {
        authData.userId = localStorageService.get('userId');
        authData.userName = localStorageService.get('username');
        authData.password = localStorageService.get('password');
        authData.token = localStorageService.get('token');
        authData.loggedIn = localStorageService.get('loggedIn');
    }

    function getAuthData() {
        fillAuthData();
        return authData;
    }

    function createChangePasswordData(newPassword, confirmPassword) {
        var data = {
            OldPassword: authData.password,
            NewPassword: newPassword,
            ConfirmPassword: confirmPassword
        };
        return data;
    }

    var service = {
        register: register,
        login: login,
        logout: logout,
        changePassword: changePassword,
        getUserData: getUserData,
        fillAuthData: fillAuthData,
        getAuthData: getAuthData
    };
    return service;

};