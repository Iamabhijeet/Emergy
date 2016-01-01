'use strict';

var controllerId = 'reportDetailsController';

app.controller(controllerId,
    ['vm', '$state', '$rootScope', '$stateParams', 'unitsService', 'reportsService', 'assignmentService', 'accountService',   
        'authService', 'notificationService', 'authData', reportDetailsController]);

function reportDetailsController($scope, $state, $rootScope, $stateParams, unitsService, reportsService, assignmentService, accountService, authService, notificationService, authData) {
    $rootScope.title = "Report | Details";
    $scope.assignedUser = {};
    $scope.report = {};

    $scope.assignUser = function(userName) {
        var promise = accountService.getProfileByUsername(userName);
        promise.then(function (user) {
            var promise = assignmentService.createAssignment($scope.report.Id, user.data.Id);
            promise.then(function(assignmentId) {
                notificationService.pushError("Successfully assigned user to report!");
                loadAssignments();
            }, function(error) {
                notificationService.pushError("Error has happened while assigning user to the report!");
            });
        }, function(error) {
            notificationService.pushError("User with the specified username does not exist!");
        });
    };

    var loadReport = function () {
        var promise = reportsService.getReport($stateParams.reportId);
        promise.then(function (report) {
            $scope.report = report;
            console.log(report);
            loadAssignments();
        }, function (error) {
            notificationService.pushError("Error has happened while loading report details!");
        }); 
    };

    var loadAssignments = function() {
        var promise = assignmentService.getAssignments($scope.report.Id);
        promise.then(function (assignment) {
            $scope.assignedUser = assignment.Target;
        }, function (error) {
            notificationService.pushError("Error has happened while loading report assignments!");
        });
    }

    loadReport();
}
