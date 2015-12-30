(function () {
    'use strict';

    function emergyHub($rootScope, realTimeService, notificationService) {
        var hub = null;
        var ensureConnected = function () {
            if (!hub) {
                hub = realTimeService(realTimeService.defaultServer, 'emergyHub');
            }
            return true;
        };

        var pushReport = function (unitId, reportId) {
            if (ensureConnected()) {
                realTimeService.invoke('pushReport', [unitId, reportId], function () {
                    console.log('reported ' + reportId);
                });
            }
            else {
                notificationService.displayErrorPopup('The realtime is not working!', 'OK');
            }
        };
        var sendNotification = function (notificationId) {
            if (ensureConnected()) {
                realTimeService.invoke('sendNotification', notificationId, function () {
                    console.log('sent notification ' + notificationId);
                });
            }
            else {
                notificationService.displayErrorPopup('The realtime is not working!', 'OK');
            }
        };
        var sendMessage = function (messageId) {
            if (ensureConnected()) {
                realTimeService.invoke('sendMessage', messageId, function () {
                    console.log('sent message ' + messageId);
                });
            }
            else {
                notificationService.displayErrorPopup('The realtime is not working!', 'OK');
            }
        };
        var changedReportStatus = function (reportId) {
            if (ensureConnected()) {
                realTimeService.invoke('changedReportStatus', reportId, function () {
                    console.log('changed report status' + reportId);
                });
            }
            else {
                notificationService.displayErrorPopup('The realtime is not working!', 'OK');
            }
        };
        var updateUserLocation = function (locationId, userId, reportId) {
            if (ensureConnected()) {
                realTimeService.invoke('updateUserLocation', [locationId, userId, reportId], function () {
                    console.log('updated user location' + userId);
                });
            }
            else {
                notificationService.displayErrorPopup('The realtime is not working!', 'OK');
            }
        };

        var handleReportCreated = function (eventHandler) {
            realTimeService.on('notifyReportCreated', function (reportId) {
                eventHandler(reportId);
            });
        };
        var handleReportStatusChanged = function (eventHandler) {
            realTimeService.on('notifyReportStatusChanged', function (reportId) {
                eventHandler(reportId);
            });
        };
        var handleUserLocationUpdated = function (eventHandler) {
            realTimeService.on('updateUserLocation', function (locationId) {
                eventHandler(locationId);
            });
        };
        var handleMessageReceieved = function (eventHandler) {
            realTimeService.on('pushMessage', function (messageId) {
                eventHandler(messageId);
            });
        };
        var handleNotificationReceieved = function (eventHandler) {
            realTimeService.on('pushNotification', function (notificationId) {
                eventHandler(notificationId);
            });
        };

        var service = {
            ensureConnected: ensureConnected,
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

    emergyHub.$inject = ['$rootScope', 'realTimeService', 'notificationService'];
})();