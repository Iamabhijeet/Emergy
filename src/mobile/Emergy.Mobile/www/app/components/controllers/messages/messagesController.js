'use strict';

var controllerId = 'messagesController';

app.controller(controllerId,
    ['$scope', '$stateParams', '$timeout', '$ionicScrollDelegate', '$rootScope', 'authService', 'notificationService', 'messagesService', 'hub', 'signalR', messagesController]);

function messagesController($scope, $stateParams, $timeout, $ionicScrollDelegate, $rootScope, authService, notificationService, messagesService, hub, signalR) {
    var isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
    $scope.message = "";
    $scope.messages = [];
    $scope.senderId = $stateParams.senderId;

    $rootScope.$on(signalR.events.client.pushNotification, function (event, response) {
        $scope.notificationAvailable = true;
        var promise = notificationService.getNotification(response);
        promise.then(function (notification) {
            if (notification.Type === "MessageArrived") {
                loadMessages();
            }
            else if (notification.Type === "ReportUpdated") {
                notificationService.displaySuccessPopup("One of the reports that you submitted had it's status updated!", "Ok");
            }
        });
    });

    var loadMessages = function () {
        var promise = messagesService.getMessages($scope.senderId);
        promise.then(function (messages) {
            $scope.messages = messages;
        }, function (error) {
            notificationService.displayErrorPopup("Error has happened while loading messages.", "Ok");
        }).finally(function () {
            $ionicScrollDelegate.scrollBottom(true);
        });
    };

    $scope.sendMessage = function (message) {
        notificationService.displayLoading("Sending message...");
        var promise = messagesService.createMessage(message, $scope.senderId);
        promise.then(function (messageId) {
            var notification = {
                Content: "has sent a message",
                TargetId: $scope.senderId,
                Type: "MessageArrived",
                ParameterId: messageId
            }

            console.log(notification);
            var promise = notificationService.pushNotification(notification);
            promise.then(function (notificationId) {
                loadMessages();
                try {
                    hub.server.sendNotification(notificationId);
                }
                catch (err) {
                    notificationService.displayErrorPopup("There has been an error pushing a notification!", "Ok");
                }
            }, function() {
                notificationService.displayErrorPopup("There has been an error creating a notification!", "Ok");
            });
        }, function(error) {
            notificationService.displayErrorPopup("There has been an error sending a message.", "Ok");
        }).finally(function () {
            notificationService.hideLoading();
            delete $scope.message;
        });
    };

    $scope.inputUp = function () {
        if (isIOS) $scope.data.keyboardHeight = 216;
        $timeout(function () {
            $ionicScrollDelegate.scrollBottom(true);
        }, 200);

    };

    $scope.inputDown = function () {
        if (isIOS) $scope.data.keyboardHeight = 0;
        $ionicScrollDelegate.resize();
        $ionicScrollDelegate.scrollBottom(true);
    };

    $scope.closeKeyboard = function () {
        cordova.plugins.Keyboard.close();
    };

    loadMessages();
}