'use strict';

var controllerId = 'messagesController';

app.controller(controllerId,
    ['$scope', '$stateParams', '$timeout', '$ionicScrollDelegate', '$rootScope', 'authService', 'notificationService', 'messagesService', messagesController]);

function messagesController($scope, $stateParams, $timeout, $ionicScrollDelegate, $rootScope, authService, notificationService, messagesService) {
    var isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
    $scope.message = "";
    $scope.messages = [];

    $scope.senderId = $stateParams.senderId;
    console.log($scope.senderId);

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

    $scope.sendMessage = function(message) {
        var promise = messagesService.createMessage(message, $scope.senderId);
        promise.then(function(messageId) {
            loadMessages();
        }, function(error) {
            notificationService.displayErrorPopup("There has been an error sending a message.", "Ok");
        }).finally(function() {
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