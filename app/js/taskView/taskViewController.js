//
var taskViewControllerModule = angular.module('taskViewController', ['OWARoutes']);

// SystemInfo Controller used for system-info.html
taskViewControllerModule.controller('taskViewCtrl', ['$scope', '$http', 'OWARoutesUtil', '$rootScope', 'taskViewService','logger',
    function ($scope, $http, OWARoutesUtil, $rootScope, taskViewService, logger) {

    // OpenMRS breadcrumbs
    $rootScope.$emit("updateBreadCrumb", {breadcrumbs: [["SysAdmin", "#"], ["Task View", ""]]});

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

    $scope.getAllTaskDetails = function () {
        showLoadingPopUp();
        if (typeof($scope.allTasksData) != undefined) {
            delete $scope.allTasksData;
        }
        if (typeof($scope.requestAllTaskDetails) != undefined) {
            delete $scope.requestAllTaskDetails;
        }
        if (typeof($scope.isActionStatus) != undefined) {
            delete $scope.isActionStatus;
        }
        var response = taskViewService.getAllTaskDetails();
        response.then(function (result) {
            responseType = result[0]; //UPLOAD or DOWNLOAD
            responseValue = result[1]; // 1- success | 0 - fail
            responseData = result[2];
            responseStatus = result[3];
            if (responseType == "GET") {
                if (responseValue == 1) {
                    $scope.requestAllTaskDetails = true;
                    $scope.allTasksData = responseData.results;
                }
                else {
                    $scope.requestAllTaskDetails = false;
                    logger.error("Could not get all task details", responseData);
                }
            }
            hideLoadingPopUp();
        });
    }

    $scope.unloadConfirmationShow = function (taskUuid, taskName) {
        if (typeof($scope.unloadConfirmModuleData) != undefined) {
            delete $scope.unloadConfirmModuleData;
        }
        $scope.unloadConfirmModuleData = {
            "uuid": taskUuid,
            "name": taskName
        }
        angular.element('#deleteConfirmation').modal('show');
    }

    $scope.stopConfirmationShow = function (taskUuid, taskName) {
        if (typeof($scope.stopConfirmModuleData) != undefined) {
            delete $scope.stopConfirmModuleData;
        }
        $scope.stopConfirmModuleData = {
            "uuid": taskUuid,
            "name": taskName
        }
        angular.element('#stopConfirmation').modal('show');
    }

    $scope.unloadTask = function (taskUuid, taskName) {
        showLoadingPopUp();
        if (typeof($scope.isActionStatus) != undefined) {
            delete $scope.isActionStatus;
        }
        var uploadUrl = OWARoutesUtil.getOpenmrsUrl() + "/ws/rest/v1/taskaction";
        var moduleData =
            {
                "action": "delete",
                "tasks": [taskName]
            };
        $http.post(uploadUrl, moduleData, {
            headers: {'Accept': '*/*;q=0.8'}
        }).success(function (data, status, headers, config) {
            $scope.isActionStatus = [true, 'Successfully deleted task definition. [Task Definition : ' + taskName + ']'];
            $scope.getAllTaskDetails();
            hideLoadingPopUp();
        }).error(function (data, status, headers, config) {
            $scope.isActionStatus = [false, 'Task definition delete failed. [Task Definition : ' + taskName + ']'];
            hideLoadingPopUp();
            logger.error("Task definition delete failed. [Task Definition : " + taskName + "]", data);
        });
    }

    $scope.stopTask = function (taskUuid, taskName) {
        showLoadingPopUp();
        if (typeof($scope.isActionStatus) != undefined) {
            delete $scope.isActionStatus;
        }
        var uploadUrl = OWARoutesUtil.getOpenmrsUrl() + "/ws/rest/v1/taskaction";
        var moduleData =
            {
                "action": "shutdowntask",
                "tasks": [taskName]
            };
        $http.post(uploadUrl, moduleData, {
            headers: {'Accept': '*/*;q=0.8'}
        }).success(function (data, status, headers, config) {
            $scope.isActionStatus = [true, 'Task Definition : ' + taskName + ' has been stoped.'];
            $scope.getAllTaskDetails();
            hideLoadingPopUp();
        }).error(function (data, status, headers, config) {
            console.log("stopTask error");
            $scope.isActionStatus = [false, 'Could not shutdown the task. [Task Definition : ' + taskName + ']'];
            hideLoadingPopUp();
            logger.error("Could not shutdown the task.[Task Definition : " + taskName + "]", data);
        });
    }

    $scope.startTask = function (taskUuid, taskName) {
        showLoadingPopUp();
        if (typeof($scope.isActionStatus) != undefined) {
            delete $scope.isActionStatus;
        }
        var uploadUrl = OWARoutesUtil.getOpenmrsUrl() + "/ws/rest/v1/taskaction";
        var moduleData =
            {
                "action": "scheduletask",
                "tasks": [taskName]
            };
        $http.post(uploadUrl, moduleData, {
            headers: {'Accept': '*/*;q=0.8'}
        }).success(function (data, status, headers, config) {
            $scope.isActionStatus = [true, 'Task Definition : ' + taskName + ' has been started.'];
            $scope.getAllTaskDetails();
            hideLoadingPopUp();
        }).error(function (data, status, headers, config) {
            $scope.isActionStatus = [false, 'Could not schedule the task. [Task Definition : ' + taskName + ']'];
            hideLoadingPopUp();
            logger.error("Could not schedule the task.[Task Definition : " + taskName + "]", data);
        });
    }

    $scope.rescheduleTasks = function (taskUuid, taskName) {
        showLoadingPopUp();
        if (typeof($scope.isActionStatus) != undefined) {
            delete $scope.isActionStatus;
        }
        var uploadUrl = OWARoutesUtil.getOpenmrsUrl() + "/ws/rest/v1/taskaction";
        var moduleData =
            {
                "action": "rescheduletask",
                "tasks": [taskName]
            };
        $http.post(uploadUrl, moduleData, {
            headers: {'Accept': '*/*;q=0.8'}
        }).success(function (data, status, headers, config) {
            $scope.isActionStatus = [true, 'Task Definition : ' + taskName + ' has been re-scheduled.'];
            $scope.getAllTaskDetails();
            hideLoadingPopUp();
        }).error(function (data, status, headers, config) {
            $scope.isActionStatus = [false, 'Could not re-schedule the task. [Task Definition : ' + taskName + ']'];
            hideLoadingPopUp();
            logger.error("Could not re-schedule the task.[Task Definition : " + taskName + "]", data);
        });
    }

    $scope.rescheduleAllTasks = function () {
        showLoadingPopUp();
        if (typeof($scope.isActionStatus) != undefined) {
            delete $scope.isActionStatus;
        }
        var uploadUrl = OWARoutesUtil.getOpenmrsUrl() + "/ws/rest/v1/taskaction";
        var moduleData =
            {
                "action": "reschedulealltask",
                "tasks": []
            };
        $http.post(uploadUrl, moduleData, {
            headers: {'Accept': '*/*;q=0.8'}
        }).success(function (data, status, headers, config) {
            $scope.isActionStatus = [true, 'All tasks have been re-scheduled.'];
            $scope.getAllTaskDetails();
            hideLoadingPopUp();
        }).error(function (data, status, headers, config) {
            $scope.isActionStatus = [false, 'Could not re-schedule all the tasks.'];
            hideLoadingPopUp();
            logger.error("Could not re-schedule all the task.", data);
        });
    }

    $scope.shutdownAllTasks = function () {
        showLoadingPopUp();
        if (typeof($scope.isActionStatus) != undefined) {
            delete $scope.isActionStatus;
        }
        var uploadUrl = OWARoutesUtil.getOpenmrsUrl() + "/ws/rest/v1/taskaction";
        var moduleData =
            {
                "action": "onshutdown",
                "tasks": []
            };
        $http.post(uploadUrl, moduleData, {
            headers: {'Accept': '*/*;q=0.8'}
        }).success(function (data, status, headers, config) {
            $scope.isActionStatus = [true, 'All tasks have been shutdown.'];
            $scope.getAllTaskDetails();
            hideLoadingPopUp();
        }).error(function (data, status, headers, config) {
            $scope.isActionStatus = [false, 'Could not shutdown the all tasks.'];
            hideLoadingPopUp();
            logger.error("Could not shutdown the task.[Task Definition : " + taskName + "]", data);
        });
    }

    $scope.startOnStartupTasks = function () {
        showLoadingPopUp();
        if (typeof($scope.isActionStatus) != undefined) {
            delete $scope.isActionStatus;
        }
        var uploadUrl = OWARoutesUtil.getOpenmrsUrl() + "/ws/rest/v1/taskaction";
        var moduleData =
            {
                "action": "onstartup",
                "tasks": []
            };
        $http.post(uploadUrl, moduleData, {
            headers: {'Accept': '*/*;q=0.8'}
        }).success(function (data, status, headers, config) {
            $scope.isActionStatus = [true, 'Start up Tasks have been started.'];
            $scope.getAllTaskDetails();
            hideLoadingPopUp();
        }).error(function (data, status, headers, config) {
            $scope.isActionStatus = [false, 'Could not start the start up tasks.'];
            hideLoadingPopUp();
            logger.error("Could not start up the task.[Task Definitions : " + taskName + "]", data);
        });
    }
}]);
