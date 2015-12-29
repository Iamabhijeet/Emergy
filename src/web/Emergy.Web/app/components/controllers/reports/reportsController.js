﻿'use strict';

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

    $scope.loadReports = function () {
        $scope.isBusy = true;
        var promise = reportsService.getReports($scope.lastReportDateTime); 
        promise.then(function (reports) {
            angular.copy(reports, $scope.reports);
            if (reports.length === 10) {
                $scope.lastReportDateTime = reports[reports.length - 1].Timestamp;
            }
        }, function (error) {
            notificationService.pushError("Error has happened while loading reports.");
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
            notificationService.pushError("Error has happened while deleting the report.");
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    }

    $scope.changeStatus = function (reportId, newStatus) {
        console.log(reportId + " " + newStatus);
        var promise = reportsService.changeStatus(reportId, newStatus);
        promise.then(function () {
            notificationService.pushSuccess("Status changed to " + newStatus);
        }, function (error) {
            notificationService.pushError("Error has happened while changing the status.");
        });
    }

    $scope.loadReports();
}