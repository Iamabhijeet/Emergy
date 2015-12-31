(function () {
    'use strict';
    services.factory('realTimeService', ['$rootScope', 'serviceBase', 'authData',
        function ($rootScope, serviceBase, authData) {
            function realTimeService(serverUrl, hubName, startOptions) {
                $.signalR.ajaxDefaults.headers = { Authorization: "Bearer " + authData.token };

                var connection = $.hubConnection(serviceBase);
                var proxy = connection.createHubProxy(hubName);
                connection.start(startOptions).done(function () { });

                return {
                    on: function (eventName, callback) {
                        proxy.on(eventName, function (result) {
                            console.log(result);
                            $rootScope.$apply(function () {
                                if (callback) {
                                    callback(result);
                                }
                            });
                        });
                    },
                    off: function (eventName, callback) {
                        proxy.off(eventName, function (result) {
                            console.log(result);
                            $rootScope.$apply(function () {
                                if (callback) {
                                    callback(result);
                                }
                            });
                        });
                    },
                    invoke: function (methodName, params, callback) {
                        if (params) {
                            proxy.invoke(methodName, params)
                                .done(function (result) {
                                    console.log(result);
                                    $rootScope.$apply(function () {
                                        if (callback) {
                                            callback(result);
                                        }
                                    });
                                });
                        }
                        proxy.invoke(methodName)
                            .done(function (result) {
                                console.log(result);
                                $rootScope.$apply(function () {
                                    if (callback) {
                                        callback(result);
                                    }
                                });
                            });
                    },
                    connection: connection
                };
            };
            return realTimeService;
        }]);
})();
