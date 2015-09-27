app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/landing");

    $stateProvider.state("Landing", {
        url: "/landing",
        controller: "landingController",
        templateUrl: "app/views/landing.html"
    });

    $stateProvider.state("Login", {
        url: "/account/login",
        controller: "loginController",
        templateUrl: "app/views/login/login.html"
    });

    $stateProvider.state("Register", {
        url: "/account/register",
        controller: "registerController",
        templateUrl: "app/views/register/register.html"
    });
    $stateProvider.state("Home", {
        url: "/home", 
        controller: "shellController", 
        templateUrl: "app/views/shell/shell.html"
    });
}); 