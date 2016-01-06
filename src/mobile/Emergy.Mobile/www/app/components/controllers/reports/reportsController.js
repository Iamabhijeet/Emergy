'use strict';

var controllerId = 'reportsController';

app.controller(controllerId,
    ['$scope', '$rootScope', 'authService', 'notificationService', 'reportsService', reportsController]);

function reportsController($scope, $rootScope, authService, notificationService, reportsService) {
    $scope.reports = [];

    var loadReports = function () {
        notificationService.displayLoading("Loading reports...");
        var promise = reportsService.getReports();
        promise.then(function(reports) {
            $scope.reports = reports; 
        }, function() {
            notificationService.displayErrorPopup("There has been an error loading reports.", "Ok");
        }).finally(function () {
            notificationService.hideLoading();
        });
    };

    loadReports(); 
}