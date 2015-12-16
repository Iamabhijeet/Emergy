app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/tab/home');

    $stateProvider.state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: function() {
                if (ionic.Platform.isAndroid()) {
                    return "app/views/tabsAndroid/tabsAndroid.html";
                }
                return "app/views/tabsIos/tabsIos.html";
            }
        });

    $stateProvider.state('tab.home', {
        url: '/home',
        views: {
            'tab-home': {
                templateUrl: 'app/views/home/home.html',
                controller: 'homeController'
            }
        },
        resolve:
        {
            authorize: ['$q', 'authData', function($q, authData) {
                var deferred = $q.defer();
                if (!authData.loggedIn) {
                    deferred.reject("Not authorized");
                } else {
                    deferred.resolve("Authorized");
                }
                return deferred.promise;
            }]
        }
    });
    $stateProvider.state('tab.reports', {
        url: '/reports',
        views: {
            'tab-reports': {
                templateUrl: 'app/views/reports/reports.html',
                controller: 'reportsController'
            }
        },
        resolve:
        {
            authorize: ['$q', 'authData', function ($q, authData) {
                var deferred = $q.defer();
                if (!authData.loggedIn) {
                    deferred.reject("Not authorized");
                } else {
                    deferred.resolve("Authorized");
                }
                return deferred.promise;
            }]
        }
    });
    $stateProvider.state('tab.report-details', {
        url: '/report/:reportId',
        views: {
            'tab-report-details': {
                templateUrl: 'app/views/reportDetails/reportDetails.html',
                controller: 'reportController'
            }
        },
        resolve:
        {
            authorize: ['$q', 'authData', function ($q, authData) {
                var deferred = $q.defer();
                if (!authData.loggedIn) {
                    deferred.reject("Not authorized");
                } else {
                    deferred.resolve("Authorized");
                }
                return deferred.promise;
            }]
        }
    });

    $stateProvider.state('tab.profile', {
        url: '/profile/:userId',
        views: {
            'tab-profile': {
                templateUrl: 'app/views/profile/profile.html',
                controller: 'profileController'
            }
        },
        resolve:
        {
            authorize: ['$q', 'authData', function ($q, authData) {
                var deferred = $q.defer();
                if (!authData.loggedIn) {
                    deferred.reject("Not authorized");
                } else {
                    deferred.resolve("Authorized");
                }
                return deferred.promise;
            }]
        }
    });
    $stateProvider.state('Login', {
        url: '/login',
        templateUrl: 'app/views/login/login.html',
        controller: 'loginController'
    });
});

app.run(['$rootScope', '$state', 'authService', function ($rootScope, $state, authService) {
    authService.fillAuthData();
    $rootScope.authData = authService.getAuthData();

    $rootScope.$on('$stateChangeError', function (e, toState, toParams, fromState, fromParams, error) {
        if (error === "Not Authorized") {
            $state.go("Login");
        }
    });
}]);