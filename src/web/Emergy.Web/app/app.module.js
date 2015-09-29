var app = angular.module('emergyWeb', ['ui.router', 'ui.materialize', 'ngSanitize',
    'ngAnimate', 'emergyWeb.services', 'emergyWeb.directives', 'angular-loading-bar']);

app.config(function ($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.interceptors.push('authInterceptorService');
});
app.run(['$rootScope', 'authService', '$location', function ($rootScope, authService, $location) {
    authService.fillAuthData();
    $rootScope.authData = authService.getAuthData();
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if ($rootScope.authData.isLoggedIn === false) {
            // no logged user, we should be going to #login
            if (next.templateUrl === "views/login/login.html") {
                // already going to #login, no redirect needed
            } else {
                $location.path("/account/login");
            }
        }
    });
    $rootScope.logOut = function () {
        authService.logout();
    };
}]);

