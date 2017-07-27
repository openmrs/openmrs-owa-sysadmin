// mainController module initilation
var mainControllerModule = angular.module('mainController', ['OWARoutes']);

// mainController Controller used for home.html 
mainControllerModule.controller('mainHomeCtrl', ['$scope','$http','OWARoutesUtil','$rootScope','mainService',   function($scope,$http,OWARoutesUtil,$rootScope,mainService){
    
    $rootScope.$emit("updateBreadCrumb", {breadcrumbs : [["SysAdmin",""],]});
    
    $scope.breadcrumbs = breadcrumbs;
    
    $scope.getOpenMRSLocation= function(){
        
        $scope.requestOpenMRSLocation=false;
        if(typeof($scope.OpenMRSLocationData)!=undefined){
            delete $scope.OpenMRSLocationData;
        }
        var response = mainService.getOpenMRSLocation();
        response.then(function(result){            
            if(result[0]=="GET"){
                if(result[1]==1){
                    $scope.requestOpenMRSLocation=true;
                    $scope.OpenMRSLocationData=result[2].results;
                }
                else{
                    console.log("error");
                    $scope.requestOpenMRSLocation=false;
                }
            }
        });
    }
    
    $scope.setOpenMRSLocation=function(locationUuid,locationDisplay){
         
        $scope.OpenMRSSessionData.sessionLocation.display=locationDisplay;
        var uploadUrl=OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/appui/session";

      	$http.post(uploadUrl, {"location" : locationUuid} ,  {
            headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'}
        }) .success(function (data, status, headers, config) {
            //console.log("location changed");
        })
        .error(function (data, status, headers, config) {
            console.log("Location Change Error");
        });
    }
    
    $scope.getOpenMRSSession= function(){
       
        $scope.requestOpenMRSSession=false;
        if(typeof($scope.OpenMRSSessionData)!=undefined){
            delete $scope.OpenMRSSessionData;
        }
        var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/appui/session";
        $http.get(requestUrl, {})
        .success(function (data){ // GET REQUEST SUCCESS HANDLE
            $scope.requestOpenMRSSession=true;
            $scope.OpenMRSSessionData=data;
        }).error(function (data){ // GET REQUEST ERROR HANDLE
            console.log("error");
            $scope.requestOpenMRSSession=false;
        });
    }
    
}]);

mainControllerModule.controller('breadCrumbCtrl', ['$scope','$rootScope', function($scope,$rootScope){

        $rootScope.$on("updateBreadCrumb", function(event, args){
           $scope.updateBreadCrumb(args.breadcrumbs);
        });

        $scope.updateBreadCrumb = function(values) {
            $scope.openMRSBreadcrumbs =values;//["HomeA","HomeB","HomeC"];
        
        }                            
}]);
 

