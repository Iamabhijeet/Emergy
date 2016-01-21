var app = angular.module('emergy', ['ionic', 'ngCordova', 'ionMdInput', 'ngMap', 'emergy.controllers', 'emergy.services', 'emergy.directives']);

app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});

app.config(function ($httpProvider, $ionicConfigProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.interceptors.push('authInterceptorService');
    $ionicConfigProvider.views.swipeBackEnabled(false);
});
