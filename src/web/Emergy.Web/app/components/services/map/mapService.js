(function () {
    'use strict';

    function mapService($http, $q) {
        var config = {
            searchUrl: 'https://maps.googleapis.com/maps/api/place/textsearch/json?key=AIzaSyD96dv6SVIOtho6kDXvLqsDe2A1D_ZDq28'
        }
        var builders = {
            buildSearch: function (query) {
                return config.searchUrl + query;
            }
        }
        function queryPlaces(query) {
            return $http.get(builders.buildSearch(query));
        }
        function getCurrentLocation() {
            var deffered = $q.defer();
            navigator.geolocation.getCurrentPosition(function (position) { deffered.resolve(position); },
                function (error) { deffered.reject(error); }, { enableHighAccuracy: true });
            return deffered.promise;
        }

        var service = {
            queryPlaces: queryPlaces,
            getCurrentLocation: getCurrentLocation
        };
        return service;
    }

    services.factory('mapService', mapService);

    mapService.$inject = ['$http', '$q'];
})();