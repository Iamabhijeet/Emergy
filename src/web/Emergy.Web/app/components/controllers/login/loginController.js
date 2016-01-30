'use strict';

var controllerId = 'loginController';

app.controller(controllerId,
    ['vm', '$rootScope', '$state', 'authService', 'notificationService', 'authData', loginCtrl]);

function loginCtrl($scope, $rootScope, $state, authService, notificationService, authData) {
    $rootScope.title = 'Login | Emergy';
    $rootScope.background = 'background-image';
    $scope.isBusy = false;
    $scope.user = {
        userName: '',
        password: ''
    };

    if (authData.loggedIn && authData.isAdmin()) {
        $state.go('Units');
    } else if (authData.loggedIn && authData.isClient()) {
        $state.go('ClientDashboard', authData.userId);
    }

    $scope.submitForm = function (user) {
        $scope.isBusy = true;
        var promise = authService.login(user);
        promise.then(function () {
            $rootScope.$broadcast('userAuthenticated');
        }, function () {
            notificationService.pushError("Error has happened while processing your login.");
        }).finally(function () {
            $scope.isBusy = false;
        });
    };
}