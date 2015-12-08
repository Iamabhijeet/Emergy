﻿var services = angular.module('emergyWeb.services', ['LocalStorageModule', 'ui.router', 'ngFileUpload', 'ngImgCrop']);
services.value('authData', {
    userId: '',
    userName: '',
    password: '',
    token: '',
    loggedIn: false
});
services.constant('serviceBase', 'http://emergy-api.azurewebsites.net/');