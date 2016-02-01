﻿'use strict';

var controllerId = 'assignmentsController';

app.controller(controllerId,
    ['$scope', '$state', '$rootScope', '$cordovaGeolocation', 'authService', 'notificationService', 'reportsService', 'connectionStatusService', 'hub', 'signalR', 'assignmentService', 'unitsService', 'locationService', assignmentsController]);

function assignmentsController($scope, $state, $rootScope, $cordovaGeolocation, authService, notificationService, reportsService, connectionStatusService, hub, signalR, assignmentService, unitsService, locationService) {
    $scope.report = {};
    var posOptions = { frequency: 30000, timeout: 5000, enableHighAccuracy: false };
    $scope.isLoading = true;
    var watch = {};

    $scope.goBack = function () {
        try {
            watch.clearWatch();
        } catch (err) {
            $state.go("tab.home");
        }
        $state.go("tab.home");
    };

    $rootScope.$on(signalR.events.client.pushNotification, function (event, response) {
        $scope.notificationAvailable = true;
        var promise = notificationService.getNotification(response);
        promise.then(function (notification) {
            if (notification.Type === "MessageArrived") {
                notificationService.displaySuccessWithActionPopup("You have received a new message!", "VIEW", function () { $state.go("tab.messages", { senderId: notification.SenderId }); });
            }
            else if (notification.Type === "ReportUpdated") {
                notificationService.displaySuccessWithActionPopup("Report that you submitted had its status changed to " + notification.Content + "!", "VIEW", function () { $state.go("tab.reports"); });
            }
            else if (notification.Type === "AssignedForReport") {
                $scope.isLoading = true;
                $scope.report = {};
                loadAssignment(); 
            }
        });
    });

    $scope.viewDirections = function () {
        $state.go("tab.directions", { reportId: $scope.report.Id });
    };

    $scope.changeStatus = function(newStatus) {
        var promise = reportsService.changeStatus($scope.report.Id, JSON.stringify(newStatus));
        promise.then(function () {
            var notification = {
                Content: newStatus,
                TargetId: $scope.assignment.AdminId,
                Type: "ReportUpdated",
                ParameterId: $scope.report.Id
            }
            console.log(notification);
            notificationService.displaySuccessPopup("Successfully changed report status to " + newStatus + "!", "OK");
            if (newStatus === 'Completed' || newStatus === 'Failure') {
                watch.clearWatch();
                $state.go('tab.home');
            }
            var promise = notificationService.pushNotification(notification);
            promise.then(function(notificationId) {
                try {
                    hub.server.sendNotification(notificationId);
                } catch (err) {
                    notificationService.displayErrorPopup("There has been an error notifying administrator!", "OK");
                }
            }, function() {
                notificationService.displayErrorPopup("There has been an creating a notification!", "OK");
            });
        }, function() {
            notificationService.displayErrorPopup("There has been an error changing report status!", "OK");
        });
    }

    var loadReport = function (reportId) {
        $scope.isLoading = true; 
        var promise = reportsService.getReport(reportId);
        promise.then(function(report) {
            $scope.report = report;
        }, function(error) {
            notificationService.displayErrorPopup("There has been an error fetching assignment information.!", "OK");
        }).finally(function() {
            $scope.isLoading = false;
            notificationService.hideLoading();
        }); 
    };

    var loadAssignment = function () {
        notificationService.displayLoading("Loading assignments...");
        var promise = assignmentService.getAssignment();
        promise.then(function (assignment) {
            if (assignment) {
                $scope.assignment = assignment;
                loadReport($scope.assignment.ReportId);
                
                watch = $cordovaGeolocation.watchPosition(posOptions);
                watch.then(null, function (err) {
                }, function (position) {
                    $scope.latitude = position.coords.latitude;
                    $scope.longitude = position.coords.longitude;

                    var location = {
                        Latitude: $scope.latitude,
                        Longitude: $scope.longitude,
                        Name: "Current location",
                        Type: "Captured"
                    }

                    console.log(position);

                    var promise = unitsService.createLocation(location);
                    promise.then(function(locationId) {
                        var promise = locationService.updateUserLocation(locationId);
                        promise.then(function() {
                            var notification = {
                                Content: "has updated current location",
                                TargetId: $scope.assignment.AdminId,
                                Type: "ReportUpdated",
                                ParameterId: $scope.assignment.ReportId
                            }
                            var promise = notificationService.pushNotification(notification);
                            promise.then(function(notificationId) {
                                try {
                                    hub.server.sendNotification(notificationId);
                                }
                                catch (err) {
                                    notificationService.displayErrorPopup("There has been an error pushing a notification!", "OK");
                                }
                            }, function() {
                                notificationService.displayErrorPopup("There has been an error creating a notification!", "OK");
                            });
                        }, function() {
                        });
                    }, function() {
                    });
                });
            } else {
                $scope.report = null;
                notificationService.hideLoading();
            }
        }, function() {
            $scope.report = null;
            notificationService.hideLoading();
        });
    }

    loadAssignment(); 
}