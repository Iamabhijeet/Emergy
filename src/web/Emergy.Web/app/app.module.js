var app = angular.module('emergyWeb', ['ui.router', 'ui.materialize', 'ngMap', 'ngSanitize',
    'ngAnimate', 'emergyWeb.services', 'emergyWeb.directives', 'angular-loading-bar',
    'ngFileUpload', 'ngImgCrop']);

app.config(function ($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.interceptors.push('authInterceptorService');
});
