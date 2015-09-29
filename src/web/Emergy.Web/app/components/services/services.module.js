var services = angular.module('emergyWeb.services', ['LocalStorageModule', 'ui.router']);
services.value('authData', {
    userName: '',
    password: '',
    token: '',
    loggedIn: false
});
services.constant('serviceBase', 'http://emergy-api.azurewebsites.net/');