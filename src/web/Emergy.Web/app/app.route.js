app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/landing");

    //admin routes
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
    $stateProvider.state("RegisterSuccess", {
        url: "/account/register/success",
        controller: "registerController",
        templateUrl: "app/views/register/registerSuccess.html"
    });

    $stateProvider.state("UserProfile", {
        url: "/account/profile/:userName",
        views: {
            '': {
                templateUrl: 'app/views/account/profile.html',
                controller: "profileController"
            },
            'shell@UserProfile': {
                templateUrl: 'app/views/shell/shell.html',
                controller: 'shellController'
            }
        },
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
    $stateProvider.state("ReportsForUnit", {
        url: "/dashboard/reports/:unitId?",
        views: {
            '': {
                templateUrl: 'app/views/reports/reports.html',
                controller: "reportsController"
            },
            'shell@ReportsForUnit': {
                templateUrl: 'app/views/shell/shell.html',
                controller: 'shellController'
            }
        },
        resolve:
        {
            authorize: ['$q', 'authData', function ($q, authData) {
                var deferred = $q.defer();
                if (!authData.loggedIn || !authData.isAdmin()) {
                    deferred.reject("Not Authorized");
                } else {
                    deferred.resolve('Authorized');
                }
                return deferred.promise;
            }]
        }
    });
    $stateProvider.state("Reports", {
        url: "/dashboard/reports",
        views: {
            '': {
                templateUrl: 'app/views/reports/reports.html',
                controller: "reportsController"
            },
            'shell@Reports': {
                templateUrl: 'app/views/shell/shell.html',
                controller: 'shellController'
            }
        },
        resolve:
        {
            authorize: ['$q', 'authData', function ($q, authData) {
                var deferred = $q.defer();
                if (!authData.loggedIn || !authData.isAdmin()) {
                    deferred.reject("Not Authorized");
                } else {
                    deferred.resolve('Authorized');
                }
                return deferred.promise;
            }]
        }
    });
    $stateProvider.state("ReportDetails", {
        url: "/dashboard/report/:reportId",
        views: {
            '': {
                templateUrl: 'app/views/reportDetails/reportDetails.html',
                controller: "reportDetailsController"
            },
            'shell@ReportDetails': {
                templateUrl: 'app/views/shell/shell.html',
                controller: 'shellController'
            }
        },
        resolve:
        {
            authorize: ['$q', 'authData', function ($q, authData) {
                var deferred = $q.defer();
                if (!authData.loggedIn || !authData.isAdmin()) {
                    deferred.reject("Not Authorized");
                } else {
                    deferred.resolve('Authorized');
                }
                return deferred.promise;
            }]
        }
    });
    $stateProvider.state("Units", {
        url: "/dashboard/units",
        views: {
            '': {
                templateUrl: 'app/views/units/units.html',
                controller: "unitsController"
            },
            'shell@Units': {
                templateUrl: 'app/views/shell/shell.html',
                controller: 'shellController'
            }
        },
        resolve:
        {
            authorize: ['$q', 'authData', function ($q, authData) {
                var deferred = $q.defer();
                if (!authData.loggedIn || !authData.isAdmin()) {
                    deferred.reject("Not Authorized");
                } else {
                    deferred.resolve('Authorized');
                }
                return deferred.promise;
            }]
        }
    });
    $stateProvider.state("Notifications", {
        url: "/dashboard/notifications",
        views: {
            '': {
                templateUrl: 'app/views/notifications/notifications.html',
                controller: "notificationsController"
            },
            'shell@Notifications': {
                templateUrl: 'app/views/shell/shell.html',
                controller: 'shellController'
            }
        },
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
    $stateProvider.state("UnitDetails", {
        url: "/dashboard/unit/:unitId/details",
        views: {
            '': {
                templateUrl: 'app/views/unitDetails/unitDetails.html',
                controller: "unitDetailsController"
            },
            'shell@UnitDetails': {
                templateUrl: 'app/views/shell/shell.html',
                controller: 'shellController'
            }
        },
        resolve:
        {
            authorize: ['$q', 'authData', function ($q, authData) {
                var deferred = $q.defer();
                if (!authData.loggedIn || !authData.isAdmin()) {
                    deferred.reject("Not Authorized");
                } else {
                    deferred.resolve('Authorized');
                }
                return deferred.promise;
            }]
        }
    });

    //client routes
    $stateProvider.state("ClientDashboard", {
        url: "/dashboard/client/:userId",
        views: {
            '': {
                templateUrl: 'app/views/client/dashboard.html',
                controller: "clientsController"
            },
            'shell@ClientDashboard': {
                templateUrl: 'app/views/shell/shell.html',
                controller: 'shellController'
            }
        },
        resolve:
        {
            authorize: ['$q', 'authData', function ($q, authData) {
                var deferred = $q.defer();
                if (!authData.loggedIn || !authData.isClient()) {
                    deferred.reject("Not Authorized");
                } else {
                    deferred.resolve('Authorized');
                }
                return deferred.promise;
            }]
        }
    });

}]);

app.run(['$rootScope', 'serviceBase', 'hubConnector', function ($rootScope, serviceBase, hubConnector) {

    $rootScope.$on('userAuthenticated', function () {
        var connection = $.hubConnection(serviceBase);
        var proxy = connection.createHubProxy('emergyHub');
        $rootScope.hub = proxy;

        hubConnector(connection, function () {
            proxy.on('testSuccess', function (message) {
                $rootScope.$broadcast('testSuccess', message);
            });
            proxy.on('pushNotification', function (notificationId) {
                $rootScope.$broadcast('pushNotification', notificationId);
            });
            proxy.on('pushMessage', function (messageId) {
                $rootScope.$broadcast('pushMessage', messageId);
            });
            proxy.on('notifyReportStatusChanged', function (reportId) {
                $rootScope.$broadcast('notifyReportStatusChanged', reportId);
            });
            proxy.on('updateUserLocation', function (locationId) {
                $rootScope.$broadcast('updateUserLocation', locationId);
            });
            $rootScope.$on('connectionStateChanged', function (state) {
                var stateConversion = {0: 'connecting', 1: 'connected', 2: 'reconnecting', 4: 'disconnected'};
                console.log('state changed from: ' + stateConversion[state.oldState]
                 + ' to: ' + stateConversion[state.newState]);
            });
        });

    });
}]);

app.run(['$rootScope', '$state', 'authService', 'notificationService', function ($rootScope, $state, authService, notificationService) {
    authService.fillAuthData();
    $rootScope.authData = authService.getAuthData();
    if ($rootScope.authData.loggedIn) {
        $rootScope.$broadcast('userAuthenticated');
    }
    $rootScope.currentState = '';

    $rootScope.$on('$stateChangeStart', function (e, toState) {
        $rootScope.currentState = toState;
    });
    $rootScope.$on('$stateChangeError', function (e, toState, toParams, fromState, fromParams, error) {
        if (error === "Not Authorized") {
            $state.go("Login");
            notificationService.pushError('You are not authenticated or you do not have access to specific functionality. Please log in!');
        }
    });
    $rootScope.logOut = function () {
        authService.logout();
    };
}]);


