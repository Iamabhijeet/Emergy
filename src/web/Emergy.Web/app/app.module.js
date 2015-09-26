var app = angular.module('emergyWeb', ['ui.router', 'ui.materialize', 'ngSanitize', 'ngAnimate', 'emergyWeb.services', 'emergyWeb.directives']);

app.config(function ($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.interceptors.push('authInterceptorService');
});
app.run(['$rootScope', 'authService', '$location', function ($rootScope, authService, $location) {
    authService.fillAuthData();
    $rootScope.authData = authService.getAuthData();

    $rootScope.$on('$locationChangeStart', function (next, current) {
        if (next.templateUrl === "/app/views/manage/manage.html" && !$rootScope.authData.loggedIn) {
            $location.path('/account/login');
        }
        if (next.templateUrl === "/app/views/landing.html" && !$rootScope.authData.loggedIn) {
            $location.path('/account/login');
        }
    });


    $rootScope.logOut = function () {
        authService.logout();
    };
}]);


