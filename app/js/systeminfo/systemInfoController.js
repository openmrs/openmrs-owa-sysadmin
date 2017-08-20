// SystemInfoModule module initilation
var SystemInfoControllerModule = angular.module('systemInfoController', ['OWARoutes']);
        
// SystemInfo Controller used for system-info.html 
SystemInfoControllerModule.controller('systeminfoCtrl', ['$scope','$http','OWARoutesUtil','$rootScope', 'systemInfoService', function($scope,$http,OWARoutesUtil,$rootScope, systemInfoService){
    
      // *** /OpenMRS breadcrumbs ***  
      $rootScope.$emit("updateBreadCrumb", {breadcrumbs : [["SysAdmin","#"],["SystemInfo",""]]});
      // *** /OpenMRS breadcrumbs ***
    
    // getSystemInfo() used to get all System Infromation
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
                    }
                    else {
                        console.log("Couldn't fetch the openmrsInformation data");
                        failedSections+="openmrsInformation, ";
                    }

                    if (typeof(data.systemInfo["SystemInfo.title.javaRuntimeEnvironmentInformation"]) != "undefined")
                    {
                        $scope.javaRuntimeEnvironmentInformation = data.systemInfo["SystemInfo.title.javaRuntimeEnvironmentInformation"];
                    }
                    else { 
                        console.log("Couldn't fetch the javaRuntimeEnvironmentInformation data"); 
                        failedSections+="javaRuntimeEnvironmentInformation, ";
                    }

                    if (typeof(data.systemInfo["SystemInfo.title.memoryInformation"]) != "undefined")
                    {
                        $scope.memoryInformation = data.systemInfo["SystemInfo.title.memoryInformation"];
                    }
                    else { 
                        console.log("Couldn't fetch the memoryInformation data"); 
                        failedSections+="memoryInformation, ";
                    }

                    if (typeof(data.systemInfo["SystemInfo.title.dataBaseInformation"]) != "undefined")
                    {
                        $scope.dataBaseInformation = data.systemInfo["SystemInfo.title.dataBaseInformation"];
                    }
                    else { 
                        console.log("Couldn't fetch the dataBaseInformation data"); 
                        failedSections+="dataBaseInformation, ";
                    }

                    if (typeof(data.systemInfo["SystemInfo.title.moduleInformation"]) != "undefined")
                    {
                        $scope.moduleInformation = data.systemInfo["SystemInfo.title.moduleInformation"];
                    }
                    else { 
                        console.log("Couldn't fetch the moduleInformation data"); 
                        failedSections+="moduleInformation, ";
                    }

                    if(failedSections!=''){
                        $scope.sysInfoErrorMessage="Could not get the " + failedSections.slice(0,failedSections.length-2)+" data";
                    }
                }
                else{
                    // unexpected Error 
                    var data=result[2];
                    $scope.dataLoading=false;
                    console.log("ERROR SystemInfo");
                    if (typeof(data.error.message)!="undefined"){
                        $scope.sysInfoErrorMessage=data.error.message;
                    }
                    else{
                        $scope.sysInfoErrorMessage="Could not fetch the data from server";
                    }
                }
            }
            else{
                $scope.dataLoading=false;
                $scope.sysInfoErrorMessage="Could not fetch the data from server";
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
