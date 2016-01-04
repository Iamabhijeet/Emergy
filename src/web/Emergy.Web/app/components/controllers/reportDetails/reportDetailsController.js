'use strict';

var controllerId = 'reportDetailsController';

app.controller(controllerId,
    ['vm', '$state', '$rootScope', '$stateParams', 'unitsService', 'reportsService', 
        'authService', 'notificationService', 'authData', reportDetailsController]);

function reportDetailsController($scope, $state, $rootScope, $stateParams, unitsService, reportsService, authService, notificationService, authData) {
    $rootScope.title = "Report | Details";
    
    var loadReport = function () {
        var promise = reportsService.getReport($stateParams.reportId);
        promise.then(function (report) {
            $scope.report = report;
            console.log(report);
        }, function (error) {
            notificationService.pushError("Error has happened while loading report details!");
        }); 
    };

    loadReport();
}
