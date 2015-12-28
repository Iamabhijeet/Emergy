'use strict';

var controllerId = 'loginController';

app.controller(controllerId,
    ['$scope', '$rootScope', 'authService', 'authData', loginController]);

function loginController($scope, $rootScope, authService, authData) {
    $scope.user = {};
    $scope.isBusy = false;
    $scope.user = {
        userName: '',
        password: ''
    };

    $scope.login = function (user) {
        $scope.isBusy = true;
        var promise = authService.login(user);
        promise.then(function() {
            
        }, function(response) {

        }).finally(function () {
            $scope.isBusy = false; 
        });

    };
}