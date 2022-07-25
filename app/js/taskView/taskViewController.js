var taskViewControllerModule = angular.module('taskViewController', ['OWARoutes']);

taskViewControllerModule.controller('taskViewCtrl', ['$scope', '$http', 'OWARoutesUtil', '$rootScope', 'taskViewService','logger',
function ($scope, $http, OWARoutesUtil, $rootScope, taskViewService, logger) {

    const UUID_PARAM = "uuid";
    const NAME_PARAM = "name";
    const START_TIME_PARAM = "startTime";
    
    $scope.tasksPerPage = 3;
    $scope.taskSearchText = null;
    $scope.slicedTaskTable = null;
    $scope.data = {
        model: null,
        availableOptions: [
          {id: 'defaultOption', name: '--Choose--'},
          {id: 'newestToOldest', name: 'Newest to Oldest'},
          {id: 'oldestToNewest', name: 'Oldest to Newest'}
        ]
    };
    $scope.withoutLastExecutionCheckbox = {
        status: false
    };
    $scope.takeTaskCheckbox = {
        status: false
    };
    $scope.checkedTasks = [];

    $rootScope.$emit("updateBreadCrumb", {breadcrumbs: [["SysAdmin", "#"], ["Task View", ""]]});

    function showLoadingPopUp () {
        $('#loadingModal').show();
        $('#loadingModal').modal({
            backdrop: 'static',
            keyboard: false
        }); 
    };

    function hideLoadingPopUp () {
        angular.element('#loadingModal').modal('hide');
    };

    function sliceTasks (begin, end) {
        var begin = ($scope.activePage - 1) * $scope.tasksPerPage;
        var end = begin + $scope.tasksPerPage;
        $scope.slicedTaskTable = $scope.allTasksData.slice(begin, end);
    };

    function searchInputValueInTasks () {
        var searchedTaskData = [];
        var searchText = $scope.taskSearchText.toLowerCase();
        for (id in $scope.allTasksData) {
            if ($scope.allTasksData[id][NAME_PARAM].toLowerCase().indexOf(searchText) !== -1) {
                searchedTaskData.push($scope.allTasksData[id]);
            };
            $scope.slicedTaskTable = searchedTaskData;
            if (searchText == 0) {
                sliceTasks();
            };
        };
    };
    
    function removeChecklistTask (task) {
        var index = $scope.checkedTasks.indexOf(task);
        $scope.checkedTasks.splice(index, 1);
    };

    function takeTasksWithStartTime () {
        $scope.sortedTable = [];
        for (id in $scope.allTasksData) {
            if ($scope.allTasksData[id][START_TIME_PARAM].indexOf(undefined) === -1) {
                $scope.sortedTable.push($scope.allTasksData[id]);
            };
        };
    };

    function sortNewestToOldest () {
        $scope.tmpDate = null;
        for (var j = 0; j < $scope.sortedTable.length; j++) {
            for (var i = 0; i < $scope.sortedTable.length - 1; i++) {
                if ($scope.sortedTable[i][START_TIME_PARAM] < $scope.sortedTable[i + 1][START_TIME_PARAM]){
                    tmpDate = $scope.sortedTable[i];
                    $scope.sortedTable[i] = $scope.sortedTable[i + 1];
                    $scope.sortedTable[i + 1] = tmpDate;
                };
            };  
        };
    };

    function sortOldestToNewest () {
        for (var j = 0; j < $scope.sortedTable.length; j++) {
            for (var i = 0; i < $scope.sortedTable.length - 1; i++) {
                if ($scope.sortedTable[i][START_TIME_PARAM] > $scope.sortedTable[i + 1][START_TIME_PARAM]){
                    tmpDate = $scope.sortedTable[i];
                    $scope.sortedTable[i] = $scope.sortedTable[i + 1];
                    $scope.sortedTable[i + 1] = tmpDate;
                };
            };
        };
    };

    $scope.getAllTaskDetails = function () {
        showLoadingPopUp();
        if (typeof($scope.allTasksData) != undefined) {
            delete $scope.allTasksData;
        };
        if (typeof($scope.requestAllTaskDetails) != undefined) {
            delete $scope.requestAllTaskDetails;
        };
        if (typeof($scope.isActionStatus) != undefined) {
            delete $scope.isActionStatus;
        };
        var response = taskViewService.getAllTaskDetails();
        response.then (function (result) {
            responseType = result[0];
            responseValue = result[1];
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
                };
            };

        lengthOfTasksTable = $scope.allTasksData.length;
        $scope.numOfPages = Math.ceil(lengthOfTasksTable / $scope.tasksPerPage);
        $scope.activePage = 1;
        sliceTasks(0, $scope.tasksPerPage);

        $scope.firstPageButton = function () {
            $scope.activePage = 1;
            sliceTasks();
            $scope.clearInput();
        };
        $scope.previousPageButton = function () {
            if ($scope.activePage > 1) {
                $scope.activePage--;
            };
            if ($scope.activePage == 1) {
                $scope.activePage = 1;
            };
            sliceTasks();
            $scope.clearInput();
        };  
        $scope.nextPageButton = function () {
            if ($scope.activePage < $scope.numOfPages) {
                $scope.activePage++;
            };
            if ($scope.activePage == $scope.numOfPages) {
                $scope.activePage = $scope.numOfPages;
            };
            sliceTasks();
            $scope.clearInput();
        };

        $scope.lastPageButton = function () {
            $scope.activePage = $scope.numOfPages;
            sliceTasks();
            $scope.clearInput();
        };
        hideLoadingPopUp();
        });
    };

    $scope.taskNameSearch = function () {
        if (!$scope.withoutLastExecutionCheckbox.status) {
            searchInputValueInTasks();
        };
    };

    $scope.clearInput = function () {
        if (!$scope.withoutLastExecutionCheckbox.status) {
            $scope.taskSearchText = "";
            sliceTasks();
        } 
        else {
            $scope.taskSearchText = "";
        };
    };

    $scope.handleInputChange = function () {
        sliceTasks();
    };

    $scope.selectHandler = function () {
        if ($scope.data.model == 'newestToOldest') {   
            takeTasksWithStartTime();
            sortNewestToOldest();
            $scope.allTasksData = $scope.sortedTable;
            sliceTasks();
        };
        if ($scope.data.model == 'oldestToNewest') {   
            takeTasksWithStartTime();
            sortOldestToNewest();
            $scope.allTasksData = $scope.sortedTable;
            sliceTasks();
        };
    };

    $scope.catchWithoutLastExecution = function () {
        $scope.withoutLastExecutionCheckbox.status = !$scope.withoutLastExecutionCheckbox.status;
        var withoutExecution = [];
        if ($scope.taskSearchText == null || $scope.taskSearchText == "") {
            if ($scope.withoutLastExecutionCheckbox.status === true) {
                for (id in $scope.allTasksData) {
                    if (!$scope.allTasksData[id]["lastExecutionTime"]) {
                        withoutExecution.push($scope.allTasksData[id]);
                    };
                };
                $scope.slicedTaskTable = withoutExecution;
                $scope.numOfPages = 1;
            } 
            else {
                lengthOfTasksTable = $scope.allTasksData.length;
                $scope.numOfPages = Math.ceil(lengthOfTasksTable / $scope.tasksPerPage);
                sliceTasks();
            };
        };
    };

    $scope.handleChecklist = function () {
        $scope.checkedTask = this.task;
        $scope.takeTaskCheckbox = true;
        if ($scope.takeTaskCheckbox) {
            if ($scope.checkedTasks.indexOf($scope.checkedTask) !== -1) {
                removeChecklistTask($scope.checkedTask);
                return 0;
            };
            for (id in $scope.allTasksData) {
                if ($scope.checkedTask === $scope.allTasksData[id] && $scope.checkedTasks.indexOf($scope.checkedTask) === -1) {
                    $scope.checkedTasks.push($scope.checkedTask);
                };
            };
        };
    };

    $scope.unloadCheckedConfirmationShow = function () {
        if (typeof($scope.unloadConfirmModuleData) != undefined) {
            delete $scope.unloadConfirmModuleData;
        };
        var uuidList = [];
        var taskNameList = [];
        for (id in $scope.checkedTasks) {
            uuidList.push($scope.checkedTasks[id][UUID_PARAM]);
            taskNameList.push($scope.checkedTasks[id][NAME_PARAM]);
        };
        for (var i = 0; i < uuidList.length; i++) {
            $scope.unloadConfirmModuleData = {
                UUID_PARAM: uuidList[i],
                NAME_PARAM: taskNameList[i]
            };
            $scope.unloadCheckedTask(uuidList[i], taskNameList[i]);
            removeChecklistTask($scope.checkedTasks[i]);
        };
    };

    $scope.unloadCheckedTask = function (taskUuid, taskName) {
        if (typeof($scope.isActionStatus) != undefined) {
            delete $scope.isActionStatus;
        };
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
        }).error(function (data, status, headers, config) {
            $scope.isActionStatus = [false, 'Task definition delete failed. [Task Definition : ' + taskName + ']'];
            logger.error("Task definition delete failed. [Task Definition : " + taskName + "]", data);
        });
    };

    $scope.stopCheckedConfirmationShow = function () {
        if (typeof($scope.unloadConfirmModuleData) != undefined) {
            delete $scope.unloadConfirmModuleData;
        };
        var uuidList = [];
        var taskNameList = [];
        for (id in $scope.checkedTasks) {
            uuidList.push($scope.checkedTasks[id][UUID_PARAM]);
            taskNameList.push($scope.checkedTasks[id][NAME_PARAM]);
        };
        for (var i = 0; i < uuidList.length; i++) {
            $scope.unloadConfirmModuleData = {
                UUID_PARAM: uuidList[i],
                NAME_PARAM: taskNameList[i]
            }
            $scope.stopCheckedTask(uuidList[i], taskNameList[i]);
            removeChecklistTask($scope.checkedTasks[i]);
        };
    };

    $scope.stopCheckedTask = function (taskUuid, taskName) {
        if (typeof($scope.isActionStatus) != undefined) {
            delete $scope.isActionStatus;
        };
        var uploadUrl = OWARoutesUtil.getOpenmrsUrl() + "/ws/rest/v1/taskaction";
        var moduleData =
            {
                "action": "shutdowntask",
                "tasks": [taskName]
            };
        $http.post(uploadUrl, moduleData, {
            headers: {'Accept': '*/*;q=0.8'}
        }).success(function (data, status, headers, config) {
            $scope.isActionStatus = [true, 'Task Definition : ' + taskName + ' has been started.'];
            $scope.getAllTaskDetails();
        }).error(function (data, status, headers, config) {
            $scope.isActionStatus = [false, 'Could not schedule the task. [Task Definition : ' + taskName + ']'];
            logger.error("Could not schedule the task.[Task Definition : " + taskName + "]", data);
        });
    };

    $scope.startCheckedConfirmationShow = function () {
        if (typeof($scope.unloadConfirmModuleData) != undefined) {
            delete $scope.unloadConfirmModuleData;
        };
        var uuidList = [];
        var taskNameList = [];
        for (id in $scope.checkedTasks) {
            uuidList.push($scope.checkedTasks[id][UUID_PARAM]);
            taskNameList.push($scope.checkedTasks[id][NAME_PARAM]);
        };
        for (var i = 0; i < uuidList.length; i++) {
            $scope.unloadConfirmModuleData = {
                UUID_PARAM: uuidList[i],
                NAME_PARAM: taskNameList[i]
            };
            $scope.startCheckedTask(uuidList[i], taskNameList[i]);
            removeChecklistTask($scope.checkedTasks[i]);
        };
    };

    $scope.startCheckedTask = function (taskUuid, taskName) {
        if (typeof($scope.isActionStatus) != undefined) {
            delete $scope.isActionStatus;
        };
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
        }).error(function (data, status, headers, config) {
            $scope.isActionStatus = [false, 'Could not schedule the task. [Task Definition : ' + taskName + ']'];
            logger.error("Could not schedule the task.[Task Definition : " + taskName + "]", data);
        });
    };
    
    $scope.unloadConfirmationShow = function (taskUuid, taskName) {
        if (typeof($scope.unloadConfirmModuleData) != undefined) {
            delete $scope.unloadConfirmModuleData;
        };
        $scope.unloadConfirmModuleData = {
            UUID_PARAM: taskUuid,
            NAME_PARAM: taskName
        };
        angular.element('#deleteConfirmation').modal('show');
    };

    $scope.stopConfirmationShow = function (taskUuid, taskName) {
        if (typeof($scope.stopConfirmModuleData) != undefined) {
            delete $scope.stopConfirmModuleData;
        };
        $scope.stopConfirmModuleData = {
            UUID_PARAM: taskUuid,
            NAME_PARAM: taskName
        };
        angular.element('#stopConfirmation').modal('show');
    };

    $scope.unloadTask = function (taskUuid, taskName) {
        showLoadingPopUp();
        if (typeof($scope.isActionStatus) != undefined) {
            delete $scope.isActionStatus;
        };
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
    };

    $scope.stopTask = function (taskUuid, taskName) {
        showLoadingPopUp();
        if (typeof($scope.isActionStatus) != undefined) {
            delete $scope.isActionStatus;
        };
        var uploadUrl = OWARoutesUtil.getOpenmrsUrl() + "/ws/rest/v1/taskaction";
        var moduleData =
            {
                "action": "shutdowntask",
                "tasks": [taskName]
            };
        $http.post(uploadUrl, moduleData, {
            headers: {'Accept': '*/*;q=0.8'}
        }).success(function (data, status, headers, config) {
            $scope.isActionStatus = [true, 'Task Definition : ' + taskName + ' has been stopped.'];
            $scope.getAllTaskDetails();
            hideLoadingPopUp();
        }).error(function (data, status, headers, config) {
            $scope.isActionStatus = [false, 'Could not shutdown the task. [Task Definition : ' + taskName + ']'];
            hideLoadingPopUp();
            logger.error("Could not shutdown the task.[Task Definition : " + taskName + "]", data);
        });
    };

    $scope.startTask = function (taskUuid, taskName) {
        showLoadingPopUp();
        if (typeof($scope.isActionStatus) != undefined) {
            delete $scope.isActionStatus;
        };
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
    };

    $scope.rescheduleTasks = function (taskUuid, taskName) {
        showLoadingPopUp();
        if (typeof($scope.isActionStatus) != undefined) {
            delete $scope.isActionStatus;
        };
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
    };
}]);
