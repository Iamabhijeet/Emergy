'use strict';

var controllerId = 'unitsController';

app.controller(controllerId,
    ['$scope', '$rootScope', 'authService', 'authData', indexCtrl]);

function indexCtrl($scope, $rootScope, authService, authData) {
    $rootScope.title = 'Home';


}