'use strict';

var controllerId = 'unitsController';

app.controller(controllerId,
    ['vm', '$rootScope', 'unitsService',
        'authService', 'notificationService', 'signalR', 'reportsService', 'ngDialog', unitsController]);

function unitsController($scope, $rootScope, unitsService, authService, notificationService, signalR, reportsService, ngDialog) {
    $rootScope.title = 'Units | Emergy';
    $scope.units = [];
    $scope.searchTerm = '';
    $scope.isBusy = false;
    $scope.notificationAvailable = false;

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
                        options: { draggable: false, scrollwheel: false },
                        center: { latitude: report.Location.Latitude, longitude: report.Location.Longitude },
                        zoom: 10,
                        styles: [{ stylers: [{ hue: '#18C0D6' }, { visibility: 'simplified' }, { gamma: 0.5 }, { weight: 0.5 }] }, { featureType: 'water', stylers: [{ color: '#37474f' }] }]
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

    var loadUnits = function () {
        $scope.isBusy = true; 
        var promise = unitsService.getUnits();
        promise.then(function (units) {
            angular.copy(units, $scope.units);
        }, function (error) {
            notificationService.pushError("Error has happened while loading units.");
        }).finally(function() {
            $scope.isBusy = false;
        });
    };

    $scope.createUnit = function (unitName) {
        var promise = unitsService.createUnit({
            Name: unitName
        });
        promise.then(function () {
            loadUnits();
        },
        function (error) {
            notificationService.pushError("Error has happened while creating a new unit.");
        })
        .finally(function () {
            $scope.unitName = '';
        });
    }

    loadUnits();
}