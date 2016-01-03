app.run(['$rootScope', 'serviceBase', 'hubConnector', function ($rootScope, serviceBase, hubConnector) {

    $rootScope.$on('userAuthenticated', function () {
        var connection = $.hubConnection(serviceBase);
        var proxy = connection.createHubProxy('emergyHub');
        $rootScope.hub = proxy;
        $rootScope.$on('connectionStateChanged', function (event, state) {
            var stateConversion = { 0: 'connecting', 1: 'connected', 2: 'reconnecting', 4: 'disconnected' };
            //console.log('state changed from: ' + stateConversion[state.oldState]
            // + ' to: ' + stateConversion[state.newState]);
            $rootScope.connectionState = stateConversion[state.newState];
        });
        $rootScope.$on('logout', function () {
            connection.stop();
        });

        hubConnector(connection, function () {
            proxy.on('testSuccess', function (message) {
                $rootScope.$broadcast('testSuccess', message);
            });
            proxy.on('pushNotification', function (notificationId) {
                $rootScope.$broadcast('pushNotification', notificationId);
            });
            proxy.on('updateUserLocation', function (locationId) {
                $rootScope.$broadcast('updateUserLocation', locationId);
            });
        });
    });
}]);
