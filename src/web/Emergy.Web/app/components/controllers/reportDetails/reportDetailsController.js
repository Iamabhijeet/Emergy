'use strict';

var controllerId = 'reportDetailsController';

app.controller(controllerId,
    ['vm', '$state', '$rootScope', '$stateParams', 'unitsService', 'reportsService',
        'authService', 'notificationService', reportDetailsController]);

function reportDetailsController($scope, $state, $rootScope, $stateParams, unitsService, reportsService, authService, notificationService) {
    $rootScope.title = "Report | Details";

    $scope.$on('mapInitialized', function (event, map) {
        $scope.map = map;
    });
    var loadReport = function () {
        reportsService.getReport($stateParams.reportId)
        .then(function (report) {
            $scope.report = report;
        }, function () {
            notificationService.pushError("Error has happened while loading report details!");
        });
    };
    $scope.showTitle = function () {
        var infowindow = new google.maps.InfoWindow();
        infowindow.setPosition({ lat: $scope.report.Location.Latitude, lng: $scope.report.Location.Longitude });
        infowindow.setContent('Reported from: ' + $scope.report.Location.Name + '(' + $scope.report.Location.Latitude + ',' + $scope.report.Location.Longitude + ')');
        infowindow.open($scope.map);
    };

    loadReport();


    $scope.deleteReport = function (reportId) {
        $scope.isBusy = true;
        var promise = reportsService.deleteReport(reportId);
        promise.then(function () {
            notificationService.pushSuccess("Report has been deleted!");
            $state.go('Reports');
        }, function () {
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
            $scope.loadReports();
        }, function () {
            notificationService.pushError("Error has happened while changing the status.");
        });
    }

}
