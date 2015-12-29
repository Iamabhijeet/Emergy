'use strict';

var controllerId = 'shellController';

app.controller(controllerId,
    ['vm', '$rootScope', 'authService', 'authData', shellCtrl]);

function shellCtrl($scope, $rootScope, authService, authData) {
    $rootScope.background = 'background-white';
    $rootScope.authData = authData;
}