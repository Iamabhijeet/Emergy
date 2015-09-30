app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/landing");

    $stateProvider.state("Landing", {
        url: "/landing",
        controller: "landingController",
        templateUrl: "app/views/landing.html"
    });
    $stateProvider.state("Login", {
        url: "/account/login",
        controller: "loginController",
        templateUrl: "app/views/login/login.html"
    });
    $stateProvider.state("Register", {
        url: "/account/register",
        controller: "registerController",
        templateUrl: "app/views/register/register.html"
    });
    $stateProvider.state("Home", {
        url: "/home",
        controller: "shellController",
        templateUrl: "app/views/shell/shell.html",
        resolve:
        {
            authorize: ['$q', 'authData', function ($q, authData) {
                var deferred = $q.defer();
                if (!authData.loggedIn) {
                    deferred.reject("Not Authorized");
                } else {
                    deferred.resolve('Authorized');
                }
                return deferred.promise;
            }]
        }

    });
}]);
app.run(['$rootScope', '$state', 'authService', function ($rootScope, $state, authService) {
    authService.fillAuthData();
    $rootScope.authData = authService.getAuthData();

    $rootScope.$on('$stateChangeError', function (e, toState, toParams, fromState, fromParams, error) {
        if (error === "Not Authorized") {
            $state.go("Login");
        }
    });

    $rootScope.logOut = function () {
        authService.logout();
    };
}]);


