var services = angular.module('emergyWeb.services', ['LocalStorageModule', 'ngRoute']);
services.value('authData', {
    userName: '',
    password: '',
    token: '',
    loggedIn: false
});
services.constant('serviceBase', '');