﻿var app = angular.module('emergyWeb', ['ui.router', 'ui.materialize', 'ngSanitize',
    'ngAnimate', 'emergyWeb.services', 'emergyWeb.directives', 'angular-loading-bar',
    'ngFileUpload', 'ngImgCrop', 'vcRecaptcha', 'QuickList', 
    'uiGmapgoogle-maps', 'ngMap', 'chart.js','luegg.directives']);

app.config(function ($httpProvider, uiGmapGoogleMapApiProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.interceptors.push('authInterceptorService');
    $httpProvider.useApplyAsync(true);
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyD96dv6SVIOtho6kDXvLqsDe2A1D_ZDq28',
        v: '3.20',
        libraries: 'weather,geometry,visualization'
    });
});