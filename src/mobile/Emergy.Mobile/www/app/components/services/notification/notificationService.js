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

    var getNotification = function (notificationId) {
        var deffered = $q.defer();
        $http.post(serviceBase + 'api/notifications/get/' + notificationId)
        .success(function (response) {
            deffered.resolve(response);
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
        $cordovaDialogs.alert(message, "Notification", buttonText);
    };

    var displaySuccessWithActionPopup = function(message, buttonText, action) {
        $cordovaDialogs.confirm(message, "Notification", [buttonText, 'Dismiss']).then(function(buttonIndex) {
            if (buttonIndex === 1) {
                action();
            }
        });
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
                template: '<ion-spinner class="spinner-calm" icon="ripple"></ion-spinner> <br/>' + message
            });
        } else {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-calm" icon="ripple"></ion-spinner> <br/>' + message
            });
        }

    };

    var hideLoading = function () {
        $ionicLoading.hide();
    };

    var service = {
        pushNotification: pushNotification,
        getNotification: getNotification, 
        displayMessage: displayMessage,
        displaySuccessPopup: displaySuccessPopup,
        displaySuccessWithActionPopup: displaySuccessWithActionPopup, 
        displayErrorPopup: displayErrorPopup,
        displayChoicePopup: displayChoicePopup,
        displayLoading: displayLoading,
        hideLoading: hideLoading
    };

    return service;
}