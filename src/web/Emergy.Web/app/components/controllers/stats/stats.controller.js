(function () {
    'use strict';

    app.controller('statsController', stats);
    stats.$inject = ['statsService', '$rootScope'];

    function stats(statsService, $rootScope) {
        var vm = this;
        $rootScope.title = 'Statistics | Emergy';

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
            statsService.getStats().then(function (stats) {
                vm.stats = stats;
                buildChart();
            });
        }

        activate();
    }
})();
