var services = angular.module('emergy.services', ['LocalStorageModule', 'ui.router']);

services.value('authData', {
    userId: '',
    userName: '',
    password: '',
    token: '',
    loggedIn: false
});

services.constant('serviceBase', 'http://emergy-api.azurewebsites.net/');