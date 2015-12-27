(function () {
    'use strict';

    function mapService($http, $q, $location) {
        var config = {
            searchUrl: 'https://maps.googleapis.com/maps/api/place/textsearch/json?key=AIzaSyD96dv6SVIOtho6kDXvLqsDe2A1D_ZDq28'
        }
        var builders = {
            buildSearch: function (query) {
                return config.searchUrl + query;
            }
        }
     

        function queryPlaces(query, map) {
            var deffered = $q.defer();
            var placesService = new google.maps.places.PlacesService(map);
            placesService.textSearch({ query: query }, function (results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    deffered.resolve(results);
                } else {
                    deffered.reject("Error");
                }
            });
            return deffered.promise;
        }
        function getCurrentLocation() {
            var deffered = $q.defer();
            navigator.geolocation.getCurrentPosition(
                function (position) { deffered.resolve(position); },
                function (error) { deffered.reject(error); },
                { enableHighAccuracy: true });
            return deffered.promise;
        }

        var service = {
            queryPlaces: queryPlaces,
            getCurrentLocation: getCurrentLocation
        };
        return service;
    }

    services.factory('mapService', mapService);

    mapService.$inject = ['$http', '$q', '$location'];
})();