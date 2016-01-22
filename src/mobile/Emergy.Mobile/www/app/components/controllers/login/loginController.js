'use strict';

var controllerId = 'loginController';

app.controller(controllerId,
    ['$scope', '$rootScope', '$ionicHistory','$ionicPlatform', '$cordovaTouchID', 'authService', 'notificationService', 'authData', loginController]);

function loginController($scope, $rootScope, $ionicHistory, $ionicPlatform, $cordovaTouchID, authService, notificationService, authData) {
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
  
    //$ionicPlatform.ready(function () {
    //    $cordovaTouchID.checkSupport().then(function () {
    //        $cordovaTouchID.authenticate("You must authenticate").then(function () {
    //            alert("The authentication was successful");
    //        }, function (error) {
    //            console.log(JSON.stringify(error));
    //        });
    //    }, function (error) {
    //        console.log(JSON.stringify(error));
    //    });
    //});
}