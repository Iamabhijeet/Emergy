(function () {
    'use strict';

    services.factory('hub', hub);
    hub.$inject = ['$rootScope', '$q', 'signalR', 'authData'];

    function hub($rootScope, $q, signalR, authData) {
        var createConnection = function () {
            if (!signalR.isConnected) {
                $.signalR.ajaxDefaults.headers = { Authorization: "Bearer " + authData.token };
                $.ajaxSetup({
                    headers: { Authorization: "Bearer " + authData.token }
                });
                signalR.connection = $.hubConnection(signalR.endpoint);
                signalR.hub = signalR.connection.createHubProxy('emergyHub');
            }
        };
        var startConnection = function (callback) {
            signalR.isConnecting = true;
            $q.when(signalR.connection.start()).then(function () {
                signalR.isConnected = true;
                signalR.isConnecting = false;
                signalR.connectionState = 'connected';
                //cordova.plugins.backgroundMode.enable();
                $rootScope.$broadcast(signalR.events.realTimeConnected);
                $rootScope.$applyAsync(function () {
                    callback && callback();
                });
            });
        };
        var stopConnection = function () {
            signalR.connection.stop();
            signalR.isConnected = false;
            signalR.connection = null;
            signalR.hub = null;
            $rootScope.unSubscribeAll();
            //cordova.plugins.backgroundMode.disable();
        };

        var configureListeners = function () {
            signalR.connection.stateChanged(function (state) {
                $rootScope.$broadcast(signalR.events.connectionStateChanged, state);
            });
            signalR.connection.disconnected(function () {
                if (authData.loggedIn) {
                    startConnection();
                }
            });
            $rootScope.$on(signalR.events.connectionStateChanged, function (event, state) {
                var stateConversion = { 0: 'connecting', 1: 'connected', 2: 'reconnecting', 4: 'disconnected' };
                signalR.connectionState = stateConversion[state.newState];
                if (state.newState === 4) {
                    signalR.isConnected = false;
                    signalR.connection = null;
                }
            });
            $rootScope.$on('logout', function () {
                stopConnection();
                $rootScope.unSubscribeAll();
            });
            signalR.hub.on(signalR.events.client.testSuccess, function (message) {
                $rootScope.$broadcast(signalR.events.client.testSuccess, message);
            });
            signalR.hub.on(signalR.events.client.pushNotification, function (notificationId) {
                $rootScope.$broadcast(signalR.events.client.pushNotification, notificationId);
            });
            signalR.hub.on(signalR.events.client.updateUserLocation, function (locationId) {
                $rootScope.$broadcast(signalR.events.client.updateUserLocation, locationId);
            });
            signalR.hub.on(signalR.events.client.ping, function (connectionId) {
                $rootScope.$broadcast(signalR.events.client.ping, connectionId);
            });
        };
        return {
            connectionManager: {
                startConnection: startConnection,
                stopConnection: stopConnection
            },
            client: {
                createConnection: createConnection,
                configureListeners: configureListeners
            },
            server: {
                sendNotification: function (notificationId) {
                    $q.when(signalR.hub.invoke(signalR.events.server.sendNotification, notificationId))
                          .then(function () {
                              console.log('sent notification ' + notificationId);
                          });
                },
                updateUserLocation: function (locationId, reportId) {
                    $q.when(signalR.hub.invoke(signalR.events.server.updateUserLocation, [locationId, reportId]))
                         .then(function () {
                             console.log('updatedLocation ' + locationId);
                         });
                },
                testPush: function (greeting) {
                    $q.when(signalR.hub.invoke(signalR.events.server.testPush, greeting))
                        .then(function () {
                            console.log('pushed ' + greeting);
                        });
                }
            }

        };
    }
})();