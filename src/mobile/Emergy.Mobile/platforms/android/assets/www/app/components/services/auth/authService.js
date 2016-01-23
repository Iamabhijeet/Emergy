'use strict';

var serviceId = 'authService';

services.factory(serviceId, ['$http', '$state', '$rootScope', '$q', 'serviceBase',
    'localStorageService', 'authData', 'notificationService', authService]);

function authService($http, $state, $rootScope, $q, serviceBase, localStorageService, authData, notificationService) {

    function setAuthData(userId, username, password, token, roles) {
        localStorageService.clearAll();
        localStorageService.set('userId', userId);
        localStorageService.set('username', username);
        localStorageService.set('password', password);
        localStorageService.set('token', token);
        localStorageService.set('loggedIn', true);
        localStorageService.set('roles', roles);

        authData.userId = userId;
        authData.userName = username;
        authData.password = password;
        authData.token = token;
        authData.loggedIn = true;
        authData.roles = roles;
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

        $http.post(serviceBase + 'api/account/login', createLoginData(user.userName, user.password), { headers: { 'Content-Type': 'application/json' } })
                .success(function (data) {
                    setAuthData(data.UserId, user.userName, user.password, data.Token, data.Roles);
                    $rootScope.authData = authData;
                    if (authData.isClient()) {
                        deffered.resolve(data);
                        $state.go('tab.home');
                    } else {
                        notificationService.displayMessage('Unauthorized!', 'You must be a client!');
                        authData.loggedIn = false;
                        deffered.reject(data);
                    }
                })
                .error(function (data) {
                    authData.loggedIn = false;
                    $rootScope.authData = authData;
                    notificationService.displayMessage('Invalid credentials!', 'Username or password is incorrect!');
                    deffered.reject(data);
                });

        return deffered.promise;
    }

    function logout() {
        localStorageService.remove('userId');
        localStorageService.remove('username');
        localStorageService.remove('password');
        localStorageService.remove('token');
        localStorageService.remove('loggedIn');
        localStorageService.remove('roles');
        localStorageService.set('loggedIn', false);
        authData.loggedIn = false;
        $state.go('login');
    }

    function fillAuthData() {
        authData.userId = localStorageService.get('userId');
        authData.userName = localStorageService.get('username');
        authData.password = localStorageService.get('password');
        authData.token = localStorageService.get('token');
        authData.loggedIn = localStorageService.get('loggedIn');
        authData.roles = localStorageService.get('roles');
    }

    function getAuthData() {
        fillAuthData();
        return authData;
    }

    var service = {
        login: login,
        logout: logout,
        fillAuthData: fillAuthData,
        getAuthData: getAuthData
    };
    return service;

};