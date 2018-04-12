var manageModuleService = angular.module('manageModuleService', ['OWARoutes']);

manageModuleService.service('ModuleService', ['$http', 'OWARoutesUtil', '$q', 'logger',
    function ($http, OWARoutesUtil, $q, logger) {

        return {
            uploadModules: function (moduleUrl) {
                var def = $q.defer();

                var fd = new FormData();
                $http.get(moduleUrl, {responseType: "arraybuffer"})
                    .success(function (data) { // GET REQUEST ERROR HANDLE
                        var filename = moduleUrl.substring(moduleUrl.lastIndexOf('/') + 1);
                        let blob = new Blob([data], {type: 'application/octet-stream'});
                        var url = (window.URL).createObjectURL(blob);
                        var file = new File([data], filename, {
                            type: "application/octet-stream",
                            lastModified: new Date().getTime()
                        });
                        fd.append('file', file);

                        var uploadUrl = OWARoutesUtil.getOpenmrsUrl() + "/ws/rest/v1/module/?"; //CHANGE
                        isUploading = true;

                        $http.post(uploadUrl, fd, {
                            transformRequest: angular.identity,
                            headers: {
                                'Content-Type': undefined,
                                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                            }
                        }).success(function (data, status, headers, config) {  // POST REQUEST ERROR HANDLE
                            def.resolve(["UPLOAD", 1, data, status]);
                        }).error(function (data, status, header, config) { // POST REQUEST ERROR HANDLE
                            def.resolve(["UPLOAD", 0, data, status]);
                        });
                    }).error(function (data, status) { // GET REQUEST ERROR HANDLE
                    def.resolve(["DOWNLOAD", 0, data, status]);
                });
                return def.promise;
            },
            getModuleDetails: function (moduleUuid) {
                var def = $q.defer();
                var requestUrl = OWARoutesUtil.getOpenmrsUrl() + "/ws/rest/v1/module/" + moduleUuid;
                $http.get(requestUrl, {params: {v: 'full'}})
                    .success(function (data, status) { // GET REQUEST SUCCESS HANDLE
                        def.resolve(["GET", 1, data, status]);
                    }).error(function (data, status) { // GET REQUEST ERROR HANDLE
                    def.resolve(["GET", 0, data, status]);
                });
                return def.promise;
            },

            getModuleDetailsFromOnline: function (modulePackageName) {
                var def = $q.defer();
                var requestUrl = "https://addons.openmrs.org/api/v1/addon?&modulePackage=" + modulePackageName;
                //var requestUrl = "https://addons-stg.openmrs.org/api/v1/addon/"+modulePackageName;
                $http.get(requestUrl, {})
                    .success(function (data, status) { // GET REQUEST SUCCESS HANDLE
                        def.resolve(["GET", 1, data, status]);
                    }).error(function (data, status) { // GET REQUEST ERROR HANDLE
                    def.resolve(["GET", 0, data, status]);
                });
                return def.promise;
            },

            getAllModuleDetails: function () {
                var def = $q.defer();
                var requestUrl = OWARoutesUtil.getOpenmrsUrl() + "/ws/rest/v1/module";
                $http.get(requestUrl, {params: {v: 'full'}})
                    .success(function (data, status) { // GET REQUEST SUCCESS HANDLE
                        def.resolve(["GET", 1, data, status]);
                    }).error(function (data, status) { // GET REQUEST ERROR HANDLE
                    // changed DOWNLOAD to GET ********************
                    def.resolve(["GET", 0, data, status]);
                });
                return def.promise;
            },

            checkModuleUpdate: function (modulePackageName) {
                var def = $q.defer();
                var requestUrl = "https://addons.openmrs.org/api/v1/addon?&modulePackage=" + modulePackageName;

                $http.get(requestUrl, {})
                    .success(function (data, status) { // GET REQUEST SUCCESS HANDLE
                        def.resolve(["GET", 1, data, status]);
                    }).error(function (data, status) { // GET REQUEST ERROR HANDLE
                    def.resolve(["GET", 0, data, status]);
                });
                return def.promise;
            },
        };
    }]);
