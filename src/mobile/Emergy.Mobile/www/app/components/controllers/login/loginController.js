'use strict';

var controllerId = 'loginController';

app.controller(controllerId,
    ['$scope', '$rootScope', '$ionicHistory', 'authService', 'notificationService', loginController]);

function loginController($scope, $rootScope, $ionicHistory, authService, notificationService) {
    $ionicHistory.nextViewOptions({
        disableAnimate: false,
        disableBack: true,
        historyRoot: true
    });

    $scope.isBusy = false;
    $scope.user = {
        userName: '',
        password: ''
    };
    $scope.login = function (user) {
        $scope.isBusy = true;
        notificationService.displayLoading('Logging in...');
        authService.login(user).finally(function () { $scope.isBusy = false; notificationService.hideLoading(); });
    };
}