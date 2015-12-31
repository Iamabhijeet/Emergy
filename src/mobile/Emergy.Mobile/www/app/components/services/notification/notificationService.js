'use strict';
services.factory('notificationService', notificationService);

notificationService.$inject = ['$http', '$q', '$cordovaDialogs', '$ionicLoading', 'serviceBase', 'authData'];

function notificationService($http, $q, $cordovaDialogs, $ionicLoading, serviceBase, authData) {
    var pushNotification = function (notification) {
        var deffered = $q.defer();
        $http.post(serviceBase + 'api/notifications/create', notification)
        .success(function (notification) {
            deffered.resolve(notification);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var displayMessage = function (title, content) {
        $cordovaDialogs.alert(content, title);
    };

    var displaySuccessPopup = function (message, buttonText) {
        $cordovaDialogs.alert(message, "Success", buttonText);
    };

    var displayErrorPopup = function (message, buttonText) {
        $cordovaDialogs.alert(message, "Error", buttonText);
    };

    var displayChoicePopup = function (message, firstButtonText, secondButtonText, thirdButtonText, primaryFunction, secondaryFunction) {
        $cordovaDialogs.confirm(message, 'Additional information', [firstButtonText, secondButtonText, thirdButtonText])
            .then(function (buttonIndex) {
                if (buttonIndex === 1) {
                    secondaryFunction();
                }
                else if (buttonIndex === 3) {
                    primaryFunction();
                }
            });
    };

    var displayLoading = function (message) {
        if (ionic.Platform.isAndroid()) {
            $ionicLoading.show({
                template: '<ion-spinner icon="android"></ion-spinner> <br/>' + message
            });
        } else {
            $ionicLoading.show({
                template: '<ion-spinner icon="ios"></ion-spinner> <br/>' + message
            });
        }

    };

    var hideLoading = function () {
        $ionicLoading.hide();
    };

    var service = {
        pushNotification: pushNotification,
        displayMessage: displayMessage,
        displaySuccessPopup: displaySuccessPopup,
        displayErrorPopup: displayErrorPopup,
        displayChoicePopup: displayChoicePopup,
        displayLoading: displayLoading,
        hideLoading: hideLoading
    };

    return service;
}