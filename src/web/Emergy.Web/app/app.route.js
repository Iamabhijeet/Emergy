app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true); 

    $stateProvider.state("Landing", {
        url: "/landing",
        controller: "indexController",
        templateUrl: "/views/index/landing.html"
    });
    $stateProvider.state("Register", {
        url: "/register",
        controller: "indexController",
        templateUrl: "/views/index/register.html"
    });

    $urlRouterProvider.otherwise("/landing");

}); 