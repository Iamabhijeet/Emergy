(function () {
    'use strict';

    function notificationsValidator() {
        var lastCame = Date.now();
        function setLastCame(miliseconds) {
            lastCame = miliseconds;
        }
        function isNotificationValid() {
            return Date.now() - lastCame > 250;    
        }

        var service = {
            setLastCame: setLastCame,
            isNotificationValid: isNotificationValid
        };

        return service;
    }

    services.factory('notificationsValidator', notificationsValidator);

    notificationsValidator.$inject = [];
})();