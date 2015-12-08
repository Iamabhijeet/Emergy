(function () {
    'use strict';

    function resourcesService($http, serviceBase, Upload, $timeout, $q) {
        function uploadBlob(fileModel, onProgressChanged) {
            var deffered = $q.defer();
            $http.post(serviceBase + 'api/resources/upload-blob', fileModel).then(function (response) {
                $timeout(function () {
                    deffered.resolve(response.data);
                });
            }, function (response) {
                if (response.status > 0) {
                    deffered.reject(response.status + ': ' + response.data.Message);
                }
            }, function (evt) {
                onProgressChanged(parseInt(100.0 * evt.loaded / evt.total));
            });
            return deffered.promise;
        }

        var service = {
            uploadBlob: uploadBlob
        };
        return service;
    }

    services.factory('resourcesService', resourcesService);

    resourcesService.$inject = ['$http', 'serviceBase', 'Upload', '$timeout', '$q'];
})();