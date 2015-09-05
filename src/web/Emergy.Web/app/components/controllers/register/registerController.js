'use strict';

var controllerId = 'registerController';

app.controller(controllerId,
    ['$scope', '$rootScope', 'authService', 'authData', registerCtrl]);

function registerCtrl($scope, $rootScope, authService, authData) {
    $rootScope.title = 'Emergy | Register';


}