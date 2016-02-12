app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/");

    //admin routes
    $stateProvider.state("Landing", {
        url: "/",
        controller: "landingController",
        templateUrl: "app/views/landing.html"
    });
    $stateProvider.state("Login", {
        url: "/login",
        controller: "loginController",
        templateUrl: "app/views/login/login.html"
    });
    $stateProvider.state("Register", {
        url: "/register",
        controller: "registerController",
        templateUrl: "app/views/register/register.html"
    });
    $stateProvider.state("RegisterSuccess", {
        url: "/register/success",
        controller: "registerController",
        templateUrl: "app/views/register/registerSuccess.html"
    });

    $stateProvider.state("UserProfile", {
        url: "/profile/:userName",
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
        url: "/reports/:unitId?",
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
        url: "/reports",
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
        url: "/report/:reportId",
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
        url: "/units",
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
        url: "/notifications",
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
    $stateProvider.state("Messaging", {
        url: "/messaging",
        views: {
            '': {
                templateUrl: 'app/views/messaging/messaging.html',
                controller: "messagingController"
            },
            'shell@Messaging': {
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
    $stateProvider.state("Messages", {
        url: "/messages/:targetId",
        views: {
            '': {
                templateUrl: 'app/views/messages/messages.html',
                controller: "messagesController"
            },
            'shell@Messages': {
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
    $stateProvider.state("UnitSettings", {
        url: "/unit/:unitId/settings",
        views: {
            '': {
                templateUrl: 'app/views/unitSettings/unitSettings.html',
                controller: "unitSettingsController"
            },
            'shell@UnitSettings': {
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
    $stateProvider.state("Statistics", {
        url: "/statistics",
        views: {
            '': {
                templateUrl: 'app/views/stats/stats.html',
            },
            'shell@Statistics': {
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
        url: "/client/:userId",
        views: {
            '': {
                templateUrl: 'app/views/client/dashboard.html'
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

app.run(['$rootScope', 'signalR', function ($rootScope, signalR) {
    $rootScope.constructor.prototype.$off = function (eventName) {
        if (this.$$listeners) {
            this.$$listeners[eventName] = [];
        }
    };

    $rootScope.unSubscribeAll = function () {
        $rootScope.$off(signalR.events.connectionStateChanged);
        $rootScope.$off(signalR.events.realTimeConnected);
        $rootScope.$off(signalR.events.client.testSuccess);
        $rootScope.$off(signalR.events.client.pushNotification);
        $rootScope.$off(signalR.events.client.updateUserLocation);
    };
}]);


app.run(['$rootScope', '$state', 'authService', 'notificationService', 'authData', 'signalR', function ($rootScope, $state, authService, notificationService, authData, signalR) {
    authService.fillAuthData();
    authData = authService.getAuthData();
    $rootScope.authData = authData;
    if (authData.loggedIn) {
        $rootScope.$broadcast('userAuthenticated');
    }
    $rootScope.currentState = '';

    $rootScope.$on('$stateChangeStart', function (e, toState) {
        $rootScope.currentState = toState;
        $rootScope.unSubscribeAll();
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


