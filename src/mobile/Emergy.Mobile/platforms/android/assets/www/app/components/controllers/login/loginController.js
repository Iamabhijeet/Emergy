'use strict';

var controllerId = 'loginController';

app.controller(controllerId,
    ['$scope', '$rootScope', '$ionicHistory', '$cordovaTouchID', 'authService', 'notificationService', 'authData', loginController]);

function loginController($scope, $rootScope, $ionicHistory, $cordovaTouchId, authService, notificationService, authData) {
    $ionicHistory.nextViewOptions({
        disableAnimate: false,
        disableBack: true,
        historyRoot: true
    });
    var tryAuthorize = function() {
        if (authData.token && authData.loggedIn) {
            $rootScope.$broadcast('userAuthenticated');
        }
    };
    var tryTouchId = function () {
        $cordovaTouchId.checkSupport().then(function () {
            alert('ok');
            $cordovaTouchId.authenticate('Authorize!').then(function () {
                tryAuthorize();
            }, function () {
                notificationService.displayErrorPopup('Touch ID authorization failed!', 'DONE');
            });
        });
    };
    var checkAuthorized = function () {
        notificationService.displayLoading('Logging in...');
        if (ionic.Platform.isAndroid()) {
            tryAuthorize();
        }
        else {
            tryTouchId();
        }
        notificationService.hideLoading();
    };

  

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
    $cordovaTouchId.checkSupport().then(function () {
        alert('ok');
        $cordovaTouchId.authenticate('Authorize!').then(function () {
            tryAuthorize();
        }, function () {
            notificationService.displayErrorPopup('Touch ID authorization failed!', 'DONE');
        });
    });
    checkAuthorized();
}