(function () {
    'use strict';

    function emergyHub($rootScope, realTimeService) {
        var hub = realTimeService(realTimeService.defaultServer, 'emergyHub', { logging: true });

        var pushReport = function (unitId, reportId) {
            hub.invoke('pushReport', [unitId, reportId], function () {
                console.log('reported ' + reportId);
            });
        };
        var sendNotification = function (notificationId) {
            hub.invoke('sendNotification', notificationId, function () {
                console.log('sent notification ' + notificationId);
            });
        };

        var sendMessage = function (messageId) {
            hub.invoke('sendMessage', messageId, function () {
                console.log('sent message ' + messageId);
            });
        };
        var changedReportStatus = function (reportId) {
            hub.invoke('changedReportStatus', reportId, function () {
                console.log('changed report status ' + reportId);
            });
        };
        var updateUserLocation = function (locationId, userId, reportId) {
            hub.invoke('updateUserLocation', [locationId, userId, reportId], function () {
                console.log('updated user location ' + userId);
            });
        };

        var handleReportCreated = function (eventHandler) {
            hub.on('notifyReportCreated', function (reportId) {
                eventHandler(reportId);
            });
        };
        var handleReportStatusChanged = function (eventHandler) {
            hub.on('notifyReportStatusChanged', function (reportId) {
                eventHandler(reportId);
            });
        };
        var handleUserLocationUpdated = function (eventHandler) {
            hub.on('updateUserLocation', function (locationId) {
                eventHandler(locationId);
            });
        };
        var handleMessageReceieved = function (eventHandler) {
            hub.on('pushMessage', function (messageId) {
                eventHandler(messageId);
            });
        };
        var handleNotificationReceieved = function (eventHandler) {
            hub.on('pushNotification', function (notificationId) {
                eventHandler(notificationId);
            });
        };

        var service = {
            pushReport: pushReport,
            sendNotification: sendNotification,
            sendMessage: sendMessage,
            changedReportStatus: changedReportStatus,
            updateUserLocation: updateUserLocation,

            handleReportCreated: handleReportCreated,
            handleReportStatusChanged: handleReportStatusChanged,
            handleUserLocationUpdated: handleUserLocationUpdated,
            handleMessageReceieved: handleMessageReceieved,
            handleNotificationReceieved: handleNotificationReceieved

        };
        return service;
    }

    services.factory('emergyHub', emergyHub);

    emergyHub.$inject = ['$rootScope', 'realTimeService'];
})();