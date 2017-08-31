var addNewTaskModule = angular.module('addNewTaskController', ['OWARoutes']);

addNewTaskModule.controller('addNewTaskCtrl', ['$scope', '$http', 'OWARoutesUtil', '$location', '$filter', '$routeParams', 'taskViewService', '$rootScope', 'logger',
    function ($scope, $http, OWARoutesUtil, $location, $filter, $routeParams, taskViewService, $rootScope, logger) {

        $scope.startOnStartup = false;
        $scope.started = false;
        $scope.isAddNewTask = true;
        $scope.taskProperties = [];

        $scope.addNewTaskProperties = function () {
            $scope.taskProperties.push({});
        };

        $scope.removeTaskProperties = function () {
            var lastItem = $scope.taskProperties.length - 1;
            $scope.taskProperties.splice(lastItem);
        };


        $scope.go = function (path) {
            $location.path(path);
        };

        $scope.redirect = function (redirectPage) {
            window.location = redirectPage;
        }

        $scope.initializeAddNewTask = function () {
            console.log($routeParams.classUUID);
            if ($routeParams.classUUID != undefined) {
                // Edit
                $scope.isAddNewTask = false;
                $scope.formProperties = ["Update", "Edit Task"];
                $scope.getTaskDetails($routeParams.classUUID);
                //OpenMRS breadcrumbs
                $rootScope.$emit("updateBreadCrumb", {breadcrumbs: [["SysAdmin", "#"], ["Task View", "#/task-view"], ["Edit Task View", ""]]});
            }
            else {
                // Add New
                $scope.isAddNewTask = true;
                $scope.formProperties = ["Save", "Add New Task"];
                // OpenMRS breadcrumbs
                $rootScope.$emit("updateBreadCrumb", {breadcrumbs: [["SysAdmin", "#"], ["Task View", "#/task-view"], ["Add Task View", ""]]});
            }
        }

        function createPropertyJson(properties) {
            var newJson = {};
            for (var i = 0; i < properties.length; i++) {
                newJson[properties[i]['name']] = properties[i]['value'];
            }
            return newJson;
        }

        function convertJsonToProperties(json) {
            $scope.taskProperties = [];
            angular.forEach(json, function (jsonValue, key) {
                var newJson = {name: key, value: jsonValue};
                $scope.taskProperties.push(newJson);
            });
        }

        $scope.getTaskDetails = function (taskName) {
            if (typeof($scope.requestTaskDetails) != undefined) {
                delete $scope.requestTaskDetails;
            }
            var response = taskViewService.getTaskDetails(taskName);
            response.then(function (result) {
                responseType = result[0]; //UPLOAD or DOWNLOAD
                responseValue = result[1]; // 1- success | 0 - fail
                responseData = result[2];
                responseStatus = result[3];
                if (responseType == "GET") {
                    if (responseValue == 1) {
                        $scope.requestTaskDetails = true;
                        console.log(responseData);
                        console.log(responseData.properties);
                        $scope.taskName = responseData.name;
                        $scope.schedulableClass = responseData.taskClass;
                        $scope.description = responseData.description;
                        $scope.startOnStartup = responseData.startOnStartup;
                        $scope.startTimeVal = responseData.startTime;
                        $scope.repeatInterval = responseData.repeatInterval;
                        $scope.started = responseData.started;
                        $scope.repeatIntervalType = "seconds";
                        convertJsonToProperties(responseData.properties);
                    }
                    else {
                        $scope.requestTaskDetails = false;
                        logger.error("Could not get task details", result[2]);
                    }
                }
            });
        }

        $scope.saveTaskDefinitions = function () {
            if ($scope.isAddNewTask) {
                // New Task
                var uploadUrl = OWARoutesUtil.getOpenmrsUrl() + "/ws/rest/v1/taskdefinition";
            }
            else {
                //update the task
                var uploadUrl = OWARoutesUtil.getOpenmrsUrl() + "/ws/rest/v1/taskdefinition/" + $routeParams.classUUID;
            }
            $scope.SaveNewTaskDefinitions(uploadUrl);
        }

        $scope.SaveNewTaskDefinitions = function (uploadUrl) {
            if (validateAddNewTaskDefinitions()) {
                if (typeof($scope.isValidationError) != undefined) {
                    delete $scope.isValidationError;
                }
                if (typeof($scope.validationErrorMessage) != undefined) {
                    delete $scope.validationErrorMessage;
                }
                var startTime = $filter('date')(new Date($scope.startTimeVal), "yyyy-MM-ddTHH:mm:ss.sssZ", "UTC");

                // change repeat interval to seconds while saving
                var repeatInterval = $scope.repeatInterval;
                if($scope.repeatIntervalType=='minutes'){
                    repeatInterval = repeatInterval*60;
                }
                else if($scope.repeatIntervalType=='hours'){
                    repeatInterval = repeatInterval*60*60;
                }
                else if($scope.repeatIntervalType=='days'){
                    repeatInterval = repeatInterval*60*60*24;
                }

                var moduleData =
                    {
                        "name": $scope.taskName,
                        "taskClass": $scope.schedulableClass,
                        "description": $scope.description,
                        "startOnStartup": $scope.startOnStartup,
                        "startTime": startTime,
                        "repeatInterval": '' + repeatInterval,
                        "properties": createPropertyJson($scope.taskProperties)
                    };
                $http.post(uploadUrl, moduleData, {
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                    }
                }).success(function (data, status, headers, config) {
                    $scope.isValidationError = false;
                    console.log("taskdefinition saved");
                }).error(function (data, status, headers, config) {

                    var x2js = new X2JS();
                    var JsonErrorResponse = x2js.xml_str2json(data);

                    if (JsonErrorResponse["org.openmrs.module.webservices.rest.SimpleObject"].map.hasOwnProperty("org.openmrs.module.webservices.rest.SimpleObject")) {
                        if (JsonErrorResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["org.openmrs.module.webservices.rest.SimpleObject"].map.hasOwnProperty("org.openmrs.module.webservices.rest.SimpleObject")) {
                            // If three level exist
                            if (typeof(JsonErrorResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["org.openmrs.module.webservices.rest.SimpleObject"].map["org.openmrs.module.webservices.rest.SimpleObject"].map.string) != "undefined") {
                                // File Error Catched
                                if ((JsonErrorResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["org.openmrs.module.webservices.rest.SimpleObject"].map["org.openmrs.module.webservices.rest.SimpleObject"].map.string) == "taskClass") {
                                    // Error Message given
                                    $scope.validationErrorMessage = "Incorrect task class found. Please check";
                                }
                                else {
                                    // Unknown Error Message
                                    $scope.validationErrosrMessage = "Could not save the task definition."
                                }
                            }
                            else {
                                //unknown Error
                                $scope.validationErrorMessage = "Could not save the task definition."
                            }
                        } else {
                            //unknown Error
                            $scope.validationErrorMessage = "Could not save the task definition."
                        }
                    } else {
                        if (typeof(JsonErrorResponse["org.openmrs.module.webservices.rest.SimpleObject"].map.string) != "undefined") {
                            // File Error Catched
                            if (typeof(JsonErrorResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["linked-hash-map"].entry[0].string[1]) != "undefined") {
                                var errorResponse = $scope.uploadederrorMsg = JsonErrorResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["linked-hash-map"].entry[0].string[1];
                                if (errorResponse == "[query did not return a unique result: 2]") {
                                    // Task name duplicate
                                    $scope.validationErrorMessage = "Task name is already exist in the system. Could not save the task definition."
                                } else if (errorResponse == "[Some required properties are missing: taskClass]") {
                                    $scope.validationErrorMessage = "Please check the task class. Could not save the task definition."
                                }
                                else {
                                    // Unknown Error Message
                                    $scope.validationErrorMessage = "Could not save the task definition."
                                }
                            }
                            else {
                                // Unknown Error Message
                                $scope.validationErrorMessage = "Could not save the task definition."
                            }
                        }
                        else {
                            //unknown Error
                            $scope.validationErrorMessage = "Could not save the task definition."
                        }
                    }
                    logger.error($scope.validationErrorMessage);
                    $scope.isValidationError = true;
                });
            }
            else {
                $scope.isValidationError = true;
                logger.error("Task modification validation failed");
            }
        }

        function validateAddNewTaskDefinitions() {
            var isValidated = false;
            if ($scope.taskName != null) {
                if ($scope.description != null) {
                    if ($scope.startTimeVal != null) {
                        if ($scope.repeatInterval != null) {
                            isValidated = true;
                        }
                        else {
                            $scope.validationErrorMessage = "Validation failed, Please check repeat interval.";
                        }
                    }
                    else {
                        $scope.validationErrorMessage = "Validation failed, Please check start time.";
                    }
                }
                else {
                    $scope.validationErrorMessage = "Validation failed, Please check description.";
                }
            }
            else {
                $scope.validationErrorMessage = "Validation failed, Please check Task Name.";
            }
            return isValidated;
        }
    }
]);
