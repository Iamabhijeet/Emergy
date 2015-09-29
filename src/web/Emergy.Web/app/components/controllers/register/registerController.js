'use strict';

var controllerId = 'registerController';

app.controller(controllerId,
    ['$scope', '$rootScope', '$location', 'authService', 'notificationService', registerCtrl]);

function registerCtrl($scope, $rootScope, $location, authService, notificationService) {
    $rootScope.title = 'Register | Emergy';
    $rootScope.background = 'background-image';
    $scope.isBusy = false;
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
            var loginPromise = authService.login(newUser);
            loginPromise.then(function () { }, function () { }).finally(function () {
                $scope.isBusy = false;
            });
        }, function (error) {
            notificationService.pushError(error);
        }).finally(function () {
            $scope.isBusy = false;
        });
    };
}