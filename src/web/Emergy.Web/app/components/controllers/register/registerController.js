'use strict';

var controllerId = 'registerController';

app.controller(controllerId,
    ['$scope', '$state', '$rootScope', '$location', 'authService', 'notificationService', registerCtrl]);

function registerCtrl($scope, $state, $rootScope, $location, authService, notificationService) {
    $rootScope.title = 'Register | Emergy';
    $rootScope.background = 'background-image';
    $scope.isBusy = false;
    $scope.captchaIsValid = false;

    $scope.newUser = {
        Email: '',
        Username: '',
        Password: '',
        ConfirmPassword: '',
        BirthDate: '1/1/0001 12:00:00 AM',
        ReCaptchaResponse: ''
    };

    $scope.submitForm = function (newUser) {
        $scope.isBusy = true;
        var promise = authService.register(newUser);
        promise.then(function () {
            $state.go("RegisterSuccess");
        }, function (response) {
            notificationService.pushError(response.Message);
        }).finally(function () {
            $scope.isBusy = false;
        });
    };

    $scope.setResponse = function(response) {
        $scope.newUser.ReCaptchaResponse = response;
        $scope.captchaIsValid = true; 
    };
}