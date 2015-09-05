app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/home");

    $stateProvider.state("Login", {
        url: "/login",
        controller: "loginController",
        templateUrl: "app/views/login/login.html"
    });

    $stateProvider.state("Register", {
        url: "/register",
        controller: "registerController",
        templateUrl: "app/views/register/register.html"
    });
    $stateProvider.state("Home", {
        url: "/home", 
        controller: "shellController", 
        templateUrl: "app/views/shell/shell.html"
    });
}); 