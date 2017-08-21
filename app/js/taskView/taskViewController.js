//
var taskViewControllerModule = angular.module('taskViewController', ['OWARoutes']);

taskViewControllerModule.service('taskViewService',['$http', 'OWARoutesUtil','$q', function ($http, OWARoutesUtil,$q) {
    return {
        getAllTaskDetails: function () {
            var def = $q.defer();
            var requestUrl = OWARoutesUtil.getOpenmrsUrl() + "/ws/rest/v1/taskdefinition";
            $http.get(requestUrl, {params:{ v : 'full', q : 'all'}})
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
            $http.get(requestUrl, {params:{ v : 'full', q : 'all'}})
                .success(function (data, status) { // GET REQUEST SUCCESS HANDLE
                    def.resolve(["GET", 1, data, status]);
                }).error(function (data, status) { // GET REQUEST ERROR HANDLE
                def.resolve(["GET", 0, data, status]);
            });
            return def.promise;
        }

    };
}]);

// SystemInfo Controller used for system-info.html
taskViewControllerModule.controller('taskViewCtrl', ['$scope','$http','OWARoutesUtil','$rootScope', 'taskViewService', function($scope,$http,OWARoutesUtil,$rootScope, taskViewService) {

    // *** /OpenMRS breadcrumbs ***
    $rootScope.$emit("updateBreadCrumb", {breadcrumbs: [["SysAdmin", "#"], ["Task View", ""]]});
    // *** /OpenMRS breadcrumbs ***

    function showLoadingPopUp(){
        $('#loadingModal').show();
        $('#loadingModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        console.log("show popup");
    }
    function hideLoadingPopUp(){
        angular.element('#loadingModal').modal('hide');
        console.log("show popup");
    }

    function alertsClear() {

    }

    $scope.getAllTaskDetails = function(){
        console.log("getAllTaskDetails");
        showLoadingPopUp();
        if(typeof($scope.allTasksData)!=undefined){
            delete $scope.allTasksData;
        }
        if(typeof($scope.requestAllTaskDetails)!=undefined){
            delete $scope.requestAllTaskDetails;
        }
        var response = taskViewService.getAllTaskDetails();
        response.then(function(result){
            responseType=result[0]; //UPLOAD or DOWNLOAD
            responseValue=result[1]; // 1- success | 0 - fail
            responseData=result[2];
            responseStatus=result[3];
            if(responseType=="GET"){
                if(responseValue==1){
                    $scope.requestAllTaskDetails=true;
                    $scope.allTasksData=responseData.results;
                }
                else{
                    console.log("error");
                    $scope.requestAllTaskDetails=false;
                }
            }
            hideLoadingPopUp();
        });
    }

    $scope.unloadConfirmationShow = function(taskUuid, taskName){
        if(typeof($scope.unloadConfirmModuleData)!=undefined){
            delete $scope.unloadConfirmModuleData;
        }
        $scope.unloadConfirmModuleData={
            "uuid" : taskUuid,
            "name":taskName
        }
        angular.element('#deleteConfirmation').modal('show');
    }

    $scope.stopConfirmationShow = function(taskUuid, taskName ){
        if(typeof($scope.stopConfirmModuleData)!=undefined){
            delete $scope.stopConfirmModuleData;
        }
        $scope.stopConfirmModuleData={
            "uuid" : taskUuid,
            "name":taskName
        }
        angular.element('#stopConfirmation').modal('show');
    }

    $scope.unloadTask = function(taskUuid, taskName){
        console.log("Unload taskdefinition");
        showLoadingPopUp();
        if(typeof($scope.isActionStatus)!=undefined){
            delete $scope.isActionStatus;
        }
        var uploadUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/taskaction";
        var moduleData =
            {
                "action": "delete",
                "tasks": [taskName]
            };
        $http.post(uploadUrl, moduleData ,  {
            headers: {'Accept': '*/*;q=0.8'}
        }) .success(function (data, status, headers, config) {
            $scope.isActionStatus=[true, 'Successfully deleted task definition. [Task Definition : ' + taskName + ']'];
            $scope.getAllTaskDetails();
            console.log("unloadTask success");
            hideLoadingPopUp();
        }).error(function (data, status, headers, config) {
            console.log("unloadTask error");
            $scope.isActionStatus=[false, 'Task definition delete failed. [Task Definition : ' + taskName + ']'];
            hideLoadingPopUp();
        });
    }

    $scope.stopTask = function(taskUuid, taskName){
        console.log("stopTask taskdefinition");
        showLoadingPopUp();
        if(typeof($scope.isActionStatus)!=undefined){
            delete $scope.isActionStatus;
        }
        var uploadUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/taskaction";
        var moduleData =
            {
                "action": "shutdowntask",
                "tasks": [taskName]
            };
        $http.post(uploadUrl, moduleData ,  {
            headers: {'Accept': '*/*;q=0.8'}
        }) .success(function (data, status, headers, config) {
            $scope.isActionStatus=[true, 'Task Definition : ' + taskName + ' has been stoped.'];
            $scope.getAllTaskDetails();
            console.log("stopTask success");
            hideLoadingPopUp();
        }).error(function (data, status, headers, config) {
            console.log("stopTask error");
            $scope.isActionStatus=[false, 'Could not shutdown the task. [Task Definition : ' + taskName + ']'];
            hideLoadingPopUp();
        });
    }

    $scope.startTask = function(taskUuid, taskName){
        console.log("startTask taskdefinition");
        showLoadingPopUp();
        if(typeof($scope.isActionStatus)!=undefined){
            delete $scope.isActionStatus;
        }
        var uploadUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/taskaction";
        var moduleData =
            {
                "action": "scheduletask",
                "tasks": [taskName]
            };
        $http.post(uploadUrl, moduleData ,  {
            headers: {'Accept': '*/*;q=0.8'}
        }) .success(function (data, status, headers, config) {
            $scope.isActionStatus=[true, 'Task Definition : ' + taskName + ' has been started.'];
            $scope.getAllTaskDetails();
            console.log("startTask success");
            hideLoadingPopUp();
        }).error(function (data, status, headers, config) {
            console.log("startTask error");
            $scope.isActionStatus=[false, 'Could not schedule the task. [Task Definition : ' + taskName + ']'];
            hideLoadingPopUp();
        });
    }

    $scope.rescheduleTasks = function(taskUuid, taskName){
        console.log("rescheduleTasks taskdefinition");
        showLoadingPopUp();
        if(typeof($scope.isActionStatus)!=undefined){
            delete $scope.isActionStatus;
        }
        var uploadUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/taskaction";
        var moduleData =
            {
                "action": "rescheduletask",
                "tasks": [taskName]
            };
        $http.post(uploadUrl, moduleData ,  {
            headers: {'Accept': '*/*;q=0.8'}
        }) .success(function (data, status, headers, config) {
            $scope.isActionStatus=[true, 'Task Definition : ' + taskName + ' has been re-scheduled.'];
            $scope.getAllTaskDetails();
            console.log("rescheduleTasks success");
            hideLoadingPopUp();
        }).error(function (data, status, headers, config) {
            console.log("rescheduleTasks error");
            $scope.isActionStatus=[false, 'Could not re-schedule the task. [Task Definition : ' + taskName + ']'];
            hideLoadingPopUp();
        });
    }

    $scope.rescheduleAllTasks = function(){
        showLoadingPopUp();
        console.log("rescheduleAllTasks taskdefinition");
        if(typeof($scope.isActionStatus)!=undefined){
            delete $scope.isActionStatus;
        }
        var uploadUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/taskaction";
        var moduleData =
            {
                "action": "reschedulealltask",
                "tasks": []
            };
        $http.post(uploadUrl, moduleData ,  {
            headers: {'Accept': '*/*;q=0.8'}
        }) .success(function (data, status, headers, config) {
            $scope.isActionStatus=[true, 'All tasks have been re-scheduled.'];
            $scope.getAllTaskDetails();
            console.log("rescheduleAllTasks success");
            hideLoadingPopUp();
        }).error(function (data, status, headers, config) {
            console.log("rescheduleAllTasks error");
            $scope.isActionStatus=[false, 'Could not re-schedule the all tasks.'];
            hideLoadingPopUp();
        });
    }

    $scope.shutdownAllTasks = function(){
        showLoadingPopUp();
        console.log("shutdownAllTasks taskdefinition");
        if(typeof($scope.isActionStatus)!=undefined){
            delete $scope.isActionStatus;
        }
        var uploadUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/taskaction";
        var moduleData =
            {
                "action": "onshutdown",
                "tasks": []
            };
        $http.post(uploadUrl, moduleData ,  {
            headers: {'Accept': '*/*;q=0.8'}
        }) .success(function (data, status, headers, config) {
            $scope.isActionStatus=[true, 'All tasks have been shutdown.'];
            $scope.getAllTaskDetails();
            console.log("shutdownAllTasks success");
            hideLoadingPopUp();
        }).error(function (data, status, headers, config) {
            console.log("shutdownAllTasks error");
            $scope.isActionStatus=[false, 'Could not shutdown the all tasks.'];
            hideLoadingPopUp();
        });
    }

    $scope.startOnStartupTasks = function(){
        showLoadingPopUp();
        console.log("startOnStartupTasks taskdefinition");
        if(typeof($scope.isActionStatus)!=undefined){
            delete $scope.isActionStatus;
        }
        var uploadUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/taskaction";
        var moduleData =
            {
                "action": "onstartup",
                "tasks": []
            };
        $http.post(uploadUrl, moduleData ,  {
            headers: {'Accept': '*/*;q=0.8'}
        }) .success(function (data, status, headers, config) {
            $scope.isActionStatus=[true, 'Start up Tasks have been started.'];
            $scope.getAllTaskDetails();
            console.log("startOnStartupTasks success");
            hideLoadingPopUp();
        }).error(function (data, status, headers, config) {
            console.log("startOnStartupTasks error");
            $scope.isActionStatus=[false, 'Could not start the start up tasks.'];
            hideLoadingPopUp();
        });
    }
}]);
