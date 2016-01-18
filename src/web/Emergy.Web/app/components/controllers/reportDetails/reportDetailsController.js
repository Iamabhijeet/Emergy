'use strict';

var controllerId = 'reportDetailsController';

app.controller(controllerId,
    ['vm', '$state', '$rootScope', '$stateParams', '$window', 'unitsService', 'reportsService',
        'authService', 'notificationService', 'assignmentService', 'accountService', 'pdfService', 'signalR', 'ngDialog', 'NgMap', 'hub', reportDetailsController]);

function reportDetailsController($scope, $state, $rootScope, $stateParams, $window, unitsService, reportsService, authService, notificationService, assignmentService, accountService, pdfService, signalR, ngDialog, NgMap, hub) {
    $rootScope.title = "Report | Details";
    $scope.isBusy = false;
    $scope.isLoading = true;
    $scope.notificationAvailable = false;
    $scope.assignedUser = {}; 

    $rootScope.$on(signalR.events.client.pushNotification, function (event, response) {
        $scope.notificationAvailable = true;
        var promise = notificationService.getNotification(response);
        promise.then(function (notification) {
            if (notification.Type === "ReportCreated") {
                var promise = reportsService.getReport(notification.ParameterId);
                promise.then(function (report) {
                    $scope.arrivedReport = {};
                    $scope.arrivedReport = report;
                    ngDialog.close();
                    ngDialog.open({
                        template: "reportCreatedModal",
                        disableAnimation: true,
                        scope: $scope
                    });                   
                }, function (error) {
                    notificationService.pushError("Error has happened while loading notification.");
                });
            }
            else if (notification.Type === "MessageArrived") {
                //Implement message notification
            }
        });
    });

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
        var promise = reportsService.changeStatus(reportId, JSON.stringify(newStatus));
        promise.then(function () {
            var promise = reportsService.getReport(reportId);
            promise.then(function (report) {
                var notification = {
                    Content: newStatus,
                    TargetId: report.CreatorId,
                    Type: "ReportUpdated",
                    ParameterId: reportId
                }

                var promise = notificationService.createNotification(notification);
                promise.then(function (notificationId) {
                    try {
                        hub.server.sendNotification(notificationId);
                    } catch (err) {
                        notificationService.pushError("Error has happened while pushing a notification.");
                    }
                    notificationService.pushSuccess("Status changed to " + newStatus);
                }, function () {
                    notificationService.pushError("Error has happened while changing the status.");
                });
            }, function () {
                notificationService.pushError("Error has happened while changing the status.");
            });
        }, function (error) {
            notificationService.pushError("Error has happened while changing the status.");
        });
    }
    $scope.generatePdf = function (report) {
        window.print();
        //pdfService.generate(report).then(function () {
        //    $scope.printMode = false;
        //    notificationService.pushSuccess("Report documentation (pdf) has been generated!");
        //});
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
        promise.then(function (assignments) {
            $scope.assignedUser = assignments[0].TargetId; 
        }, function (error) {
            notificationService.pushError("Error has happened while loading report assignments!");
        }).finally(function () {
            $scope.isLoading = false;
        });
    }

    loadReport();
}
