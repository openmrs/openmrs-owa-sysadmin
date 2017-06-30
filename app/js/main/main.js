// mainController module initilation
var mainModule = angular.module('mainController', ['OWARoutes']);

// mainController Controller used for home.html 
mainModule.controller('mainHomeCtrl', ['$scope','$http','OWARoutesUtil','$rootScope', function($scope,$http,OWARoutesUtil,$rootScope){
    
    $rootScope.$emit("updateBreadCrumb", {breadcrumbs : []});
    
    console.log("HomeCtrl");
    var a1 =["HomeA","HomeB","HomeC"];
    //sharedProperties.setProperty(a1);
    $scope.breadcrumbs = breadcrumbs;
    
    $scope.getOpenMRSLocation= function(){
        console.log("location");
        $scope.requestOpenMRSLocation=false;
        if(typeof($scope.OpenMRSLocationData)!=undefined){
            delete $scope.OpenMRSLocationData;
        }
        var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/location";
        $http.get(requestUrl, {params:{v : 'default'}})
        .success(function (data){ // GET REQUEST SUCCESS HANDLE
            $scope.requestOpenMRSLocation=true;
            $scope.OpenMRSLocationData=data.results;
        }).error(function (data){ // GET REQUEST ERROR HANDLE
            console.log("error");
            $scope.requestOpenMRSLocation=false;
        });
    }
    
    $scope.setOpenMRSLocation=function(locationUuid,locationDisplay){
        console.log(locationUuid);
        $scope.OpenMRSSessionData.sessionLocation.display=locationDisplay;
        
        //        ***** WANT TO SAVE TO THE SESSION *****
    }
    
    $scope.getOpenMRSSession= function(){
        console.log("getOpenMRSSession");
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

mainModule.controller('breadCrumbCtrl', ['$scope','$rootScope', function($scope,$rootScope){

        $rootScope.$on("updateBreadCrumb", function(event, args){
           $scope.updateBreadCrumb(args.breadcrumbs);
        });

        $scope.updateBreadCrumb = function(values) {
            $scope.openMRSBreadcrumbs =values;//["HomeA","HomeB","HomeC"];
        
        }                            
}]);
 

