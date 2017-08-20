     var SearchRepoModule = angular.module('seacrchModuleController',['OWARoutes']);

     SearchRepoModule.service('SearchModuleService',['$http', 'OWARoutesUtil','$q', function ($http, OWARoutesUtil,$q) {

         return {
             getSeatchModuleDetails: function (moduleUuid) {
                 var def = $q.defer();
                 var requestUrl = "https://addons-stg.openmrs.org/api/v1/addon/"+moduleUuid;
                 $http.get(requestUrl, {params: {v: 'full'}})
                     .success(function (data, status) { // GET REQUEST SUCCESS HANDLE
                         def.resolve(["GET", 1, data, status]);
                     }).error(function (data, status) { // GET REQUEST ERROR HANDLE
                     def.resolve(["GET", 0, data, status]);
                 });
                 return def.promise;
             }
         };
     }]);


     
     SearchRepoModule.controller('searchModuleCtrl', ['$scope', '$http', 'OWARoutesUtil','$rootScope', 'SearchModuleService', '$routeParams',
         function($scope, $http, OWARoutesUtil, $rootScope, SearchModuleService, $routeParams) {
         
      // *** /OpenMRS breadcrumbs ***  
      $rootScope.$emit("updateBreadCrumb", {breadcrumbs : [["SysAdmin","#"],["Modules","#/module-show"], ["Search Module",""]]});
      // *** /OpenMRS breadcrumbs ***

         function showLoadingPopUp(){
             $('#loadingModal').show();
             $('#loadingModal').modal({
                 backdrop: 'static',
                 keyboard: false
             });
             console.log("showLoadingPopUp ");
             console.log(angular.element('#loadingModal').status);
         }
         function hideLoadingPopUp(){
             angular.element('#loadingModal').modal('hide');
             console.log("hideLoadingPopUp ");
         }

         function alertsClear() {
             if(typeof($scope.downloadErrorMsg)!=undefined){
                 delete $scope.downloadErrorMsg;
             }
             if(typeof($scope.downloadSuccessMsg)!=undefined){
                 delete $scope.downloadSuccessMsg;
             }

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
             if(typeof($scope.isSearching)!=undefined){
                 delete $scope.isSearching;
             }
         }
       $scope.modules=[];
       $scope.searchText = null;

         $scope.change = function() {
             alertsClear(); // clear all alerts $scope variables
             $scope.moduleFound=false;
             $scope.isSearching=true;
             $scope.modules=[];
             var searchValue = $scope.searchText;
             var requestUrl = "https://addons-stg.openmrs.org/api/v1//addon?&q="+searchValue;
             if(searchValue){
                 $http.get(requestUrl, {})
                     .success(function (data,status){ // GET REQUEST SUCCESS HANDLE
                         console.log(data.length);
                         if(data.length>0){
                             // Modules Found
                             $scope.moduleFound=true;
                             $scope.modules = data;
                         }
                         else {
                             // No Modules Found
                             $scope.moduleFound=false;
                         }
                         $scope.isSearching=false;
                     }).error(function (data,status){ // GET REQUEST ERROR HANDLE
                     console.error('Search  error : ', status, data);
                 });
             }
             else{
                 // Search text empty
                 $scope.isSearching=false;
                 $scope.moduleFound=false;
             }

         }

     //   $scope.change = function(text) {
     //       alertsClear(); // clear all alerts $scope variables
     //       $scope.moduleFound=false;
     //       $scope.modules=[];
     //
     //       var searchValue = $scope.searchText;
     //       var column_count=5;
     //       var columns="Action%2CName%2CVersion%2CAuthor%2CDescription";
     //       var displayStart=0;
     //       var displayLength=15;
     //
     //       var urll="https://modules.openmrs.org/modulus/modules/findModules?callback=JSON_CALLBACK&sEcho=13&iColumns="+column_count+"&sColumns="+columns+"&iDisplayStart="+displayStart+"&iDisplayLength="+displayLength+"&bEscapeRegex=true&sSearch="+searchValue;
     //
     //       $http({
     //         method: 'JSONP',
     //         url: urll
     //       })
     //       .success(function(data) {
     //
     //         console.log(data.iTotalDisplayRecords);
     //         if(data.iTotalDisplayRecords>0){
     //                    // Modules Found
     //                    $scope.moduleFound=true;
     //                    $scope.modules = data.aaData;
     //                  }
     //                  else {
     //                    // No Modules Found
     //                    $scope.moduleFound=false;
     //                  }
     //
     //                console.log('Data Retrived');
     //              })
     //       .error(function(data, status) {
     //         console.error('Repos error', status, data);
     //       })
     //       .finally(function() {
     //         console.log("finally finished search");
     //       });
     //
     // };


         $scope.getSearchModuleDetails = function() {
             // *** /OpenMRS breadcrumbs ***
             $rootScope.$emit("updateBreadCrumb", {breadcrumbs : [["SysAdmin","#"],["Modules","#/module-show"], ["Search Module","#/view-search"], ["Module Information",""]]});
             // *** /OpenMRS breadcrumbs ***
             console.log("getNotInstalledModuleDetailsFromOnline");
             if(typeof($scope.nonInstalledModuleDetails)!=undefined){
                 delete $scope.nonInstalledModuleDetails;
             }
             if(typeof($scope.onlineDataFound)!=undefined){
                 delete $scope.onlineDataFound;
             }
             showLoadingPopUp(); // Show loadingPop to prevent other Actions
             var moduleUuid=$routeParams.UUID;
             console.log(moduleUuid);
             var responseModuleDetails = SearchModuleService.getSeatchModuleDetails(moduleUuid);
             responseModuleDetails.then(function(resultModule){
                 if(resultModule[0]=="GET"){
                     if(resultModule[1]==1){
                         $scope.onlineDataFound=true;
                         console.log("1");
                         $scope.nonInstalledModuleDetails=resultModule[2];
                     }else{console.log("3");
                         $scope.onlineDataFound=false;
                     }
                     hideLoadingPopUp() // hide the loading Popup
                 }
             });
         }


    $scope.trysearch = function(moduleUrl) {
      $scope.isDownloading=true;

        alertsClear(); // clear all alerts $scope variables
        showLoadingPopUp(); // Show loadingPop to prevent other Actions
      var fd = new FormData();
      $http.get(moduleUrl, {responseType: "arraybuffer"})
      .success(function (data){ // GET REQUEST ERROR HANDLE


            var filename = moduleUrl.substring(moduleUrl.lastIndexOf('/')+1);

            let blob = new Blob([data], {type: 'application/octet-stream'});  
            var url=(window.URL).createObjectURL(blob);

            var file = new File([data], filename, {type:"application/octet-stream", lastModified: new Date().getTime()});
            fd.append('file', file);

            $scope.isDownloading=false;
            $scope.downloadSuccessMsg="Module Download Completed";

    
        console.log("POST started...");
        var uploadUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/module/?";

        $scope.isUploading=true;

     $http.post(uploadUrl, fd, {
       transformRequest: angular.identity,
       headers: { 
        'Content-Type': undefined ,  
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'}
      }) .success(function (data, status, headers, config) {  // POST REQUEST ERROR HANDLE
           console.log("UPLOAD - Sucess.");
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
          .error(function (data, status, header, config) { // POST REQUEST ERROR HANDLE
           console.log("UPLOAD - Error.");
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
    }).error(function (data){ // GET REQUEST ERROR HANDLE
          $scope.isDownloading=false;
          $scope.downloadErrorMsg="Could not download the Module";
          hideLoadingPopUp();
    });

    };
         
    }]);



    