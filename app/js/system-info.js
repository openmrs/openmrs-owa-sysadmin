var myApp = angular.module('systemInfoController', []);


myApp.controller('systeminfoCtrl', ['$scope','$http', function($scope,$http){
    

    $scope.getSystemInfo = function(){
        var restUrl = "http://localhost:8080/openmrs/ws/rest/v1/systeminformation";
        console.log("getSystemInfo ");

        $http.get(restUrl, {headers: {'Accept': '*/*;q=0.8'}})
         .success(function (data) {
               // console.log("waiting ennded..");
               // var x2js = new X2JS();
               // var JsonSuccessResponse = x2js.xml_str2json(data);
            
                var openmrsInformation = data.SystemInfo["SystemInfo.title.openmrsInformation"];

               console.log("Successfully retrieved SystemInfo");
                console.dir(openmrsInformation);
                
              //  console.log(openmrsInformation);
                // if (typeof(JsonSuccessResponse["org.openmrs.module.Module"].startupErrorMessage) == "undefined")
                //     {
                //         // Started Successfully
                //        // $scope.startupsuccessMsg=moduleName+" has been loaded and started Successfully"
                //     }
                // else{
                //         //start up Error Found 
                //         //$scope.startuperrorMsg="Could not start "+moduleName+" Module."
                // }
                 

            })
            .error(function (data) {
                //console.log("err");
                $scope.isUploading=false;
                var x2js = new X2JS();
                var JsonErrorResponse = x2js.xml_str2json(data);

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
