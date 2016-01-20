'use strict';

var controllerId = 'reportDetailsController';

app.controller(controllerId,
    ['vm', '$state', '$rootScope', '$stateParams', '$window', 'unitsService', 'reportsService',
        'authService', 'notificationService', 'assignmentService', 'accountService', 'signalR', 'ngDialog', 'NgMap', 'hub', 'locationService', reportDetailsController]);

function reportDetailsController($scope, $state, $rootScope, $stateParams, $window, unitsService, reportsService, authService, notificationService, assignmentService, accountService, signalR, ngDialog, NgMap, hub, locationService) {
    $rootScope.title = "Report | Details";
    $scope.isBusy = false;
    $scope.isLoading = true;
    $scope.notificationAvailable = false;
    $scope.assignedUser = "";
    $scope.userLocationAvailable = false;

    $rootScope.$on(signalR.events.client.pushNotification, function (event, response) {
        $scope.notificationAvailable = true;
        var promise = notificationService.getNotification(response);
        promise.then(function (notification) {
            if (notification.Type === "ReportCreated") {
                var promise = reportsService.getReport(notification.ParameterId);
                promise.then(function (report) {
                    $scope.arrivedReport = {};
                    $scope.arrivedReport = report;
                    $scope.reportNotificationMarker = {
                        latitude: report.Location.Latitude,
                        longitude: report.Location.Longitude
                    }
                    $scope.notificationMap = {
                        control: {},
                        options: { draggable: false, scrollwheel: false },
                        center: { latitude: report.Location.Latitude, longitude: report.Location.Longitude },
                        zoom: 12,
                        styles: [{ 'featureType': 'landscape.natural', 'elementType': 'geometry.fill', 'stylers': [{ 'visibility': 'on' }, { 'color': '#e0efef' }] }, { 'featureType': 'poi', 'elementType': 'geometry.fill', 'stylers': [{ 'visibility': 'off' }, { 'hue': '#1900ff' }, { 'color': '#c0e8e8' }] }, { 'featureType': 'road', 'elementType': 'geometry', 'stylers': [{ 'lightness': 100 }, { 'visibility': 'simplified' }] }, { 'featureType': 'road', 'elementType': 'labels', 'stylers': [{ 'visibility': 'on' }] }, { 'featureType': 'transit.line', 'elementType': 'geometry', 'stylers': [{ 'visibility': 'on' }, { 'lightness': 700 }] }, { 'featureType': 'water', 'elementType': 'all', 'stylers': [{ 'color': '#00ACC1' }] }]
                    };
                    ngDialog.close();
                    document.getElementById("notificationSound").play();
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
                document.getElementById("notificationSound").play();
                notificationService.pushSuccess('<p><span>' + String(notification.Sender.UserName) + '</span> has sent you a message!</p> <a href="/dashboard/messages/' + String(notification.SenderId) + '">View</a>');
            }
            else if (notification.Type === "ReportUpdated" && notification.Content.length > 11) {
                document.getElementById("notificationSound").play();
                notificationService.pushSuccess('<p><span>' + String(notification.Sender.UserName) + '</span> has updated current location!</p> <a href="/dashboard/report/' + String(notification.ParameterId) + '">View</a>');
            }
            else if (notification.Type === "ReportUpdated" && notification.Content.length < 11) {
                document.getElementById("notificationSound").play();
                notificationService.pushSuccess('<p><span>' + String(notification.Sender.UserName) + '</span> has changed a report status to ' + String(notification.Content) + '!</p> <a href="/dashboard/report/' + String(notification.ParameterId) + '">View</a>');
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
            var promise = assignmentService.isAssigned(user.data.Id);
            promise.then(function(isAssigned) {
                if (isAssigned) {
                    notificationService.pushError("This user already has an assignment!");
                }
                else {
                    var promise = assignmentService.createAssignment($scope.report.Id, user.data.Id);
                    promise.then(function (assignmentId) {
                        var notification = {
                            Content: "Administrator has assigned you to resolve a report!",
                            TargetId: user.data.Id,
                            Type: "AssignedForReport",
                            ParameterId: $scope.report.Id
                        }

                        var promise = notificationService.createNotification(notification);
                        promise.then(function (notificationId) {
                            loadAssignments();
                            notificationService.pushError("Successfully assigned user to report!");
                            try {
                                hub.server.sendNotification(notificationId);
                            } catch (err) {
                                notificationService.pushError("Error has happened while pushing a notification.");
                            }
                        }, function () {
                            notificationService.pushError("Error has happened while creating a notification.");
                        });
                    }, function (error) {
                        notificationService.pushError("Error has happened while assigning user to the report!");
                    }).finally(function () {
                        $scope.isBusy = false;
                    });
                }
            }, function() {
                notificationService.pushError("Error has happened while assigning user to the report!");
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
    $scope.generatePdf = function () {
        window.print();
    }

    var loadReport = function () {
        reportsService.getReport($stateParams.reportId)
        .then(function (report) {
            $scope.report = report;
            $scope.reportLocationMarker = {
                latitude: report.Location.Latitude,
                longitude: report.Location.Longitude
            }
            $scope.map = {
                control: {},
                options: { draggable: true },
                center: { latitude: report.Location.Latitude, longitude: report.Location.Longitude },
                zoom: 14,
                styles: [{ 'featureType': 'landscape.natural', 'elementType': 'geometry.fill', 'stylers': [{ 'visibility': 'on' }, { 'color': '#e0efef' }] }, { 'featureType': 'poi', 'elementType': 'geometry.fill', 'stylers': [{ 'visibility': 'off' }, { 'hue': '#1900ff' }, { 'color': '#c0e8e8' }] }, { 'featureType': 'road', 'elementType': 'geometry', 'stylers': [{ 'lightness': 100 }, { 'visibility': 'simplified' }] }, { 'featureType': 'road', 'elementType': 'labels', 'stylers': [{ 'visibility': 'on' }] }, { 'featureType': 'transit.line', 'elementType': 'geometry', 'stylers': [{ 'visibility': 'on' }, { 'lightness': 700 }] }, { 'featureType': 'water', 'elementType': 'all', 'stylers': [{ 'color': '#00ACC1' }] }]
            };
            loadAssignments();
        }, function () {
            notificationService.pushError("Error has happened while loading report details!");
        });
    };

    var loadAssignments = function () {
        var promise = assignmentService.getAssignments($scope.report.Id);
        promise.then(function (assignments) {
            if (assignments.length !== 0) {
                $scope.assignedUserName = assignments[0].TargetUserName;
                var promise = locationService.getLatestUserLocation(assignments[0].TargetId);
                promise.then(function (location) {
                    if (location) {
                        $scope.userLocationMarker = {
                            latitude: location.Latitude,
                            longitude: location.Longitude
                        }
                        $scope.userLocationAvailable = true; 
                    }
                }, function() {

                });
            }
        }, function (error) {
            notificationService.pushError("Error has happened while loading report assignments!");
        }).finally(function () {
            $scope.isLoading = false;
        });
    }

    loadReport();
}
