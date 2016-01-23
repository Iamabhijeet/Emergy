services.factory('assignmentService', assignmentService);

assignmentService.$inject = ['$http', '$q', 'serviceBase'];

function assignmentService($http, $q, serviceBase) {
    var getAssignment = function () {
        var deffered = $q.defer();
        $http.get(serviceBase + 'api/assignments/get/')
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var service = {
        getAssignment: getAssignment
    };

    return service;
}