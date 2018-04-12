var updateModule = angular.module('ModuleService', ['OWARoutes']);

updateModule.service('updateModuleService', ['$scope', '$http', 'OWARoutesUtil', '$q', function ($scope, $http, OWARoutesUtil,$q) {
    //var property = 'First';
    var isDownloading = true;
    var downloadSuccessMsg = '';
    var downloadErrorMsg = '';
    var isUploading = true;
    var uplodedsuccessMsg = '';
    var uploadederrorMsg = '';
    var startupsuccessMsg = '';
    var startuperrorMsg = '';
    var responseJsonData = null;

    return {
        updateAndInstallModule: function (moduleUrl) {
            isDownloading = true;
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
                    isDownloading = false;
                    downloadSuccessMsg = "Module Download Completed";

                    console.log("POST started...");
                    // var uploadUrl = OWARoutesUtil.getOpenmrsUrl() + "/ws/rest/v1/module/?";

                    isUploading = true;

                    $http.post(uploadUrl, fd, {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined,
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                        }
                    }).success(function (data, status, headers, config) {  // POST REQUEST ERROR HANDLE
                        console.log("UPLOAD - Sucess.");
                        isUploading = false;
                        var x2js = new X2JS();
                        var JsonSuccessResponse = x2js.xml_str2json(data);
                        var moduleName = JsonSuccessResponse["org.openmrs.module.Module"].name;
                        uplodedsuccessMsg = moduleName + " has been loaded"
                        responseJsonData = JsonSuccessResponse;
                        if (typeof(JsonSuccessResponse["org.openmrs.module.Module"].startupErrorMessage) == "undefined") {
                            // Started Successfully
                            startupsuccessMsg = moduleName + " has been loaded and started Successfully"
                        }
                        else {
                            //start up Error Found
                            startuperrorMsg = "Could not start " + moduleName + " Module."
                        }
                        var returnArray = [[isDownloading, downloadSuccessMsg, downloadErrorMsg], [isUploading, uplodedsuccessMsg, uploadederrorMsg], [startupsuccessMsg, startuperrorMsg], [responseJsonData]];
                        def.resolve(returnArray);
                    })
                        .error(function (data, status, header, config) { // POST REQUEST ERROR HANDLE
                            console.log("UPLOAD - Error.");
                            isUploading = false;
                            var x2js = new X2JS();
                            var JsonErrorResponse = x2js.xml_str2json(data);
                            if (typeof(JsonErrorResponse["org.openmrs.module.webservices.rest.SimpleObject"].map.string) != "undefined") {
                                // File Error Catched
                                if (typeof(JsonErrorResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["linked-hash-map"].entry[0].string[1]) != "undefined") {
                                    // Error Message given
                                    uploadederrorMsg = JsonErrorResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["linked-hash-map"].entry[0].string[1];
                                }
                                else {
                                    // Unknown Error Message
                                    uploadederrorMsg = "Error loading module, no config.xml file found"
                                }
                            }
                            else {
                                //unknown Error
                                uploadederrorMsg = "Error loading module!"
                            }
                            var returnArray = [[isDownloading, downloadSuccessMsg, downloadErrorMsg], [isUploading, uplodedsuccessMsg, uploadederrorMsg], [startupsuccessMsg, startuperrorMsg], [responseJsonData]];
                            def.resolve(returnArray);
                        });
                }).error(function (data) { // GET REQUEST ERROR HANDLE
                isDownloading = false;
                downloadErrorMsg = "Could not download the Module";
                var returnArray = [[isDownloading, downloadSuccessMsg, downloadErrorMsg], [isUploading, uplodedsuccessMsg, uploadederrorMsg], [startupsuccessMsg, startuperrorMsg], [responseJsonData]];
                def.resolve(returnArray);
            });

            // var returnArray = [[isDownloading, downloadSuccessMsg, downloadErrorMsg], [isUploading, uplodedsuccessMsg, uploadederrorMsg], [startupsuccessMsg, startuperrorMsg], [responseJsonData]];
            // return returnArray;
            return def.promise;
        },
        getProperty: function () {
            return 'a';
        }
    };

}]);