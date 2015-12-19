(function () {
    'use strict';

    function clientsController($location) {
        var vm = this;
        vm.title = 'Dashboard';

        activate();

        function activate() { }
    }

    app.controller('clientsController', clientsController);
    clientsController.$inject = ['$location'];
})();
