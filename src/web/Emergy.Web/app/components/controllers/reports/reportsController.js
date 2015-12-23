'use strict';

var controllerId = 'reportsController';

app.controller(controllerId,
[
    '$scope', '$rootScope', '$stateParams', 'reportsService',
        'authService', 'notificationService', 'authData', reportsController]);

function reportsController($scope, $rootScope, $stateParams,
    reportsService, authService, notificationService, authData) {
    $rootScope.title = 'Reports | Emergy';
    $scope.isBusy = false;
    $scope.reports = [];
    $scope.lastReportDateTime = '';
    $scope.isUnitMode = $stateParams.unitId !== null && $stateParams.unitId !== undefined;

    var loadReports = function () {
        $scope.isBusy = true;
        var promise = reportsService.getReports($scope.lastReportDateTime); 
        promise.then(function (response) {
            angular.copy(response, $scope.reports);
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    }

    $scope.deleteReport = function (reportId) {
        $scope.isBusy = true;

        var promise = reportsService.deleteReport(reportId);
        promise.then(function () {
            notificationService.pushSuccess("Report has been deleted!");
            loadReports();
        }, function (error) {
            notificationService.pushError(error.Message);
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    }

    $scope.changeStatus = function (reportId, newStatus) {
        var promise = reportsService.changeStatus(reportId, newStatus);
        promise.then(function () {
            notificationService.pushSuccess("Status changed to " + newStatus);
        }, function (error) {
            notificationService.pushError(error.Message);
        });
    }

    loadReports();
}