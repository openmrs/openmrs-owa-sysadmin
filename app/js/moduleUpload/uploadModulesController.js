var uploadModule = angular.module('uploadModuleController', ['OWARoutes']);

uploadModule.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function () {
                if (element[0].files[0]) {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                }
            });
        }
    };
}]);


uploadModule.controller('uploadModuleCtrl', ['$scope', '$http', 'OWARoutesUtil', '$rootScope', 'logger', 'commonUtil',
    function ($scope, $http, OWARoutesUtil, $rootScope, logger, commonUtil) {

        // OpenMRS breadcrumbs
        $rootScope.$emit("updateBreadCrumb", {breadcrumbs: [["SysAdmin", "#"], ["Modules", "#/module-show"], ["Upload Module", ""]]});

        $scope.PostDataResponse = '';
        $scope.ResponseDetails = '';

        function showLoadingPopUp() {
            $('#loadingModal').show();
            $('#loadingModal').modal({
                backdrop: 'static',
                keyboard: false
            });
        }

        // used to track the Web Admin access property
        $scope.doesWebAdminAllowToChangeModules = false;

        runModuleViewStartUpActions();
        function runModuleViewStartUpActions() {
            var response = commonUtil.checkWebAdminPropertyForUserAccess();
            response.then(function (result) {
                setWebAdminPropertyForUserAccess(result);
                if(!getWebAdminAllowToChangeModules()) {
                    logger.error("You don't have the permission to perform the action on this page. Module Management privilege required", "");
                    window.location = "index.html#/module-show/";
                    return;  
                }
            });
        }

        function setWebAdminPropertyForUserAccess(webAdminProperty) {
            $scope.doesWebAdminAllowToChangeModules = webAdminProperty;
        }

        function getWebAdminAllowToChangeModules() {
            return $scope.doesWebAdminAllowToChangeModules;
        }

        function hideLoadingPopUp() {
            angular.element('#loadingModal').modal('hide');
        }

        function alertsClear() {
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
        }

        $scope.removeFile = function () {
            var output = document.getElementById("dragAndDropOutput");
            output.innerHTML = 'Drag files here or click to upload';
            $('#uploadButton').prop('disabled', true);
            $('#removeButton').hide();
            alertsClear();
        }

        $scope.uploadFile = function () {
            if(!getWebAdminAllowToChangeModules()) {
                logger.error("You don't have the permission to perform the action on this page. Module Management privilege required", "");
                window.location = "index.html#/module-show/";
                return;  
            }
            alertsClear(); // clear all alerts $scope variables
            showLoadingPopUp(); // Show loadingPop to prevent other Actions

            var file = $scope.myFile;
            var uploadUrl = OWARoutesUtil.getOpenmrsUrl() + "/ws/rest/v1/module/?";
            var fd = new FormData();
            fd.append('file', file);
            $scope.isUploading = true;

            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                }
            }).success(function (data, status, headers, config) {

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
            }).error(function (data, status, header, config) {
                //console.log("err");
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
                logger.error($scope.uploadederrorMsg, data);
                hideLoadingPopUp();
            });
        };
    }]);
