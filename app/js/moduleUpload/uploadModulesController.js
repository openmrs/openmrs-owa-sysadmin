var uploadModule = angular.module('uploadModuleController', ['OWARoutes']);

uploadModule.directive('fileModel', ['$parse', function ($parse) {
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
            // element.bind('dragover', function (e) {
            //     e.stopPropagation();
            //     e.preventDefault();
            //     //debugger;
            //     e.dataTransfer.dropEffect = 'copy';
            // });
            // element.bind('dragenter', function(e) {
            //     e.stopPropagation();
            //     e.preventDefault();
            //     $scope.$apply(function() {
            //         $scope.divClass = 'on-drag-enter';
            //     });
            // });
            // element.bind('dragleave', function(e) {
            //     e.stopPropagation();
            //     e.preventDefault();
            //     $scope.$apply(function() {
            //         $scope.divClass = '';
            //     });
            // });
            //
            // element.bind('drop', function(){
            //     console.log("changed 2");
            // });
            //



        }
    };
}]);

// uploadModule.directive('fileDropzone', function() {
//     return {
//         restrict: 'A',
//         scope: {
//             file: '=',
//             fileName: '='
//         },
//         link: function(scope, element, attrs) {
//             var checkSize,
//                 isTypeValid,
//                 processDragOverOrEnter,
//                 validMimeTypes;
//
//             processDragOverOrEnter = function (event) {
//                 if (event != null) {
//                     event.preventDefault();
//                 }
//                 event.dataTransfer.effectAllowed = 'copy';
//                 return false;
//             };
//
//             validMimeTypes = attrs.fileDropzone;
//
//             checkSize = function(size) {
//                 var _ref;
//                 if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
//                     return true;
//                 } else {
//                     alert("File must be smaller than " + attrs.maxFileSize + " MB");
//                     return false;
//                 }
//             };
//
//             isTypeValid = function(type) {
//                 if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
//                     return true;
//                 } else {
//                     alert("Invalid file type.  File must be one of following types " + validMimeTypes);
//                     return false;
//                 }
//             };
//
//             element.bind('dragover', processDragOverOrEnter);
//             element.bind('dragenter', processDragOverOrEnter);
//
//             return element.bind('drop', function(event) {
//                 var file, name, reader, size, type;
//                 if (event != null) {
//                     event.preventDefault();
//                 }
//                 reader = new FileReader();
//                 reader.onload = function(evt) {
//                     if (checkSize(size) && isTypeValid(type)) {
//                         return scope.$apply(function() {
//                             scope.file = evt.target.result;
//                             if (angular.isString(scope.fileName)) {
//                                 return scope.fileName = name;
//                             }
//                         });
//                     }
//                 };
//                 file = event.dataTransfer.files[0];
//                 name = file.name;
//                 type = file.type;
//                 size = file.size;
//                 reader.readAsDataURL(file);
//                 return false;
//             });
//         }
//     };
// })
//
//
//     .directive("fileread", [function () {
//         return {
//             scope: {
//                 fileread: "="
//             },
//             link: function (scope, element, attributes) {
//                 element.bind("change", function (changeEvent) {
//                     var reader = new FileReader();
//                     reader.onload = function (loadEvent) {
//                         scope.$apply(function () {
//                             scope.fileread = loadEvent.target.result;
//                         });
//                     }
//                     reader.readAsDataURL(changeEvent.target.files[0]);
//                 });
//             }
//         }
//     }]);


uploadModule.controller('uploadModuleCtrl', ['$scope','$http','OWARoutesUtil','$rootScope', function($scope,$http,OWARoutesUtil,$rootScope){

      // *** /OpenMRS breadcrumbs ***  
      $rootScope.$emit("updateBreadCrumb", {breadcrumbs : [["SysAdmin","#"],["Modules","#/module-show"], ["Upload Module",""]]});
      // *** /OpenMRS breadcrumbs ***

    // ssssssssssssssssssssss
    // $scope.image = null;
    // $scope.imageFileName = '';
    //
    // $scope.uploadme = {};
    // $scope.uploadme.src = '';
    // $scope.divClass = '';

    //// sssssssssssssssssss

    $scope.PostDataResponse ='';
    $scope.ResponseDetails ='';

    function showLoadingPopUp(){
        $('#loadingModal').show();
        $('#loadingModal').modal({
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoadingPopUp(){
        angular.element('#loadingModal').modal('hide');
    }

    function alertsClear() {
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
    }
    $scope.removeFile = function(){
        angular.element("input[type='file']").val(null);
        $scope.myFile = null;
        var output = document.getElementById("dragAndDropOutput");
        output.innerHTML = 'Drag files here or click to upload';
        $('#uploadButton').prop('disabled', true);
        $('#removeButton').hide();
        alertsClear();
    }
    
    $scope.uploadFile = function(){

        alertsClear(); // clear all alerts $scope variables
        showLoadingPopUp(); // Show loadingPop to prevent other Actions

        var file = $scope.myFile;

        var uploadUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/module/?";

        var fd = new FormData();
        fd.append('file', file);
        $scope.isUploading=true;

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {
            'Content-Type': undefined ,  
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'}
        }) .success(function (data, status, headers, config) {

                $scope.isUploading=false;
                var x2js = new X2JS();
                var JsonSuccessResponse = x2js.xml_str2json(data);
            

                var moduleName = JsonSuccessResponse["org.openmrs.module.Module"].name;
                $scope.uplodedsuccessMsg=moduleName+" has been loaded"
                $scope.responseJsonData=JsonSuccessResponse;



                if (typeof(JsonSuccessResponse["org.openmrs.module.Module"].startupErrorMessage) == "undefined")
                    {
                        // Started Successfully
                        $scope.startupsuccessMsg=moduleName+" has been loaded and started Successfully"
                    }
                else{
                        //start up Error Found 
                        $scope.startuperrorMsg="Could not start "+moduleName+" Module."
                }
                hideLoadingPopUp();
            })
            .error(function (data, status, header, config) {
                //console.log("err");
                $scope.isUploading=false;
                var x2js = new X2JS();
                var JsonErrorResponse = x2js.xml_str2json(data);

                if (typeof(JsonErrorResponse["org.openmrs.module.webservices.rest.SimpleObject"].map.string) != "undefined"){
                    // File Error Catched
                    if (typeof(JsonErrorResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["linked-hash-map"].entry[0].string[1]) != "undefined"){
                        // Error Message given
                        $scope.uploadederrorMsg=JsonErrorResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["linked-hash-map"].entry[0].string[1];
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
                hideLoadingPopUp();
                
            });

    };
    
}]);
