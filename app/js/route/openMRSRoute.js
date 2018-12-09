var OWARoutes = angular.module('OWARoutes', []);

OWARoutes
    .factory('OWARoutesUtil', [function () {
        return {
            /**
             * @returns openmrs server url
             */
            getOpenmrsUrl: function () {
                var location = window.location.toString();
                var serverLocation = location.substring(0, location.indexOf('/owa/')); // http://localhost:8080/openmrs
                return serverLocation;
            }
        }
    }]);