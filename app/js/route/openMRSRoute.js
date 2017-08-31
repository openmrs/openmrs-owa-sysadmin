var OWARoutes = angular.module('OWARoutes', []);

OWARoutes
    .factory('OWARoutesUtil', [function () {
        return {
            /**
             * @returns openmrs server url
             */
            getOpenmrsUrl: function () {
                var location = window.location.toString();
                var serverLocation = location.substring(0, location.indexOf('/owa/')); // http://localhost:8080/openmrs/server1
                var last_string = serverLocation.substring(serverLocation.lastIndexOf('/') + 1, serverLocation.length).toLowerCase(); // server1

                var finallocation = serverLocation;
                var isOpenMRS = last_string.indexOf('openmrs');

                if (isOpenMRS < 0) {
                    finallocation = serverLocation.substring(0, serverLocation.lastIndexOf('/')); // http://localhost:8080/openmrs
                }
                return finallocation;
            }
        }
    }]);