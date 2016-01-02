(function () {
    'use strict';

    function connector($rootScope, authData) {
        function connect(connection, beforeConnected) {
            $.signalR.ajaxDefaults.headers = { Authorization: "Bearer " + authData.token };
            beforeConnected();
            connection.stateChanged(function (state) {
                $rootScope.$broadcast('connectionStateChanged', state);
            });
            connection.start({ waitForPageLoad: true, logging: true }).done(function () {
                $rootScope.isConnected = true;
                $rootScope.$broadcast('realTimeConnected');
            });
        }
        return connect;
    }

    services.factory('hubConnector', connector);
    connector.$inject = ['$rootScope', 'authData'];
})();