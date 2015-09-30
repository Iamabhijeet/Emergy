var app = angular.module('emergyWeb', ['ui.router', 'ui.materialize', 'ngSanitize',
    'ngAnimate', 'emergyWeb.services', 'emergyWeb.directives', 'angular-loading-bar']);

app.config(function ($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.interceptors.push('authInterceptorService');
});
