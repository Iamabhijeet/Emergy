var serviceId = 'notificationService';
services.factory(serviceId, notificationService);
function notificationService() {
    function pushError(error) {
        var errorString = 'Unknown error! :(';
        if (error !== null) {
            errorString = error;
        }
        Materialize.toast(errorString, 5000);
    }
    function pushSuccess(message) {
        Materialize.toast(message, 5000);
    }
    function notify(message) {
        // will be implemented
    }

    var service = {
        pushError: pushError,
        pushSuccess: pushSuccess,
        notify: notify
    };
    return service;
}