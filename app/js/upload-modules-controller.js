var myApp = angular.module('uploadModuleController', []);

myApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

myApp.service('fileUpload', ['$http', function ($http) {
   
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {
            'Content-Type': undefined ,  
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'}
        })
       
    }
}]);

myApp.controller('uploadModuleCtrl', ['$scope', 'fileUpload','$http', function($scope, fileUpload,$http){
    
    $scope.PostDataResponse ='';
    $scope.ResponseDetails ='';

    $scope.uploadFile = function(){
        var file = $scope.myFile;
        console.log('file is ' );
        console.dir(file);
        var uploadUrl = "http://localhost:8080/openmrs/ws/rest/v1/module/?";
       //fileUpload.uploadFileToUrl(file, uploadUrl);
        var fd = new FormData();
        fd.append('file', file);

        console.log("waiting stated..");
        $scope.isUploading=true;

        //delete previous uploading messages
        if(typeof($scope.startuperrorMsg)!=undefined){
            delete $scope.startuperrorMsg;
        }
        if(typeof($scope.startupsuccessMsg)!=undefined){
            delete $scope.startupsuccessMsg;
        }
        if(typeof($scope.uplodedsuccessMsg)!=undefined){
            delete $scope.uplodedsuccessMsg;
        }
        if(typeof($scope.uploadederrorMsg)!=undefined){
            delete $scope.uploadederrorMsg;
        }

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {
            'Content-Type': undefined ,  
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'}
        }) .success(function (data, status, headers, config) {
                console.log("waiting ennded..");
                $scope.isUploading=false;
                var x2js = new X2JS();
                var JsonSuccessResponse = x2js.xml_str2json(data);
            


                //console.log("XML : ", data);
                //console.log(status);
               // console.log(headers);
                //console.log(config);

                //console.log("JSON : ", JsonSuccessResponse);
                //$scope.PostDataResponse = JsonSuccessResponse;

                
                //console.log("Name : ",moduleName);

                //file.result = status;
                //$scope.errorMsg ='Name -' + moduleName;
                console.log("FINISHED");

                var moduleName = JsonSuccessResponse["org.openmrs.module.Module"].name;
                $scope.uplodedsuccessMsg=moduleName+" Module has been loaded"
                $scope.responseJsonData=JsonSuccessResponse;



                if (typeof(JsonSuccessResponse["org.openmrs.module.Module"].startupErrorMessage) == "undefined")
                    {
                        // Started Successfully
                        $scope.startupsuccessMsg=moduleName+" Module has been loaded and started Successfully"
                    }
                else{
                        //start up Error Found 
                        $scope.startuperrorMsg="Could not start "+moduleName+" Module."
                }
                 

                //["org.openmrs.module.Module"].advicePoints
               // $scope.PostDataResponse = data.org.openmrs.module.Module.name;
            })
            .error(function (data, status, header, config) {
                console.log("err");
                $scope.isUploading=false;
                var x2js = new X2JS();
                var JsonErrorResponse = x2js.xml_str2json(data);

                if (typeof(JsonErrorResponse["org.openmrs.module.webservices.rest.SimpleObject"].map.string) != "undefined"){
                    // File Error Catched
                    if (typeof(JsonErrorResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["linked-hash-map"].entry.string) != "undefined"){
                        // Error Message given
                        $scope.uploadederrorMsg=JsonErrorResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["linked-hash-map"].entry.string;
                    }
                    else{
                        // Unknown Error Message
                        $scope.uploadederrorMsg="Error loading module, no config.xml file found"
                    }
                }
                else{
                    //unknown Error
                    $scope.uploadederrorMsg="Error loading module!"
                }
                
            });
        // file.upload.then(function (response) {
        //     $scope.PostDataResponse = response.data;
        // });

    };
    
}]);
