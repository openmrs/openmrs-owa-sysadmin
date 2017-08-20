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

    $scope.getAllTaskDetails = function(){
        console.log("getAllTaskDetails");
        $scope.requestAllTaskDetails=false;
        if(typeof($scope.allTasksData)!=undefined){
            delete $scope.allTasksData;
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
                    $scope.allTasksData=false;
                }
            }
        });
    }

    $scope.unloadConfirmationShow = function(taskName, taskUuid){
        if(typeof($scope.uploadConfirmModuleData)!=undefined){
            delete $scope.uploadConfirmModuleData;
        }
        $scope.uploadConfirmModuleData={
            "uuid" : taskUuid,
            "name":taskName
        }
        angular.element('#deleteConfirmation').modal('show');
    }

    $scope.unloadModule = function(taskUuid, taskName){
        console.log("Unload taskdefinition");
        if(typeof($scope.isDeletedTaskDefinition)!=undefined){
            delete $scope.isDeletedTaskDefinition;
        }
        var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/taskdefinition/"+taskName;
        $http.delete(requestUrl, {params : {purge : 'true'}})
            .success(function (data){ // GET REQUEST ERROR HANDLE
                $scope.isDeletedTaskDefinition=[true, taskName];
                $scope.getAllTaskDetails();
                console.log("deleted");
            }).error(function (data){ // GET REQUEST ERROR HANDLE
                console.log("error");
                $scope.isDeletedTaskDefinition=[false, taskName];
        });
    }

}]);
