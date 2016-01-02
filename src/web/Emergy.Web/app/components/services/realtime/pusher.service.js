(function () {
    'use strict';

    function pusher($rootScope) {
        var sendNotification = function (notificationId) {
            if ($rootScope.isConnected) {
                $rootScope.hub.invoke('sendNotification', notificationId).done(function (notificationId) {
                    console.log('sent notification ' + notificationId);
                });
            } else {
                console.log('real time not connected but invoked');
            }

        };
        var sendMessage = function (messageId) {
            if ($rootScope.isConnected) {
                $rootScope.hub.invoke('sendMessage', messageId).done(function (messageId) {
                    console.log('sent message ' + messageId);
                });
            } else {
                console.log('real time not connected but invoked');
            }
        };
        var changedReportStatus = function (reportId) {
            if ($rootScope.isConnected) {
                $rootScope.hub.invoke('changedReportStatus', reportId).done(function (reportId) {
                    console.log('changed report status ' + reportId);
                });
            } else {
                console.log('real time not connected but invoked');
            }
        };
        var updateUserLocation = function (locationId, reportId) {
            if ($rootScope.isConnected) {
                $rootScope.hub.invoke('updateUserLocation', [locationId, reportId]).done(function (userId) {
                    console.log('updated user location ' + userId);
                });
            } else {
                console.log('real time not connected but invoked');
            }
        };

        var testPush = function (greeting) {
            if ($rootScope.isConnected) {
                $rootScope.hub.invoke('testPush', greeting).done(function () {
                    console.log('pushed ' + greeting);
                });
            } else {
                console.log('real time not connected but invoked');
            }
        };
        var service = {
            testPush: testPush,
            sendNotification: sendNotification,
            sendMessage: sendMessage,
            changedReportStatus: changedReportStatus,
            updateUserLocation: updateUserLocation
        };

        return service;
    }

    services.factory('pusher', pusher);

    pusher.$inject = ['$rootScope'];
})();