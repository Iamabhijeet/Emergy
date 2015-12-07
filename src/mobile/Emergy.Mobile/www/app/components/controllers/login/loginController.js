'use strict';

var controllerId = 'loginController';

app.controller(controllerId,
    ['$scope', '$rootScope', 'authService', 'authData', loginController]);

function loginController($scope, $rootScope, authService, authData, $ionicLoading) {
    $scope.user = {};
    $scope.user = {
        userName: '',
        password: ''
    };

    $scope.login = function (user) {
        var promise = authService.login(user);
        promise.then(function() {
            
        }, function(response) {

        }).finally(function() {
        });

    };
}