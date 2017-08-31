var SearchRepoModule = angular.module('searchModuleService', ['OWARoutes']);

SearchRepoModule.service('SearchModuleService', ['$http', 'OWARoutesUtil', '$q',
    function ($http, OWARoutesUtil, $q) {

        return {
            getSeatchModuleDetails: function (moduleUuid) {
                var def = $q.defer();
                var requestUrl = "https://addons.openmrs.org/api/v1/addon/" + moduleUuid;
                $http.get(requestUrl, {params: {v: 'full'}})
                    .success(function (data, status) { // GET REQUEST SUCCESS HANDLE
                        def.resolve(["GET", 1, data, status]);
                    }).error(function (data, status) { // GET REQUEST ERROR HANDLE
                    def.resolve(["GET", 0, data, status]);
                });
                return def.promise;
            },
            downloadModule: function (requestUrl) {
                var def = $q.defer();

                $http.jsonp(requestUrl, {
                    responseType: "arraybuffer",
                    data: '',
                    dataType: 'jsonp',
                    headers: {'Accept': 'application/zip, */*'}
                })
                    .success(function (data, status) { // GET REQUEST SUCCESS HANDLE
                        def.resolve(["GET", 1, data, status]);
                    }).error(function (data, status) { // GET REQUEST ERROR HANDLE
                    def.resolve(["GET", 0, data, status]);
                });
                return def.promise;
            }
        };
    }]);
