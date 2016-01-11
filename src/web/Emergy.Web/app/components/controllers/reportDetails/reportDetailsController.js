'use strict';

var controllerId = 'reportDetailsController';

app.controller(controllerId,
    ['vm', '$state', '$rootScope', '$stateParams', 'unitsService', 'reportsService',
        'authService', 'notificationService', 'assignmentService', 'accountService', reportDetailsController]);

function reportDetailsController($scope, $state, $rootScope, $stateParams, unitsService, reportsService, authService, notificationService, assignmentService, accountService) {
    $rootScope.title = "Report | Details";
    $scope.isBusy = false;
    $scope.isLoading = true;

    $scope.$on('mapInitialized', function (event, map) {
        $scope.map = map;
    });

    $scope.showTitle = function () {
        var infowindow = new google.maps.InfoWindow();
        infowindow.setPosition({ lat: $scope.report.Location.Latitude, lng: $scope.report.Location.Longitude });
        infowindow.setContent('Reported from: ' + $scope.report.Location.Name + '(' + $scope.report.Location.Latitude + ',' + $scope.report.Location.Longitude + ')');
        infowindow.open($scope.map);
    };

    $scope.assignUser = function (userName) {
        $scope.isBusy = true;
        var promise = accountService.getProfileByUsername(userName);
        promise.then(function (user) {
            var promise = assignmentService.createAssignment($scope.report.Id, user.data.Id);
            promise.then(function (assignmentId) {
                notificationService.pushError("Successfully assigned user to report!");
                loadAssignments();
            }, function (error) {
                notificationService.pushError("Error has happened while assigning user to the report!");
            }).finally(function () {
                $scope.isBusy = false;
            });
        }, function (error) {
            notificationService.pushError("User with the specified username does not exist!");
        }).finally(function () {
            $scope.isBusy = false;
        });
    };

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

    var loadReport = function () {
        reportsService.getReport($stateParams.reportId)
        .then(function (report) {
            $scope.report = report;
            loadAssignments();
        }, function () {
            notificationService.pushError("Error has happened while loading report details!");
        });
    };

    var loadAssignments = function () {
        var promise = assignmentService.getAssignments($scope.report.Id);
        promise.then(function (assignment) {
            $scope.assignedUser = assignment.Target;
        }, function (error) {
            notificationService.pushError("Error has happened while loading report assignments!");
        }).finally(function () {
            $scope.isLoading = false;
        });
    }

    loadReport();
}
