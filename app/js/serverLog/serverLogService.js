
var serverLogServiceModule = angular.module('serverLogService', ['OWARoutes']);

serverLogServiceModule.service('serverLogService', ['$http', 'OWARoutesUtil', '$q', 'logger',
    function ($http, OWARoutesUtil, $q, logger) {
        return {
            getAllLogs: function () {
                var def = $q.defer();
                var requestUrl = OWARoutesUtil.getOpenmrsUrl() + "/ws/rest/v1/serverlog";
                $http.get(requestUrl, {params: {v: 'full'}})
                    .success(function (data, status) { // GET REQUEST SUCCESS HANDLE
                        def.resolve(["GET", 1, data, status]);
                    }).error(function (data, status) { // GET REQUEST ERROR HANDLE
                    def.resolve(["GET", 0, data, status]);
                });
                return def.promise;
            }
        };
    }]);
