'use strict';

var controllerId = 'profileController';

app.controller(controllerId,
    ['$rootScope', '$scope', '$filter', 'accountService', 'authService', 'authData', 'notificationService', 'resourcesService', '$q', profileController]);

function profileController($rootScope, $scope, $filter, accountService, authService, authData, notificationService, resourcesService, $q) {
    $rootScope.title = 'User ' + authData.userName;
    $scope.profile = {};

    $scope.newPhoto = {
        Name: authData.userName,
        ContentType: "image/png",
        Base64: "",
        Id: 1
    };
    $scope.currentPhotoBase64 = '';

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
                $scope.currentPhotoBase64 = $scope.profile.ProfilePhoto.Base64;
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
    var uploadPhoto = function () {
        $scope.newPhoto.Base64 = $scope.currentPhotoBase64;
        var deffered = $q.defer();
        resourcesService.uploadBlob($scope.newPhoto, function (progress) {
            $scope.uploadProgress = progress;
        }).then(function (id) {
            $scope.newPhoto.Id = id;
            deffered.resolve(id);
        }, function (error) {
            notificationService.pushError(error);
            deffered.reject(error);
        });
        return deffered.promise;
    };
    $scope.updateInfo = function (profile) {
        if ($scope.currentPhotoBase64 !== profile.ProfilePhoto.Base64) {
            uploadPhoto().then(function () {
                profile.ProfilePhoto = {};
                profile.ProfilePhotoId = $scope.newPhoto.Id;
                accountService.editProfile(profile)
                 .then(function () {
                     notificationService.pushSuccess('Your profile has been updated!');
                     activate();
                 }, function (error) {
                     notificationService.pushError(error);
                 });
            });
        }
        else {
            accountService.editProfile(profile)
           .then(function () {
               notificationService.pushSuccess('Your profile has been updated!');
               activate();
           }, function (error) {
               notificationService.pushError(error);
           });
        }
    }

    activate();
}