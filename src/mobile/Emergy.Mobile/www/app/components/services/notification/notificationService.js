'use strict';
services.factory('notificationService', notificationService);

notificationService.$inject = ['$http', '$q', '$cordovaDialogs', '$ionicLoading', 'serviceBase', 'authData'];

function notificationService($http, $q, $cordovaDialogs, $ionicLoading, serviceBase, authData) {
	var pushNotification = function (notification) {
        var deffered = $q.defer();
        $http.post(serviceBase + 'api/notifications/create', notification)
        .success(function (units) {
            deffered.resolve(units);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };
	
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
		pushNotification: pushNotification,
        displaySuccessPopup: displaySuccessPopup,
        displayErrorPopup: displayErrorPopup,
        displayChoicePopup: displayChoicePopup,
        displayLoading: displayLoading,
        hideLoading: hideLoading
    };

    return service;
}