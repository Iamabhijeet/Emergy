/// <reference path="../../services/realtime/hubService.js" />
(function () {
    'use strict';

    function clientsController($location, $rootScope, unitsService,
        reportsService, statsService, notificationService, authData, hub, signalR) {
        $rootScope.title = 'Dashboard - ' + authData.userName + ' | Emergy';

        var vm = this;

        vm.units = [];
        vm.reports = [];
        vm.stats = [];

        function buildChart() {
            var chartModel = vm.stats.ReportsChart;
            vm.chartSeries = ['Reports Count', 'Reports Completed'];
            vm.chartLabels = [];
            vm.chartData = [
              [],
              []
            ];
            for (var i = 3; i > -1; i--) {
                vm.chartLabels.push(chartModel[i].Month);
                vm.chartData[0].push(chartModel[i].ReportsCount);
                vm.chartData[1].push(chartModel[i].CompletedReportsCount);
            }
        }
        function activate() {
            unitsService.getUnits().then(function (units) { vm.units = units; }, function (error) { notificationService.pushError(error.Message) });
            reportsService.getReports().then(function (reports) { vm.reports = reports; }, function (error) { notificationService.pushError(error.Message); });
            statsService.getStats().then(function (stats) {
                vm.stats = stats;
                buildChart();
            }, function (error) { notificationService.pushError(error.Message); });
        }
        vm.loadReports = function () {
            reportsService.getReports().then(function (reports) { vm.reports = reports; }, function (error) { notificationService.pushError(error); });
        }

        activate();
    }

    app.controller('clientsController', clientsController);
    clientsController.$inject = ['$location', '$rootScope', 'unitsService', 'reportsService',
        'statsService', 'notificationService', 'authData', 'hub', 'signalR'];
})();
