'use strict';

var controllerId = 'loginController';

app.controller(controllerId,
    ['$scope', '$rootScope', 'authService', 'notificationService', 'authData', loginCtrl]);

function loginCtrl($scope, $rootScope, authService, notificationService, authData) {
    $rootScope.title = 'Login | Emergy';
    $rootScope.background = 'background-image';
    $scope.user = {};
    $scope.isBusy = false;
    $scope.user = {
        userName: '',
        password: ''
    };
    $scope.submitForm = function (user) {
        $scope.isBusy = true;
        var promise = authService.login(user);
        promise.then(function () { }, function (response) {
            notificationService.pushError(response.Message);
        }).finally(function () {
            $scope.isBusy = false;
        });
    };
}