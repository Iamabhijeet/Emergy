(function () {
    'use strict';

    function clientsController($location, $rootScope, unitsService,
        reportsService, statsService, notificationService, authData) {
        var vm = this;
        vm.units = [];
        vm.reports = [];
        vm.stats = [];

        $rootScope.title = 'Dashboard - ' + authData.userName;

        function activate() {
            unitsService.getUnits().then(function (units) { vm.units = units; }, function (error) { notificationService.pushError(error) });
            reportsService.getReports().then(function (reports) { vm.reports = reports; }, function (error) { notificationService.pushError(error); });
            statsService.getStats().then(function (stats) { vm.stats = stats; }, function (error) { notificationService.pushError(error); });
        }

        activate();
    }

    app.controller('clientsController', clientsController);
    clientsController.$inject = ['$location', '$rootScope', 'unitsService', 'reportsService', 'statsService', 'notificationService', 'authData'];
})();
