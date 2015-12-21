(function () {
    'use strict';

    function clientsController($location, $rootScope, unitsService, reportsService, notificationService, authData) {
        var vm = this;
        $rootScope.title = 'Dashboard';

        function activate() {
            unitsService.getUnits().then(function (units) { vm.units = units; }, function (error) { notificationService.pushError(error) });
        }

        activate();
    }

    app.controller('clientsController', clientsController);
    clientsController.$inject = ['$location', '$rootScope', 'unitsService', 'reportsService', 'notificationService', 'authData'];
})();
