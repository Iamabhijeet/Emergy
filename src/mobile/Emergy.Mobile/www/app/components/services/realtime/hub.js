(function () {
    'use strict';

    services.factory('hub', hub);
    hub.$inject = ['$rootScope', '$q', 'signalR', 'authData'];

    function hub($rootScope, $q, signalR, authData) {
        var createConnection = function () {
            if (!signalR.isConnected) {
                $.signalR.ajaxDefaults.headers = { Authorization: "Bearer " + authData.token };
                signalR.connection = $.hubConnection(signalR.endpoint);
                signalR.hub = signalR.connection.createHubProxy('emergyHub');
            }
        };
        var startConnection = function (callback) {
            signalR.isConnecting = true;
            $q.when(signalR.connection.start(), function() {
                signalR.isConnected = true;
                signalR.isConnecting = false;
                signalR.connectionState = 'connected';
                $rootScope.$broadcast(signalR.events.realTimeConnected);
                $rootScope.$applyAsync(function () {
                    callback && callback();
                });
            });
        };
        var stopConnection = function () {
            if (signalR.connection) {
                signalR.connection.stop();
                signalR.isConnected = false;
                signalR.connection = null;
                signalR.hub = null;
                $rootScope.unSubscribeAll();
            }
        };

        var configureListeners = function () {
            signalR.connection.stateChanged(function (state) {
                $rootScope.$broadcast(signalR.events.connectionStateChanged, state);
            });
            $rootScope.$on(signalR.events.connectionStateChanged, function (event, state) {
                var stateConversion = { 0: 'connecting', 1: 'connected', 2: 'reconnecting', 4: 'disconnected' };
                signalR.connectionState = stateConversion[state.newState];
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
                    if (signalR.isConnected) {
                        signalR.hub.invoke(signalR.events.server.sendNotification, notificationId)
                        .done(function () {
                            console.log('sent notification ' + notificationId);
                        });
                    }
                    else {
                        console.log('real time not connected but tried to invoke!');
                    }
                },
                updateUserLocation: function (locationId, reportId) {
                    if (signalR.isConnected) {
                        signalR.hub.invoke(signalR.events.server.updateUserLocation, [locationId, reportId])
                        .done(function () {
                            console.log('updatedLocation ' + locationId);
                        });
                    }
                    else {
                        console.log('real time not connected but tried to invoke!');
                    }
                },
                testPush: function (greeting) {
                    if (signalR.isConnected) {
                        signalR.hub.invoke(signalR.events.server.testPush, greeting)
                       .done(function () {
                           console.log('pushed ' + greeting);
                       });
                    }
                }
            }

        };

    }
})();