'use strict';
services.factory('notificationService', notificationService);

notificationService.$inject = ['$http', '$q', '$state', '$cordovaDialogs', '$cordovaVibration', '$cordovaLocalNotification', '$ionicLoading', 'serviceBase', 'authData'];

function notificationService($http, $q, $state, $cordovaDialogs, $cordovaVibration, $cordovaLocalNotification, $ionicLoading, serviceBase, authData) {
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

    /*var notificationId = 1;
    var displayLocalNotification = function (message) {
        $cordovaLocalNotification.hasPermission(function (granted) {
            $cordovaLocalNotification.cancelAll();
            if (!granted) {
                $cordovaLocalNotification.promptForPermission();
            };
            if (granted) {
                $cordovaLocalNotification.on('click', function() {
                    $state.go('tab.home');
                }, this);
                $cordovaLocalNotification.add({
                    id: notificationId,
                    title: "Emergy - Notification",
                    message: message,
                    icon: "http://emergy.xyz/assets/img/menu-heading.png"
                });
                notificationId++;
            }
        });
    };*/

    var displayMessage = function (title, content) {
        $cordovaVibration.vibrate(250);
        $cordovaDialogs.alert(content, title);
    };

    var displaySuccessPopup = function (message, buttonText) {
        $cordovaVibration.vibrate(250);
        $cordovaDialogs.alert(message, "Notification", buttonText);
        //displayLocalNotification(message);
    };

    var displaySuccessWithActionPopup = function (message, buttonText, action) {
        $cordovaVibration.vibrate(250);
        $cordovaDialogs.confirm(message, "Notification", [buttonText, 'DISMISS']).then(function(buttonIndex) {
            if (buttonIndex === 1) {
                action();
            }
        });
        //displayLocalNotification(message);
    };

    var displayErrorPopup = function (message, buttonText) {
        $cordovaDialogs.alert(message, "ERROR", buttonText);
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