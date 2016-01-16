'use strict';
services.factory('connectionStatusService', connectionStatusService);

connectionStatusService.$inject = ['$http', '$q', 'serviceBase', 'signalR', 'hub', 'notificationService', '$ionicActionSheet'];

function connectionStatusService($http, $q, serviceBase, signalR, hub, notificationService, $ionicActionSheet) {
    var displayConnectionStatusMenu = function (connectionStatus) {
         $ionicActionSheet.show({
            buttons: [
              { text: 'Reconnect' }
            ],
            titleText: 'Realtime is currently <b>' + connectionStatus + '</b>',
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
                    
            }
        });
    };

    var service = {
        displayConnectionStatusMenu: displayConnectionStatusMenu
    };

    return service;
}