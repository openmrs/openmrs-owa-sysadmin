
var addNewTaskModule = angular.module('addNewTaskController', ['OWARoutes']);

addNewTaskModule.controller('addNewTaskCtrl', ['$scope','$http','OWARoutesUtil','$location', '$filter', function($scope,$http,OWARoutesUtil,$location, $filter){

    $scope.startOnStartup = false;

    $scope.properties = [];
    $scope.addNewProperties = function() {
        $scope.properties.push({});
    };

    $scope.removeProperties = function() {
        var lastItem = $scope.properties.length-1;
        $scope.properties.splice(lastItem);
    };

    function createPropertyJson(properties){
        var newJson = {};
        for ( var i = 0; i < properties.length; i++){
                newJson[properties[i]['name']] = properties[i]['value'];
        }
        return newJson;
    }
    $scope.saveNewTaskDefinitions = function () {
        if(validateAddNewTaskDefinitions()){
            if(typeof($scope.isSavedTaskDefinitions)!=undefined){
                delete $scope.isSavedTaskDefinitions;
            }
            if(typeof($scope.validationErrorMessage)!=undefined){
                delete $scope.validationErrorMessage;
            }
            var uploadUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/taskdefinition";

            var startTime = $filter('date')(new Date($scope.startTimeVal), "yyyy-MM-ddTHH:mm:ss.sssZ", "UTC");
            var startOnStartup = false;
            if(typeof($scope.startOnStartup)!==undefined){
                startOnStartup = $scope.startOnStartup;
            }
            var moduleData =
                {
                    "name": $scope.taskName,
                    "taskClass": $scope.schedulableClass,
                    "description" : $scope.description,
                    "startOnStartup": startOnStartup,
                    "startTime": startTime,
                    "repeatInterval" : ''+$scope.repeatInterval,
                    "properties" : createPropertyJson($scope.properties)
                };
            console.log(moduleData);
            $http.post(uploadUrl, moduleData ,  {
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'}
            }) .success(function (data, status, headers, config) {
                $scope.isSavedTaskDefinitions = true;
                console.log("taskdefinition saved");
            }).error(function (data, status, headers, config) {

                var x2js = new X2JS();
                var JsonErrorResponse = x2js.xml_str2json(data);
                if (typeof(JsonErrorResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["org.openmrs.module.webservices.rest.SimpleObject"].map["org.openmrs.module.webservices.rest.SimpleObject"].map.string) != "undefined"){
                    // File Error Catched
                    if ((JsonErrorResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["org.openmrs.module.webservices.rest.SimpleObject"].map["org.openmrs.module.webservices.rest.SimpleObject"].map.string) == "taskClass"){
                        // Error Message given
                        $scope.validationErrorMessage= "Incorrect task class found. Please check";
                    }
                    else{
                        // Unknown Error Message
                        $scope.validationErrosrMessage = "Could not save the task definition."
                    }
                }
                else{
                    //unknown Error
                    $scope.validationErrorMessage = "Could not save the task definition."
                }
                $scope.isSavedTaskDefinitions = false;
            });
        }
        else{
            $scope.isSavedTaskDefinitions = false;
            //console.log("Validation Failed");
        }
    }

    function validateAddNewTaskDefinitions(){
        var isValidated=false;
        if($scope.taskName!=null){
            if($scope.description!=null){
                if($scope.startTimeVal!=null){
                    if($scope.repeatInterval!=null){
                        isValidated=true;
                    }
                    else{
                        $scope.validationErrorMessage="Validation failed, Please check repeat interval.";
                    }
                }
                else{
                        $scope.validationErrorMessage="Validation failed, Please check start time.";
                }
            }
            else{
                $scope.validationErrorMessage="Validation failed, Please check description.";
            }
        }
        else{
            $scope.validationErrorMessage="Validation failed, Please check Task Name.";
        }
        return isValidated;
    }
}
]);
