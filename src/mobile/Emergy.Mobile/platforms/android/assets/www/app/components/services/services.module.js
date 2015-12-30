var services = angular.module('emergy.services', ['LocalStorageModule', 'ui.router', 'ngCordova']);

services.value('authData', {
    userId: '',
    userName: '',
    password: '',
    token: '',
    loggedIn: false,
    roles: [],
    isAdmin: function () {
        return this.roles.indexOf('Administrators') > -1;
    },
    isClient: function () {
        return this.roles.indexOf('Clients') > -1;
    }
});

services.constant('serviceBase', 'http://emergy-api.azurewebsites.net/');