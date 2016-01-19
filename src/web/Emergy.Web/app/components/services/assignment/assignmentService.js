services.factory('assignmentService', assignmentService);

assignmentService.$inject = ['$http', '$q', 'serviceBase'];

function assignmentService($http, $q, serviceBase) {
    var createAssignment = function (reportId, userId) {
        var deffered = $q.defer();

        var createAssignmentVm = {
            ReportId: reportId,
            TargetId: userId
        }

        $http.post(serviceBase + 'api/assignments/create/', createAssignmentVm)
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var getAssignments = function (reportId) {
        var deffered = $q.defer();

        $http.get(serviceBase + 'api/assignments/get/' + reportId)
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var isAssigned = function (userId) {
        var deffered = $q.defer();

        $http.post(serviceBase + 'api/assignments/is-assigned/' + userId)
        .success(function (response) {
            deffered.resolve(response);
        })
            .error(function (response) {
                deffered.reject(response);
            });
        return deffered.promise;
    };

    var service = {
        createAssignment: createAssignment,
        getAssignments: getAssignments,
        isAssigned: isAssigned
    };

    return service;
}