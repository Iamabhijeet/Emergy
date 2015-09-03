app.config(function ($locationProvider,$routeProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider.when("/index", {
        controller: "indexController",
        templateUrl: "/app/views/index/landing.html"
    });
    $routeProvider.when("/register", {
        controller: "indexController",
        templateUrl: "/app/views/index/register.html"
    }); 

    $routeProvider.otherwise({ redirectTo: "/index" });  
});