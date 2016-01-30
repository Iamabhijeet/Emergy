'use strict';

var controllerId = 'registerController';

app.controller(controllerId,
    ['vm', '$state', '$rootScope', '$location', 'authService', 'notificationService', 'accountService', '$q', 'authData', registerCtrl]);

function registerCtrl($scope, $state, $rootScope, $location, authService, notificationService, accountService, $q, authData) {
    $rootScope.title = 'Register | Emergy';
    $rootScope.background = 'background-image';
    $scope.isBusy = false;
    $scope.captchaIsValid = false;
    $scope.userNameValid = true;
    $scope.isUserNameTaken = false;
    $scope.isEmailTaken = false;

    if (authData.loggedIn && authData.isAdmin()) {
        $state.go('Units');
    } else if (authData.loggedIn && authData.isClient()) {
        $state.go('ClientDashboard', authData.userId);
    }

    var validateUserName = function () {
        var deffered = $q.defer();
        if ($scope.newUser.Username) {
            if ($scope.newUser.Username.indexOf('.') === -1) {
                $scope.userNameValid = true;
            }
            else {
                $scope.userNameValid = false;
            }
            accountService.isUserNameTaken($scope.newUser.Username)
              .then(function (response) {
                  $scope.isUserNameTaken = response.data;
                  deffered.resolve();
              });
        }
        return deffered.promise;
    };
    var validateEmail = function () {
        var deffered = $q.defer();
        if ($scope.newUser.Email) {
            accountService.isEmailTaken($scope.newUser.Email)
               .then(function (response) {
                   $scope.isEmailTaken = response.data;
                   deffered.resolve();
               });
        }
        return deffered.promise;
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
        $q.all([validateUserName, validateEmail]).then(function () {
            if ($scope.userNameValid && !$scope.isUserNameTaken && !$scope.isEmailTaken) {
                $scope.isBusy = true;
                var promise = authService.register(newUser);
                promise.then(function () {
                    $state.go("RegisterSuccess");
                }, function () {
                    notificationService.pushError("Error has happened while processing your registration.");
                }).finally(function () {
                    $scope.isBusy = false;
                });
            }
            else if ($scope.isUserNameTaken) {
                notificationService.pushError("The username is already in use.");
            }
            else {
                notificationService.pushError("The email is already in use.");
            }
        });

    };

    $scope.setResponse = function (response) {
        $scope.newUser.ReCaptchaResponse = response;
        $scope.captchaIsValid = true;
    };
}