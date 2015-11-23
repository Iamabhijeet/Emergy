'use strict';

var controllerId = 'reportsController';

app.controller(controllerId,
    ['$scope', '$rootScope', 'reportsService',
        'authService', 'notificationService', 'authData', reportsController]);

function reportsController($scope, $rootScope, reportsService, authService, notificationService, authData) {
    $rootScope.title = 'Reports | Emergy';
    $scope.isBusy = false;

    var loadReports = function() {
        //Add functionality
    }

    $scope.deleteReport = function (reportId) {
        $scope.isBusy = true;

        var promise = reportsService.deleteReport(reportId);
        promise.then(function (response) {
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
        promise.then(function (response) {
            notificationService.pushSuccess("Status changed to " + newStatus);
        }, function (error) {
            notificationService.pushError(error.Message);
        });
    }

    loadReports();
}