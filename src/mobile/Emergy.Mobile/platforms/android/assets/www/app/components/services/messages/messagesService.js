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

    var getMessages = function (userId) {
        var deffered = $q.defer();
        $http.post(serviceBase + 'api/messages/get-chats/messages/', JSON.stringify(userId))
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var createMessage = function (message, userId) {
        var deffered = $q.defer();

        var messageModel = {
            Content: message,
            TargetId: userId
        }

        $http.post(serviceBase + 'api/messages/create', messageModel)
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var service = {
        getMessagedUsers: getMessagedUsers, 
        getMessages: getMessages, 
        createMessage: createMessage
    };

    return service;
}