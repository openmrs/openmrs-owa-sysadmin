
var taskViewControllerModule = angular.module('taskViewService', ['OWARoutes']);

taskViewControllerModule.service('taskViewService', ['$http', 'OWARoutesUtil', '$q', 'logger',
    function ($http, OWARoutesUtil, $q, logger) {
        return {
            getAllTaskDetails: function () {
                var def = $q.defer();
                var requestUrl = OWARoutesUtil.getOpenmrsUrl() + "/ws/rest/v1/taskdefinition";
                $http.get(requestUrl, {params: {v: 'full'}})
                    .success(function (data, status) { // GET REQUEST SUCCESS HANDLE
                        def.resolve(["GET", 1, data, status]);
                    }).error(function (data, status) { // GET REQUEST ERROR HANDLE
                    def.resolve(["GET", 0, data, status]);
                });
                return def.promise;
            },

            getTaskDetails: function (taskName) {
                var def = $q.defer();
                var requestUrl = OWARoutesUtil.getOpenmrsUrl() + "/ws/rest/v1/taskdefinition/" + taskName;
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
