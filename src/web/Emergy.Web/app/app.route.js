app.config(function ($locationProvider,$routeProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider.when("/index", {
        controller: "indexController",
        templateUrl: "/app/views/index/landing.html"
    });

    $routeProvider.otherwise({ redirectTo: "/index" });
  
});