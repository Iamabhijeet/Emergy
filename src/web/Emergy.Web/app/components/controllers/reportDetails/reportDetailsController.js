'use strict';

var controllerId = 'reportDetailsController';

app.controller(controllerId,
    ['vm', '$state', '$rootScope', '$stateParams', 'unitsService', 'reportsService',
        'authService', 'notificationService', 'authData', 'NgMap', reportDetailsController]);

function reportDetailsController($scope, $state, $rootScope, $stateParams, unitsService, reportsService, authService, notificationService, authData, NgMap) {
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

}
