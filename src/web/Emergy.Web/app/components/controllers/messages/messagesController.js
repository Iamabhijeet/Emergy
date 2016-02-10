'use strict';

var controllerId = 'messagesController';

app.controller(controllerId,
    ['vm', '$state', '$stateParams', '$rootScope', '$location', 'authService', 'notificationService', 'messageService', 'reportsService', 'signalR', 'ngDialog', 'hub', messagesController]);

function messagesController($scope, $state, $stateParams, $rootScope, $location, authService, notificationService, messageService, reportsService, signalR, ngDialog, hub) {
    $rootScope.title = 'Messages | Emergy';
    $scope.messages = [];
    $scope.notificationAvailable = false;
    $scope.message = "";
    $scope.targetId = $stateParams.targetId;

    $rootScope.$on(signalR.events.client.pushNotification, function (event, response) {
        $scope.notificationAvailable = true;
        var promise = notificationService.getNotification(response);
        promise.then(function (notification) {
            if (notification.Type === "ReportCreated") {
                var promise = reportsService.getReport(notification.ParameterId);
                promise.then(function (report) {
                    $scope.arrivedReport = {};
                    $scope.arrivedReport = report;
                    $scope.reportMarker = {
                        latitude: report.Location.Latitude,
                        longitude: report.Location.Longitude
                    }
                    $scope.map = {
                        control: {},
                        options: { draggable: false, scrollwheel: false },
                        center: { latitude: report.Location.Latitude, longitude: report.Location.Longitude },
                        zoom: 12,
                        styles: [{ 'featureType': 'landscape.natural', 'elementType': 'geometry.fill', 'stylers': [{ 'visibility': 'on' }, { 'color': '#e0efef' }] }, { 'featureType': 'poi', 'elementType': 'geometry.fill', 'stylers': [{ 'visibility': 'off' }, { 'hue': '#1900ff' }, { 'color': '#c0e8e8' }] }, { 'featureType': 'road', 'elementType': 'geometry', 'stylers': [{ 'lightness': 100 }, { 'visibility': 'simplified' }] }, { 'featureType': 'road', 'elementType': 'labels', 'stylers': [{ 'visibility': 'on' }] }, { 'featureType': 'transit.line', 'elementType': 'geometry', 'stylers': [{ 'visibility': 'on' }, { 'lightness': 700 }] }, { 'featureType': 'water', 'elementType': 'all', 'stylers': [{ 'color': '#00ACC1' }] }]
                    };
                    ngDialog.close();
                    document.getElementById("notificationSound").play();
                    ngDialog.open({
                        template: "reportCreatedModal",
                        disableAnimation: true,
                        scope: $scope
                    });
                }, function (error) {
                    notificationService.pushError("Error has happened while loading notification.");
                });
            }
            else if (notification.Type === "MessageArrived") {
                document.getElementById("notificationSound").play();
                loadMessages();
            }
            else if (notification.Type === "MessageArrived" && notification.SenderId !== $stateParams.targetId) {
                document.getElementById("notificationSound").play();
                notificationService.pushSuccess('<p><span>' + String(notification.Sender.UserName) + '</span> has sent you a message!</p> <a href="/messages/' + String(notification.SenderId) + '">View</a>');
            }
            else if (notification.Type === "ReportUpdated" && notification.Content.length > 11) {
                document.getElementById("notificationSound").play();
                notificationService.pushSuccess('<p><span>' + String(notification.Sender.UserName) + '</span> has updated current location!</p> <a href="/report/' + String(notification.ParameterId) + '">View</a>');
            }
            else if (notification.Type === "ReportUpdated" && notification.Content.length < 11) {
                document.getElementById("notificationSound").play();
                notificationService.pushSuccess('<p><span>' + String(notification.Sender.UserName) + '</span> has changed a report status to ' + String(notification.Content) + '!</p> <a href="/report/' + String(notification.ParameterId) + '">View</a>');
            }
        });
    });

    var loadMessages = function () {
        console.log($stateParams.targetId);
        var promise = messageService.getMessages($stateParams.targetId);
        promise.then(function (messages) {
            $scope.messages = messages;
        }, function(error) {
            notificationService.pushError("Error has happened while loading messages.");
        });
    };

    $scope.sendMessage = function (message) {
        var promise = messageService.createMessage(message, $stateParams.targetId);
        promise.then(function (messageId) {
            var notification = {
                Content: "has sent a message",
                TargetId: $stateParams.targetId,
                Type: "MessageArrived",
                ParameterId: messageId
            }
            var promise = notificationService.createNotification(notification);
            promise.then(function(notificationId) {
                loadMessages();
                try {
                    hub.server.sendNotification(notificationId); 
                } catch (err) {
                    notificationService.pushError("Error has happened while pushing a notification.");
                }
            }, function() {
                notificationService.pushError("Error has happened while creating a notification.");
            });
            loadMessages();
        }, function (error) {
            notificationService.pushError("Error has happened while sending message.");
        }).finally(function() {
            delete $scope.message;
        });
    };

    loadMessages();
}