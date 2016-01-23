'use strict';

var controllerId = 'loginController';

app.controller(controllerId,
    ['$scope', '$rootScope', '$state', '$ionicHistory', 'authService', 'notificationService', 'authData', loginController]);

function loginController($scope, $rootScope, $state, $ionicHistory, authService, notificationService, authData) {
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
        authService.login(user).then(function () {
            $rootScope.$broadcast('userAuthenticated');
        }).finally(function () {
            $scope.isBusy = false;
            notificationService.hideLoading();
        });
    };

    if (authData.loggedIn) {
        $rootScope.$broadcast('userAuthenticated');
        $state.go('tab.home');
    }
}