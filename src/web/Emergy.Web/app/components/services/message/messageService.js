services.factory('messageService', messageService);

messageService.$inject = ['$http', '$q', 'serviceBase'];

function messageService($http, $q, serviceBase) {
    var getMessagedUsers = function () {
        var deffered = $q.defer();
        $http.get(serviceBase + 'api/messages/get-chats/users')
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var service = {
        getMessagedUsers: getMessagedUsers
    };

    return service;
}