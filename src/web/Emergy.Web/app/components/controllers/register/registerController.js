'use strict';

var controllerId = 'registerController';

app.controller(controllerId,
    ['vm', '$state', '$rootScope', '$location', 'authService', 'notificationService', 'accountService', registerCtrl]);

function registerCtrl($scope, $state, $rootScope, $location, authService, notificationService, accountService) {
    $rootScope.title = 'Register | Emergy';
    $rootScope.background = 'background-image';
    $scope.isBusy = false;
    $scope.captchaIsValid = false;
    $scope.userNameValid = false;
    $scope.isUserNameTaken = true;
    $scope.isEmailTaken = true;

    var validateUserName = function () {
        if ($scope.newUser.Username) {
            if ($scope.newUser.Username.indexOf('.') == -1) {
                $scope.userNameValid = true;
            }
            else {
                $scope.userNameValid = false;
            }
            accountService.isUserNameTaken($scope.newUser.Username)
              .then(function (response) {
                  $scope.isUserNameTaken = response.data;
              });
        }
    };
    var validateEmail = function () {
        if ($scope.newUser.Email) {
            accountService.isEmailTaken($scope.newUser.Email)
               .then(function (response) {
                   $scope.isUserEmailTaken = response.data;
               });
        }
    };


    $scope.newUser = {
        Email: '',
        Username: '',
        Password: '',
        ConfirmPassword: '',
        BirthDate: '1/1/0001 12:00:00 AM',
        ReCaptchaResponse: ''
    };
    $scope.validateUserName = validateUserName;
    $scope.validateEmail = validateEmail;


    $scope.submitForm = function (newUser) {
        $scope.isBusy = true;
        var promise = authService.register(newUser);
        promise.then(function () {
            $state.go("RegisterSuccess");
        }, function (response) {
            notificationService.pushError("Error has happened while processing your registration.");
        }).finally(function () {
            $scope.isBusy = false;
        });
    };

    $scope.setResponse = function (response) {
        $scope.newUser.ReCaptchaResponse = response;
        $scope.captchaIsValid = true;
    };
}