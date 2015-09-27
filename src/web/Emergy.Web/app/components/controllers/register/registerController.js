'use strict';

var controllerId = 'registerController';

app.controller(controllerId,
    ['$scope', '$rootScope', '$location', 'authService', 'notificationService', registerCtrl]);

function registerCtrl($scope, $rootScope, $location, authService, notificationService) {
    $rootScope.title = 'Register | Emergy';
    $rootScope.background = 'background-image';
    $scope.newUser = {
        Name: '',
        Surname: '',
        Email: '',
        Username: '',
        Password: '',
        ConfirmPassword: '',
        BirthDate: '',
        Gender: '',
        AccountType: '',
        ProfilePhoto: ''
    };
    $scope.formErrors =
    {
        Email : "Email is invalid."
    };
    $scope.submitForm = function (newUser) {
        var promise = authService.register(newUser);
        promise.then(function () {
            var loginPromise = authService.login(newUser.Username, newUser.Password);
            loginPromise.then(function () { }, function () { });
        }, function (error) {
            notificationService.pushError(error.Message);
        });
    };
}