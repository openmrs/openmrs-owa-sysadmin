var SearchRepoModule = angular.module('searchModuleController', ['OWARoutes']);

SearchRepoModule.controller('searchModuleCtrl', ['$scope', '$http', 'OWARoutesUtil', '$rootScope', 'SearchModuleService', '$routeParams', 'logger',
    function ($scope, $http, OWARoutesUtil, $rootScope, SearchModuleService, $routeParams, logger) {

        //OpenMRS breadcrumbs
        $rootScope.$emit("updateBreadCrumb", {breadcrumbs: [["SysAdmin", "#"], ["Modules", "#/module-show"], ["Search Module", ""]]});

        $scope.modules = [];
        $scope.searchText = null;

        function showLoadingPopUp() {
            $('#loadingModal').show();
            $('#loadingModal').modal({
                backdrop: 'static',
                keyboard: false
            });
        }

        function hideLoadingPopUp() {
            angular.element('#loadingModal').modal('hide');
        }

        function alertsClear() {
            if (typeof($scope.downloadErrorMsg) != undefined) {
                delete $scope.downloadErrorMsg;
            }
            if (typeof($scope.downloadSuccessMsg) != undefined) {
                delete $scope.downloadSuccessMsg;
            }

            if (typeof($scope.startuperrorMsg) != undefined) {
                delete $scope.startuperrorMsg;
            }
            if (typeof($scope.startupsuccessMsg) != undefined) {
                delete $scope.startupsuccessMsg;
            }
            if (typeof($scope.uplodedsuccessMsg) != undefined) {
                delete $scope.uplodedsuccessMsg;
            }
            if (typeof($scope.uploadederrorMsg) != undefined) {
                delete $scope.uploadederrorMsg;
            }
            if (typeof($scope.isSearching) != undefined) {
                delete $scope.isSearching;
            }
        }

        $scope.change = function () {
            // clear all alerts $scope variables
            alertsClear();
            $scope.moduleFound = false;
            $scope.isSearching = true;
            $scope.modules = [];
            var searchValue = $scope.searchText.toLowerCase();
            var requestUrl = "https://addons.openmrs.org/api/v1//addon?&q=" + searchValue;
            if (searchValue) {
                $http.get(requestUrl, {})
                    .success(function (data, status) { // GET REQUEST SUCCESS HANDLE
                        if (data.length > 0) {
                            // Modules Found
                            $scope.moduleFound = true;
                            $scope.modules = data;
                        }
                        else {
                            // No Modules Found
                            $scope.moduleFound = false;
                        }
                        $scope.isSearching = false;
                    }).error(function (data, status) { // GET REQUEST ERROR HANDLE
                    logger.error("Could not perform search action through the AddOns REST API", data);
                });
            }
            else {
                // Search text empty
                $scope.isSearching = false;
                $scope.moduleFound = false;
            }

        }

        $scope.getSearchModuleDetails = function () {
            //OpenMRS breadcrumbs
            $rootScope.$emit("updateBreadCrumb", {breadcrumbs: [["SysAdmin", "#"], ["Modules", "#/module-show"], ["Search Module", "#/view-search"], ["Module Information", ""]]});

            if (typeof($scope.nonInstalledModuleDetails) != undefined) {
                delete $scope.nonInstalledModuleDetails;
            }
            if (typeof($scope.onlineDataFound) != undefined) {
                delete $scope.onlineDataFound;
            }
            showLoadingPopUp(); // Show loadingPop to prevent other Actions
            var moduleUuid = $routeParams.UUID;
            console.log(moduleUuid);
            var responseModuleDetails = SearchModuleService.getSeatchModuleDetails(moduleUuid);
            responseModuleDetails.then(function (resultModule) {
                if (resultModule[0] == "GET") {
                    if (resultModule[1] == 1) {
                        $scope.onlineDataFound = true;
                        $scope.nonInstalledModuleDetails = resultModule[2];
                    } else {
                        $scope.onlineDataFound = false;
                        logger.error("Could not find the searched module information", resultModule[2]);
                    }
                    hideLoadingPopUp() // hide the loading Popup
                }
            });
        }

        $scope.downloadAndUpdateModule = function (moduleUrl) {
            $scope.isDownloading = true;
            alertsClear();
            showLoadingPopUp();
            var fd = new FormData();
            // Getting last value with download_file?file_path=xyz
            var filename = moduleUrl.replace(/^.*[\\\/]/, '');
            filename = filename.replace("download_file?file_path=", '');
            moduleUrl = "https://dl.bintray.com/openmrs/omod/" + filename + '?json_callback=JSON_CALLBACK';
            // moduleUrl = "https://modules.openmrs.org/modulus/api/releases/1546/download/"+ filename;

            $http.jsonp(moduleUrl, {
                responseType: "arraybuffer",
                headers: {
                    'X-Requested-With': 'https://bintray.com/openmrs/omod/accesslogging'
                }
            }).success(function (data) { // GET REQUEST ERROR HANDLE
                var filename = moduleUrl.substring(moduleUrl.lastIndexOf('/') + 1);
                let blob = new Blob([data], {type: 'application/octet-stream'});
                var url = (window.URL).createObjectURL(blob);
                var file = new File([data], filename, {
                    type: "application/octet-stream",
                    lastModified: new Date().getTime()
                });
                fd.append('file', file);

                $scope.isDownloading = false;
                $scope.downloadSuccessMsg = "Module Download Completed";
                var uploadUrl = OWARoutesUtil.getOpenmrsUrl() + "/ws/rest/v1/module/?";
                $scope.isUploading = true;
                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                    }
                }).success(function (data, status, headers, config) {  // POST REQUEST ERROR HANDLE
                    $scope.isUploading = false;
                    var x2js = new X2JS();
                    var JsonSuccessResponse = x2js.xml_str2json(data);

                    var moduleName = JsonSuccessResponse["org.openmrs.module.Module"].name;
                    $scope.uplodedsuccessMsg = moduleName + " has been loaded"
                    $scope.responseJsonData = JsonSuccessResponse;

                    if (typeof(JsonSuccessResponse["org.openmrs.module.Module"].startupErrorMessage) == "undefined") {
                        // Started Successfully
                        $scope.startupsuccessMsg = moduleName + " has been loaded and started Successfully"
                    }
                    else {
                        //start up Error Found
                        $scope.startuperrorMsg = "Could not start " + moduleName + " Module."
                    }
                    hideLoadingPopUp();
                }).error(function (data, status, header, config) { // POST REQUEST ERROR HANDLE
                    $scope.isUploading = false;
                    var x2js = new X2JS();
                    var JsonErrorResponse = x2js.xml_str2json(data);
                    if (typeof(JsonErrorResponse["org.openmrs.module.webservices.rest.SimpleObject"].map.string) != "undefined") {
                        // File Error Catched
                        if (typeof(JsonErrorResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["linked-hash-map"].entry[0].string[1]) != "undefined") {
                            // Error Message given
                            $scope.uploadederrorMsg = JsonErrorResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["linked-hash-map"].entry[0].string[1];
                        }
                        else {
                            // Unknown Error Message
                            $scope.uploadederrorMsg = "Error loading module, no config.xml file found"
                        }
                    }
                    else {
                        //unknown Error
                        $scope.uploadederrorMsg = "Error loading module!"
                    }
                    hideLoadingPopUp();
                    logger.error($scope.uploadederrorMsg, data);
                });
            }).error(function (data) { // GET REQUEST ERROR HANDLE
                $scope.isDownloading = false;
                $scope.downloadErrorMsg = "Could not download the Module";
                hideLoadingPopUp();
                logger.error($scope.downloadErrorMsg, data);
            });
        };
    }]);



    