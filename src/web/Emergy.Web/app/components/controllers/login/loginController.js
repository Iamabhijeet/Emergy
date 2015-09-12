'use strict';

var controllerId = 'loginController';

app.controller(controllerId,
    ['$scope', '$rootScope', 'authService', 'authData', loginCtrl]);

function loginCtrl($scope, $rootScope, authService, authData) {
    $rootScope.title = 'Login | Emergy';
    $rootScope.background = 'background-image';


}