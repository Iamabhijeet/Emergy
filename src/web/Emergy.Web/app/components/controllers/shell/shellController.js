﻿'use strict';

var controllerId = 'shellController';

app.controller(controllerId,
    ['$scope', '$rootScope', 'authService', 'authData', shellCtrl]);

function shellCtrl($scope, $rootScope, authService, authData) {
    $rootScope.background = 'background-white';
    $rootScope.authData = authData;

    $rootScope.logout = function() {
        authService.logout();
    };
}