(function () {
    'use strict';

    function realTimeService($rootScope, serviceBase, authData) {
        function configuredService(serverUrl, hubName, startOptions) {

            $.signalR.ajaxDefaults.headers = { Authorization: "Bearer " + authData.token };
            var connection = $.hubConnection(serviceBase);
            var proxy = connection.createHubProxy(hubName);
            connection.start(startOptions).done(function () { });
            return {
                on: function (eventName, callback) {
                    proxy.on(eventName, function (result) {
                        $rootScope.$apply(function () {
                            if (callback) {
                                callback(result);
                            }
                        });
                    });
                },
                off: function (eventName, callback) {
                    proxy.off(eventName, function (result) {
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
                                $rootScope.$apply(function () {
                                    if (callback) {
                                        callback(result);
                                    }
                                });
                            });
                    }
                    else {
                        proxy.invoke(methodName)
                              .done(function (result) {
                                  $rootScope.$apply(function () {
                                      if (callback) {
                                          callback(result);
                                      }
                                  });
                              });
                    }

                },
                connection: connection
            };
        };

        return configuredService;
    };

    services.factory('realTimeService', realTimeService);

    realTimeService.$inject = ['$rootScope', 'serviceBase', 'authData'];
})();