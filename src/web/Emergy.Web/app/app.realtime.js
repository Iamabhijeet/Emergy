app.run(['$rootScope', 'hub', function ($rootScope, hub) {
    $rootScope.$on('userAuthenticated', function () {
        hub.client.createConnection();
        hub.client.configureListeners();
        hub.connectionManager.startConnection();
    });
}]);
