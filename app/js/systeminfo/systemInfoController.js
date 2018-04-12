// SystemInfoModule module initilation
var SystemInfoControllerModule = angular.module('systemInfoController', ['OWARoutes']);
        
// SystemInfo Controller used for system-info.html 
SystemInfoControllerModule.controller('systeminfoCtrl', ['$scope','$http','OWARoutesUtil','$rootScope', 'systemInfoService', 'logger', 'ngCopy', '$timeout',
    function($scope,$http,OWARoutesUtil,$rootScope, systemInfoService, logger, ngCopy, $timeout){
    
    // OpenMRS breadcrumbs
    $rootScope.$emit("updateBreadCrumb", {breadcrumbs : [["SysAdmin","#"],["SystemInfo",""]]});

    $scope.copyToClipboardText = "Copy System Info";
    $scope.copiedToClipboardIcon = "copy";
    $scope.SystemInfoImportantContent = {};

    $scope.copyLogToClipboard = function() {
        logTextDocument="System Information\n----------------------------------------\n";
        angular.forEach($scope.SystemInfoImportantContent, function(value, key) { 
            if(key!='modules') {
                logTextDocument+=key + " : " + value + "\n";
            }
        });
        logTextDocument +="\nModule Information (" + $scope.SystemInfoImportantContent['modules']['SystemInfo.Module.repositoryPath'] + ")\n----------------------------------------\n";
        indexCount = 1;
        angular.forEach($scope.SystemInfoImportantContent['modules'], function(value, key) {
            if(key!='SystemInfo.Module.repositoryPath') {
                logTextDocument+=indexCount + ". " + key + " (v " + value.trim() + ")\n";
                indexCount++;
            } 
        });

        $scope.copiedToClipboard = ngCopy(logTextDocument);
        if(ngCopy(logTextDocument)) {
            $scope.copyToClipboardText = "Copied";
            $scope.copiedToClipboardIcon = "ok";
            $timeout(function(){ $scope.copyToClipboardText = "Copy System Info"; $scope.copiedToClipboardIcon = "copy";  }, 3000);  
        }
        else {
            $scope.copyToClipboardText = "Error";
            $scope.copiedToClipboardIcon = "remove";
            $timeout(function(){ $scope.copyToClipboardText = "Copy System Info"; $scope.copiedToClipboardIcon = "copy"; }, 3000); 
        }
    }

    function keyCount(obj) {
        var count=0;
        for(var prop in obj) {
           if (obj.hasOwnProperty(prop)) {
              ++count;
           }
        }
        return count;
     }

    $scope.getSystemInfo = function(){
        // variable dataLoading used to indicate data fetching status
        // set True to indicate data fetching is just started
        $scope.dataLoading=true;
        //delete previous initilized data values
        if(typeof($scope.openmrsInformation)!=undefined){
            delete $scope.openmrsInformation;
        }
        if(typeof($scope.javaRuntimeEnvironmentInformation)!=undefined){
            delete $scope.javaRuntimeEnvironmentInformation;
        }
        if(typeof($scope.memoryInformation)!=undefined){
            delete $scope.memoryInformation;
        }
        if(typeof($scope.dataBaseInformation)!=undefined){
            delete $scope.dataBaseInformation;
        }
        if(typeof($scope.moduleInformation)!=undefined){
            delete $scope.moduleInformation;
        }
        if(typeof($scope.sysInfoErrorMessage)!=undefined){
            delete $scope.sysInfoErrorMessage;
        }
        
        var response = systemInfoService.getSystemInformation();
        response.then(function(result){
            if(result[0]=="GET"){
                if(result[1]==1){
                    var data=result[2];
                    // set False to indicate data fetching is completed
                    $scope.dataLoading=false;
                    var failedSections='';

                    if (typeof(data.systemInfo["SystemInfo.title.openmrsInformation"]) != "undefined")
                    {
                        $scope.openmrsInformation = data.systemInfo["SystemInfo.title.openmrsInformation"];
                        $scope.SystemInfoImportantContent["OpenMRS Version"] = $scope.openmrsInformation["SystemInfo.OpenMRSInstallation.openmrsVersion"];
                    }
                    else {
                        logger.error("Couldn't fetch the OpenMRS Information data");
                        failedSections+="openmrsInformation, ";
                    }

                    if (typeof(data.systemInfo["SystemInfo.title.javaRuntimeEnvironmentInformation"]) != "undefined")
                    {
                        $scope.javaRuntimeEnvironmentInformation = data.systemInfo["SystemInfo.title.javaRuntimeEnvironmentInformation"];
                        $scope.SystemInfoImportantContent["Java Version"] = $scope.javaRuntimeEnvironmentInformation["SystemInfo.JavaRuntimeEnv.javaVersion"];
                        $scope.SystemInfoImportantContent["OS Name"] = $scope.javaRuntimeEnvironmentInformation["SystemInfo.JavaRuntimeEnv.operatingSystem"];
                        $scope.SystemInfoImportantContent["OS Architecture"] = $scope.javaRuntimeEnvironmentInformation["SystemInfo.JavaRuntimeEnv.operatingSystemArch"];
                        $scope.SystemInfoImportantContent["OS Version"] = $scope.javaRuntimeEnvironmentInformation["SystemInfo.JavaRuntimeEnv.operatingSystemVersion"];
                    }
                    else {
                        logger.error("Couldn't fetch the javaRuntimeEnvironmentInformation data");
                        failedSections+="javaRuntimeEnvironmentInformation, ";
                    }

                    if (typeof(data.systemInfo["SystemInfo.title.memoryInformation"]) != "undefined")
                    {
                        $scope.memoryInformation = data.systemInfo["SystemInfo.title.memoryInformation"];
                        $scope.SystemInfoImportantContent["Total Memory"] = $scope.memoryInformation["SystemInfo.Memory.totalMemory"];
                        $scope.SystemInfoImportantContent["Free Memory"] = $scope.memoryInformation["SystemInfo.Memory.freeMemory"];
                        $scope.SystemInfoImportantContent["Total HeapSize"] = $scope.memoryInformation["SystemInfo.Memory.maximumHeapSize"];
                    }
                    else {
                        logger.error("Couldn't fetch the memoryInformation data");
                        failedSections+="memoryInformation, ";
                    }

                    if (typeof(data.systemInfo["SystemInfo.title.dataBaseInformation"]) != "undefined")
                    {
                        $scope.dataBaseInformation = data.systemInfo["SystemInfo.title.dataBaseInformation"];
                    }
                    else {
                        logger.error("Couldn't fetch the dataBaseInformation data");
                        failedSections+="dataBaseInformation, ";
                    }

                    if (typeof(data.systemInfo["SystemInfo.title.moduleInformation"]) != "undefined")
                    {
                        $scope.moduleInformation = data.systemInfo["SystemInfo.title.moduleInformation"];
                        $scope.SystemInfoImportantContent["Total Modules"] = keyCount($scope.moduleInformation);
                        $scope.SystemInfoImportantContent["modules"] =  $scope.moduleInformation;
                    }
                    else {
                        logger.error("Couldn't fetch the moduleInformation data");
                        failedSections+="moduleInformation, ";
                    }

                    if(failedSections!=''){
                        $scope.sysInfoErrorMessage="Could not get the " + failedSections.slice(0,failedSections.length-2)+" data";
                        logger.error($scope.sysInfoErrorMessage);
                    }
                }
                else{
                    // unexpected Error 
                    var data=result[2];
                    $scope.dataLoading=false;
                    if (typeof(data.error.message)!="undefined"){
                        $scope.sysInfoErrorMessage=data.error.message;
                    }
                    else{
                        $scope.sysInfoErrorMessage="Could not fetch the data from server";
                    }
                    logger.error($scope.sysInfoErrorMessage);
                }
            }
            else{
                $scope.dataLoading=false;
                $scope.sysInfoErrorMessage="Could not fetch the data from server";
                logger.error($scope.sysInfoErrorMessage);
            }
            
        });        
    };
    
    $scope.replaceModuleInfo = function (info) {
        var updated=info.replace('Not Started', ' ');
        updated=updated.replace('Started', ' ');
        return updated;
    }

    $scope.getModuleStartedOrNot = function (info) {
        if(info.indexOf("Not Started") !== -1){
            return false;
        }
        else{
            return true;
        }
    }

}]);
