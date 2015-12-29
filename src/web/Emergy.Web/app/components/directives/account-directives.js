
directives.directive("passwordVerify", function () {
    return {
        require: "ngModel",
        scope: {
            passwordVerify: '='
        },
        link: function (scope, element, attrs, ctrl) {
            scope.$watch(function () {
                var combined = '';
                if (scope.passwordVerify || ctrl.$viewValue) {
                    combined = scope.passwordVerify + '_' + ctrl.$viewValue;
                }
                return combined;
            }, function (value) {
                if (value) {
                    ctrl.$parsers.unshift(function (viewValue) {
                        var origin = scope.passwordVerify;
                        if (origin !== viewValue) {
                            ctrl.$setValidity("passwordVerify", false);
                            return undefined;
                        } else {
                            ctrl.$setValidity("passwordVerify", true);
                            return viewValue;
                        }
                    });
                }
            });
        }
    };
});

directives.directive('userNameTaken', function (accountService) {
    return {
        scope: {
            userName: "="
        },
        restrict: 'A',
        link: function (scope, element, attributes, controller) {
            scope.$watch(userName, function (value) {
                accountService.isUserNameTaken(value)
                    .then(function (response) {
                        controller.$setValidity("userNameTaken", response.data);
                    });
            });
        }
    };
});

directives.directive('emailTaken', function (accountService) {
    return {
        scope: {
            email: "="
        },
        restrict: 'A',
        link: function (scope, element, attributes, controller) {
            scope.$watch(email, function (value) {
                accountService.isEmailTaken(value)
                    .then(function (response) {
                        controller.$setValidity("emailTaken", response.data);
                    });
            });
        }
    };
});

directives.directive('userNameValid', function () {
    return {
        scope: {
            userName: "="
        },
        restrict: 'A',
        link: function (scope, element, attributes, controller) {
            scope.$watch(userName, function (value) {
                if (value.indexOf('.') > -1) {
                    controller.$setValidity("userNameValid", false);
                } else {
                    controller.$setValidity("userNameValid", true);
                }
            });
        }
    };
});

directives.directive("ngFileSelect", function () {
    return {
        link: function ($scope, el) {
            el.bind("change", function (e) {
                $scope.file = (e.srcElement || e.target).files[0];
                $scope.getFile();
            });
        }
    }
});

directives.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);
