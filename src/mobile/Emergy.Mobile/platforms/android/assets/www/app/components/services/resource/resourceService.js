'use strict';
services.factory('resourceService', resourceService);

resourceService.$inject = ['$http', '$q', 'serviceBase', 'authData'];

function resourceService($http, $q, serviceBase, authData) {
    var uploadBlob = function (image) {
        var deffered = $q.defer();
        $http.post(serviceBase + 'api/resources/upload-blob', image)
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var service = {
        uploadBlob: uploadBlob
    };

    return service;
}