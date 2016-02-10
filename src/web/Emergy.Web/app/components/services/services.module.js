var services = angular.module('emergyWeb.services', ['LocalStorageModule', 'ui.router', 'ngFileUpload', 'ngImgCrop']);
services.value('authData', {
    userId: '',
    userName: '',
    password: '',
    token: '',
    loggedIn: false,
    roles: [],
    isAdmin: function () {
        return this.roles.indexOf('Administrators') > -1;
    },
    isClient: function () {
        return this.roles.indexOf('Clients') > -1;
    }
});
services.constant('serviceBase', 'http://api.emergy.xyz/');
services.constant('signalR', {
    endpoint: 'http://api.emergy.xyz/',
    hub: {},
    connection: {},
    isConnected: false,
    isConnecting: false,
    connectionState: '',
    events: {
        realTimeConnected: 'realTimeConnected',
        connectionStateChanged: 'connectionStateChanged',
        server: {
            testPush: 'testPush',
            sendNotification: 'sendNotification',
            updateUserLocation: 'updateUserLocation'
        },
        client: {
            testSuccess: 'testSuccess',
            pushNotification: 'pushNotification',
            updateUserLocation: 'updateUserLocation',
            ping: 'ping'
        }
    }
});