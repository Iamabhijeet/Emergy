(function () {
    'use strict';

    function connector($rootScope, authData) {
        function connect(connection, beforeConnected, afterConnected) {
            $.signalR.ajaxDefaults.headers = { Authorization: "Bearer " + authData.token };
            beforeConnected();
            connection.stateChanged(function (state) {
                $rootScope.$broadcast('connectionStateChanged', state);
            });
            connection.start()
                .done(function () {
                    $rootScope.isConnected = true;
                    $rootScope.$broadcast('realTimeConnected');
                    if (afterConnected) {
                        afterConnected();
                    }
                });
        }
        return connect;
    }

    services.factory('hubConnector', connector);
    connector.$inject = ['$rootScope', 'authData'];
})();