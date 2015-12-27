var services = angular.module('emergyWeb.services', ['LocalStorageModule', 'ui.router', 'ngFileUpload', 'ngImgCrop']);
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