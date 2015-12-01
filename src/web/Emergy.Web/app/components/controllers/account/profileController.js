'use strict';

var controllerId = 'profileController';

app.controller(controllerId,
    ['$rootScope', '$scope', 'accountService', 'authData', profileController]);

function profileController($rootScope, $scope, accountService, authData) {
    $rootScope.title = 'User ' + authData.userName;
    $scope.profile = {};

    function activate() {
        accountService.getProfile().then(function (profile) {
            angular.copy(profile.data, $scope.profile);
            console.log($scope.profile);
        });
    }
    activate();
}