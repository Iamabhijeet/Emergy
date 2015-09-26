var serviceId = 'notificationService';
services.factory(serviceId, notificationService);
function notificationService() {
    var service = {
        pushError: pushError,
        pushSuccess: pushSuccess,
        notify: notify
    };
    function pushError(error) {
        var $toastContent = $('' + error);
        Materialize.toast($toastContent, 5000);
    }
    function pushSuccess(message) {
        var $toastContent = $('' + message);
        Materialize.toast($toastContent, 5000);
    }
    function notify(message) {
        // will be implemented
    }

    return service;
}