var myApp = angular.module('systemInfoController', []);


myApp.controller('systeminfoCtrl', ['$scope','$http', function($scope,$http){
    

    $scope.getSystemInfo = function(){

        $scope.dataLoading=true;
        //delete previous data values
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

        var restUrl = "http://localhost:8080/openmrs/ws/rest/v1/systeminformation";
        console.log("getSystemInfo ");

        $http.get(restUrl, {headers: {'Accept': '*/*;q=0.8'}})
         .success(function (data) {
                $scope.dataLoading=false;

                if (typeof(data.SystemInfo["SystemInfo.title.openmrsInformation"]) != "undefined")
                {
                    $scope.openmrsInformation = data.SystemInfo["SystemInfo.title.openmrsInformation"];
                    //console.dir(openmrsInformation);
                   // console.log(openmrsInformation["SystemInfo.OpenMRSInstallation.systemDate"]);
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
                //console.dir(openmrsInformation);
                

                 

            })
            .error(function (data) {
                //console.log("err");
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
