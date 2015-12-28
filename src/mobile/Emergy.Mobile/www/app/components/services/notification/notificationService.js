'use strict';
services.factory('notificationService', notificationService);

notificationService.$inject = ['$http', '$q', '$cordovaDialogs', '$ionicLoading', 'serviceBase', 'authData'];

function notificationService($http, $q, $cordovaDialogs, $ionicLoading, serviceBase, authData) {

    var displaySuccessPopup = function(message, buttonText) {
        $cordovaDialogs.alert(message, "Success", buttonText)
            .then(function() {

            });
    };

    var displayErrorPopup = function (message, buttonText) {
        $cordovaDialogs.alert(message, "Error", buttonText)
            .then(function () {

            });
    };

    var displayChoicePopup = function (message, firstButtonText, secondButtonText, thirdButtonText, primaryFunction, secondaryFunction ) {
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

    var displayLoading = function(message) {
        $ionicLoading.show({
            template: message
        });
    };
    
    var hideLoading = function () {
        $ionicLoading.hide();
    };

    var service = {
        displaySuccessPopup: displaySuccessPopup,
        displayErrorPopup: displayErrorPopup,
        displayChoicePopup: displayChoicePopup,
        displayLoading: displayLoading,
        hideLoading: hideLoading
    };

    return service;
}