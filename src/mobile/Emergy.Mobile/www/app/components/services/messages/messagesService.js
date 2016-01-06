'use strict';
services.factory('messagesService', messagesService);

messagesService.$inject = ['$http', '$q', 'serviceBase'];

function messagesService($http, $q, serviceBase, authData) {
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