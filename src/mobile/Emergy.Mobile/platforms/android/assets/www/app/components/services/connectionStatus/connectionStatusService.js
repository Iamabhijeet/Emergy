'use strict';
services.factory('connectionStatusService', connectionStatusService);

connectionStatusService.$inject = ['$http', '$q', 'serviceBase', 'signalR', 'hub', 'notificationService', 'authService', '$ionicActionSheet'];

function connectionStatusService($http, $q, serviceBase, signalR, hub, notificationService, authService, $ionicActionSheet) {
    var displayConnectionStatusMenu = function (connectionStatus) {
        $ionicActionSheet.show({
            buttons: [
              { text: 'Reconnect' },
              { text: 'Log Out'   }
            ],
            titleText: 'Realtime is currently <b>' + connectionStatus + '</b>.',
            cancelText: 'Cancel',
            cancel: function () {
                return true;
            },
            buttonClicked: function (index) {
                if (index === 0) {
                    if (signalR.isConnected) {
                        notificationService.displayErrorPopup("Realtime connection is already active.", "Ok");
                    } else if (signalR.isConnecting) {
                        notificationService.displayErrorPopup("Realtime is already connecting.", "Ok");
                    } else {
                        hub.connectionManager.startConnection();
                    }
                }
                if (index === 1) {
                    authService.logout();
                }

            }
        });
    };

    var service = {
        displayConnectionStatusMenu: displayConnectionStatusMenu
    };

    return service;
}