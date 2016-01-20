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
    $scope.reportMarker = {};
    $scope.lastReportDateTime = '';
    $scope.notificationAvailable = false;
    $scope.isUnitMode = $stateParams.unitId !== null && $stateParams.unitId !== undefined;
    $scope.showMore = false; 

    $rootScope.$on(signalR.events.client.pushNotification, function (event, response) {
        $scope.notificationAvailable = true;
        var promise = notificationService.getNotification(response);
        promise.then(function (notification) {
            if (notification.Type === "ReportCreated") {
                var promise = reportsService.getReport(notification.ParameterId);
                promise.then(function (report) {
                    $scope.arrivedReport = {};
                    $scope.arrivedReport = report;
                    $scope.reportMarker = {
                        latitude: report.Location.Latitude,
                        longitude: report.Location.Longitude
                    }
                    $scope.map = {
                        control: {},
                        options: { draggable: false ,scrollwheel: false},
                        center: { latitude: report.Location.Latitude, longitude: report.Location.Longitude },
                        zoom: 12,
                        styles: [{ 'featureType': 'landscape.natural', 'elementType': 'geometry.fill', 'stylers': [{ 'visibility': 'on' }, { 'color': '#e0efef' }] }, { 'featureType': 'poi', 'elementType': 'geometry.fill', 'stylers': [{ 'visibility': 'off' }, { 'hue': '#1900ff' }, { 'color': '#c0e8e8' }] }, { 'featureType': 'road', 'elementType': 'geometry', 'stylers': [{ 'lightness': 100 }, { 'visibility': 'simplified' }] }, { 'featureType': 'road', 'elementType': 'labels', 'stylers': [{ 'visibility': 'on' }] }, { 'featureType': 'transit.line', 'elementType': 'geometry', 'stylers': [{ 'visibility': 'on' }, { 'lightness': 700 }] }, { 'featureType': 'water', 'elementType': 'all', 'stylers': [{ 'color': '#00ACC1' }] }]
                    };
                    $scope.reports = [];
                    $scope.lastReportDateTime = '';
                    $scope.loadReports();
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

    $scope.loadReports = function () {
        $scope.isBusy = true;
        var promise = reportsService.getReports($scope.lastReportDateTime);
        promise.then(function (reports) {
            if (reports.length % 10 === 0 && reports.length !== 0) {
                $scope.showMore = true;
            }
            if (reports.length && reports[0].Timestamp !== $scope.lastReportDateTime) {
                $scope.lastReportDateTime = reports[reports.length - 1].Timestamp;
                $scope.reports = $scope.reports.concat(reports);
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
        var promise = reportsService.changeStatus(reportId, JSON.stringify(newStatus));
        promise.then(function () {
            var promise = reportsService.getReport(reportId);
            promise.then(function(report) {
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
                    $scope.reports = [];
                    $scope.lastReportDateTime = '';
                    $scope.loadReports();
                }, function() {
                    notificationService.pushError("Error has happened while changing the status.");
                });
            }, function() {
                notificationService.pushError("Error has happened while changing the status.");
            });
        }, function (error) {
            notificationService.pushError("Error has happened while changing the status.");
        });
    }

    $scope.loadReports();
}