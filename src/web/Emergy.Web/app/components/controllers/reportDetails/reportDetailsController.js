'use strict';

var controllerId = 'reportDetailsController';

app.controller(controllerId,
    ['$scope', '$state', '$rootScope', '$stateParams', 'unitsService',
        'authService', 'notificationService', 'authData', reportDetailsController]);

function reportDetailsController($scope, $state, $rootScope, $stateParams, unitsService, authService, notificationService, authData) {
    $rootScope.title = "Report | Details";

    var loadReport = function () {
        $scope.isBusy = true;
        var promise = reportsService.getReport($stateParams.reportId);
        promise.then(function (report) {
            $scope.report = unit;
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    };

    var loadCategories = function () {
        $scope.isBusy = true;
        var promise = unitsService.getCategories($scope.report.Unit.Id);
        promise.then(function (categories) {
            $scope.categories = categories;
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    }

    //loadCategories();
    //loadReport();
}
