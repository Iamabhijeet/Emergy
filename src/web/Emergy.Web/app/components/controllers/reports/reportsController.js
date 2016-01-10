'use strict';

var controllerId = 'reportsController';

app.controller(controllerId,
[
    'vm', '$rootScope', '$stateParams', 'ngDialog', 'reportsService',
        'authService', 'notificationService', 'authData', 'hub', 'signalR', reportsController]);

function reportsController($scope, $rootScope, $stateParams, ngDialog, reportsService, authService, notificationService, authData, hub, signalR) {
    $rootScope.title = 'Reports | Emergy';
    $scope.isBusy = false;
    $scope.reports = [];
    $scope.arrivedReport = {};
    $scope.lastReportDateTime = '';
    $scope.isUnitMode = $stateParams.unitId !== null && $stateParams.unitId !== undefined;
    
    $rootScope.$on(signalR.events.client.pushNotification, function(event, response) {
        var promise = notificationService.getNotification(response);
        promise.then(function(notification) {
            if (notification.Type === "ReportCreated") {
                $scope.reports = [];
                $scope.lastReportDateTime = '';
                $scope.loadReports();
                $scope.arrivedReport = {};
                var promise = reportsService.getReport(notification.ParameterId);
                promise.then(function (report) {
                    ngDialog.close();
                    $scope.arrivedReport = report;
                    ngDialog.open({
                        template: "reportCreatedModal",
                        disableAnimation: true
                    });
                }, function(error) {
                    notificationService.pushError("Error has happened while loading notification.");
                });
            }
            else if (notification.Type === "MessageArrived") {

            }
        });
    });

    $scope.loadReports = function () {
        $scope.isBusy = true;
        var promise = reportsService.getReports($scope.lastReportDateTime); 
        promise.then(function (reports) {
            $scope.reports = $scope.reports.concat(reports);
            if (reports.length % 10 === 0 && reports.length !== 0) {
                $scope.lastReportDateTime = reports[reports.length - 1].Timestamp;
            }
        }, function () {
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
            $scope.reports = [];
            $scope.lastReportDateTime = '';
            $scope.loadReports();
        }, function (error) {
            notificationService.pushError("Error has happened while deleting the report.");
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    }

    $scope.changeStatus = function (reportId, newStatus) {
        console.log(reportId + " " + newStatus);
        var promise = reportsService.changeStatus(reportId, JSON.stringify(newStatus));
        promise.then(function () {
            notificationService.pushSuccess("Status changed to " + newStatus);
            $scope.reports = [];
            $scope.lastReportDateTime = '';
            $scope.loadReports();
        }, function (error) {
            notificationService.pushError("Error has happened while changing the status.");
        });
    }

    $scope.loadReports();
}