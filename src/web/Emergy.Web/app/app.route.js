app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/landing");

    $stateProvider.state("Landing", {
        url: "/landing",
        controller: "indexController",
        templateUrl: "app/views/index/landing.html"
    })
    .state("Register", {
        url: "/register",
        controller: "indexController",
        templateUrl: "app/views/index/register.html"
    });
}); 