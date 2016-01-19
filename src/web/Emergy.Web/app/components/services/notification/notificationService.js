services.factory('notificationService', notificationService);

notificationService.$inject = ['$http', '$q', 'serviceBase'];

function notificationService($http, $q, serviceBase) {
    var createNotification = function (notification) {
        var deffered = $q.defer();
        $http.post(serviceBase + 'api/notifications/create', notification)
        .success(function (notification) {
            deffered.resolve(notification);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var getNotifications = function (lastDateTime) {
        var deffered;

        if (lastDateTime) {
            deffered = $q.defer();
            $http.post(serviceBase + 'api/notifications/get-latest/', JSON.stringify(lastDateTime))
            .success(function (response) {
                deffered.resolve(response);
            })
                .error(function (response) {
                    deffered.reject(response);
                });
            return deffered.promise;
        }

        deffered = $q.defer();
        $http.get(serviceBase + 'api/notifications/get-latest/')
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var getNotification = function (notificationId) {
        var deffered = $q.defer();
        $http.post(serviceBase + 'api/notifications/get/' + notificationId)
        .success(function (response) {
            deffered.resolve(response);
        })
        .error(function (response) {
            deffered.reject(response);
         });
        return deffered.promise;
    };

    function pushError(error) {
        var errorString = 'Unknown error! :(';
        if (error !== null) {
            errorString = error;
        }
        Materialize.toast(errorString, 2500);    
    }
    function pushSuccess(message) {
        Materialize.toast(message, 10000);
    }
    function notify(message) {
        // will be implemented
    }

    var service = {
        createNotification: createNotification, 
        pushError: pushError,
        pushSuccess: pushSuccess,
        notify: notify,
        getNotifications: getNotifications,
        getNotification: getNotification
    };
    return service;
}