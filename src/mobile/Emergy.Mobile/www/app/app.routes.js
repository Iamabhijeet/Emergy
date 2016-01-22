app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');

    $stateProvider.state('tab', {
            url: '/tab',
            abstract: true,
            cache: false,
            templateUrl: function() {
                if (ionic.Platform.isAndroid()) {
                    return "app/views/tabsAndroid/tabsAndroid.html";
                }
                return "app/views/tabsIos/tabsIos.html";
            }
        });

    $stateProvider.state('tab.home', {
        url: '/home',
        cache: false,
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
        cache: false,
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

    $stateProvider.state('tab.assignments', {
        url: '/assignments',
        cache: false,
        views: {
            'tab-home': {
                templateUrl: 'app/views/assignments/assignments.html',
                controller: 'assignmentsController'
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

    $stateProvider.state('tab.directions', {
        url: '/directions/:reportId',
        cache: false,
        views: {
            'tab-home': {
                templateUrl: 'app/views/directions/directions.html',
                controller: 'directionsController'
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

    $stateProvider.state('tab.messaging', {
        url: '/messaging',
        cache: false,
        views: {
            'tab-messaging': {
                templateUrl: 'app/views/messaging/messaging.html',
                controller: 'messagingController'
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

    $stateProvider.state('tab.messages', {
        url: '/messaging/:senderId',
        cache: false,
        views: {
            'tab-messaging': {
                templateUrl: 'app/views/messages/messages.html',
                controller: 'messagesController'
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
    
    $stateProvider.state('login', {
        url: '/login',
        cache: false,
        templateUrl: 'app/views/login/login.html',
        controller: 'loginController'
    });
});

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

app.run(['$rootScope', '$state', 'authService', 'authData', function ($rootScope, $state, authService, authData) {
    authService.fillAuthData();
    $rootScope.authData = authService.getAuthData();
    authService.logout();
    $rootScope.currentState = '';

    $rootScope.$on('$stateChangeStart', function (e, toState) {
        $rootScope.currentState = toState;
        if (toState === 'login') {
            if (authData.token && authData.loggedIn) {
                $rootScope.$broadcast('userAuthenticated');
            }
        }
        $rootScope.unSubscribeAll();
    });

    $rootScope.$on('$stateChangeError', function (e, toState, toParams, fromState, fromParams, error) {
        if (error === "Not Authorized") {
            $state.go("Login");
        }
    });
}]);