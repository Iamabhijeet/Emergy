'use strict';

var controllerId = 'unitDetailsController';

app.controller(controllerId,
    ['$scope', '$rootScope', '$stateParams', 'unitsService',
        'authService', 'notificationService', 'authData', unitDetailsController]);

function unitDetailsController($scope, $rootScope, $stateParams, unitsService, authService, notificationService, authData) {
    var onLoaded = function () {
        $scope.isBusy = true;
        var promise = unitsService.getUnit($stateParams.unitId);
        promise.then(function (unit) {
            $scope.unit = unit;
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    };
    onLoaded();

}