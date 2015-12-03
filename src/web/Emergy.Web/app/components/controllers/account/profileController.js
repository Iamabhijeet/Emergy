'use strict';

var controllerId = 'profileController';

app.controller(controllerId,
    ['$rootScope', '$scope', '$filter', 'accountService', 'authService', 'authData', 'notificationService', profileController]);

function profileController($rootScope, $scope, $filter, accountService, authService, authData, notificationService) {
    $rootScope.title = 'User ' + authData.userName;
    $scope.profile = {};
    $scope.changePasswordVm = {
        OldPassword: '',
        NewPassword: '',
        ConfirmPassword: ''
    };

    function activate() {
        accountService.getProfile()
            .then(function (profile) {
                angular.copy(profile.data, $scope.profile);
                $scope.profile.Timestamp = 'Registered at ' + $filter('date')($scope.profile.Timestamp, 'MM/dd/yyyy') + ' at ' + $filter('date')($scope.profile.Timestamp, 'h:mm') + '.';
                $scope.profile.currentPhoto = $scope.profile.ProfilePhoto.Url;

            });
    }

    $scope.changePassword = function (model) {
        authService.changePassword(model.NewPassword, model.ConfirmPassword)
            .then(function () {
                notificationService.pushSuccess('Your password has been changed!');
            }, function (error) {
                notificationService.pushError(error);
            });
    }

    $scope.updateInfo = function (profile) {
        accountService.editProfile(profile)
         .then(function () {
             notificationService.pushSuccess('Your profile has been updated!');
             activate();
         }, function (error) {
             notificationService.pushError(error);
         });
    }

    activate();
}