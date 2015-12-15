'use strict';

var controllerId = 'registerController';

app.controller(controllerId,
    ['$scope', '$state', '$rootScope', '$location', 'authService', 'notificationService', registerCtrl]);

function registerCtrl($scope, $state, $rootScope, $location, authService, notificationService) {
    $rootScope.title = 'Register | Emergy';
    $rootScope.background = 'background-image';
    $scope.isBusy = false;
    $scope.captchaIsValid = null;

    $scope.newUser = {
        Email: '',
        Username: '',
        Password: '',
        ConfirmPassword: '',
        BirthDate: '1/1/0001 12:00:00 AM'
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

    $scope.validateCaptcha = function () {
        var response = grecaptcha.getResponse();
        console.log("unutra sam");
        $http.post('https://www.google.com/recaptcha/api/siteverify', { 'secret': '6Le9ABMTAAAAAOYeT7ZtmKCNnC9GMWqxjeR9_E34', 'response': response }).success(function() {
            $scope.captchaIsValid = true;
        }).error(function() {
            $scope.captchaIsValid = false;
        });
        console.log(captchaIsValid);
    };
}