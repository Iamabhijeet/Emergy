'use strict';
services.factory('notificationService', notificationService);

notificationService.$inject = ['$http', '$q', '$ionicPopup', '$ionicLoading', 'serviceBase', 'authData'];

function notificationService($http, $q, $ionicPopup, $ionicLoading, serviceBase, authData) {

    var displayInformationalPopup = function(message, buttonText) {
       $ionicPopup.show({
            subTitle: message,
            type: 'button-positive',
            buttons: [
                {
                    text: buttonText
                }
            ]
        });
    };

    var displayMultipleChoicePopup = function (message, firstButtonText, secondButtonText, thirdButtonText, primaryFunction, secondaryFunction ) {
        $ionicPopup.show({
            subTitle: message,
            buttons: [
             {
                 text: firstButtonText
             },
             {
                 text: secondButtonText,
                 onTap: function (e) {
                    secondaryFunction();
                 }
             },
             {
                 text: thirdButtonText,
                 type: 'button-positive',
                 onTap: function (e) {
                     primaryFunction();
                 }
             }
            ]
        });
    };

    var displayLoading = function(message) {
        $ionicLoading.show({
            template: message
        });
    };
    
    var hideLoading = function () {
        $ionicLoading.hide();
    };

    var service = {
        displayInformationalPopup: displayInformationalPopup,
        displayMultipleChoicePopup: displayMultipleChoicePopup,
        displayLoading: displayLoading,
        hideLoading: hideLoading
    };

    return service;
}