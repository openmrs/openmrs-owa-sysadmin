// SystemInfoModule module initilation
var SystemInfoModule = angular.module('systemInfoController', ['OWARoutes']);

// SystemInfo Controller used for system-info.html 
SystemInfoModule.controller('systeminfoCtrl', ['$scope','$http','OWARoutesUtil','$rootScope', function($scope,$http,OWARoutesUtil,$rootScope){
    
      // *** /OpenMRS breadcrumbs ***  
      $rootScope.$emit("updateBreadCrumb", {breadcrumbs : [["Home","#"],["SystemInfo","#/system-info"]]});
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

        var restUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/systeminformation";

        // REST GET Calls 
        // Request should add the */* formats as response
        $http.get(restUrl, {headers: {'Accept': '*/*;q=0.8'}})
         .success(function (data) {
                // set False to indicate data fetching is completed
                $scope.dataLoading=false;

                if (typeof(data.SystemInfo["SystemInfo.title.openmrsInformation"]) != "undefined")
                {
                    $scope.openmrsInformation = data.SystemInfo["SystemInfo.title.openmrsInformation"];
                }
                else { console.log("Couldn't fetch the openmrsInformation data"); }

                if (typeof(data.SystemInfo["SystemInfo.title.javaRuntimeEnvironmentInformation"]) != "undefined")
                {
                    $scope.javaRuntimeEnvironmentInformation = data.SystemInfo["SystemInfo.title.javaRuntimeEnvironmentInformation"];
                }
                else { console.log("Couldn't fetch the javaRuntimeEnvironmentInformation data"); }

                if (typeof(data.SystemInfo["SystemInfo.title.memoryInformation"]) != "undefined")
                {
                    $scope.memoryInformation = data.SystemInfo["SystemInfo.title.memoryInformation"];
                }
                else { console.log("Couldn't fetch the memoryInformation data"); }

                if (typeof(data.SystemInfo["SystemInfo.title.dataBaseInformation"]) != "undefined")
                {
                    $scope.dataBaseInformation = data.SystemInfo["SystemInfo.title.dataBaseInformation"];
                }
                else { console.log("Couldn't fetch the dataBaseInformation data"); }

                if (typeof(data.SystemInfo["SystemInfo.title.moduleInformation"]) != "undefined")
                {
                    $scope.moduleInformation = data.SystemInfo["SystemInfo.title.moduleInformation"];
                }
                else { console.log("Couldn't fetch the moduleInformation data"); }

                console.log("Successfully retrieved SystemInfo");
            })
            .error(function (data) {
                
                $scope.dataLoading=false;

                console.log("ERROR SystemInfo");

                // if (typeof(JsonErrorResponse["org.openmrs.module.webservices.rest.SimpleObject"].map.string) != "undefined"){
                //     // File Error Catched
                //     if (typeof(JsonErrorResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["linked-hash-map"].entry.string) != "undefined"){
                //         // Error Message given
                //        // $scope.uploadederrorMsg=JsonErrorResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["linked-hash-map"].entry.string;
                //     }
                //     else{
                //         // Unknown Error Message
                //         //$scope.uploadederrorMsg="Error loading module, no config.xml file found"
                //     }
                // }
                // else{
                //     //unknown Error
                //    // $scope.uploadederrorMsg="Error loading module!"
                // }
                
            });
    };
    
}]);
