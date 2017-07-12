// mainController module initilation
var mainModule = angular.module('mainController', ['OWARoutes']);

mainModule.service('mainService',['$http', 'OWARoutesUtil','$q', function ($http, OWARoutesUtil,$q) {
    
    return{
        getOpenMRSLocation : function(){
            var def = $q.defer();
            var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/location";
            $http.get(requestUrl, {params:{ v : 'default'}})
            .success(function (data, status){ // GET REQUEST SUCCESS HANDLE
                def.resolve(["GET",1,data,status]);
            }).error(function (data,status){ // GET REQUEST ERROR HANDLE
                def.resolve(["GET",0,data,status]);
            });
            return def.promise;
        }
    }
}]);

// mainController Controller used for home.html 
mainModule.controller('mainHomeCtrl', ['$scope','$http','OWARoutesUtil','$rootScope','mainService', function($scope,$http,OWARoutesUtil,$rootScope,mainService){
    
    $rootScope.$emit("updateBreadCrumb", {breadcrumbs : [["SysAdmin",""],]});
    
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
//        var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/location";
//        $http.get(requestUrl, {params:{v : 'default'}})
//        .success(function (data){ // GET REQUEST SUCCESS HANDLE
//            $scope.requestOpenMRSLocation=true;
//            $scope.OpenMRSLocationData=data.results;
//        }).error(function (data){ // GET REQUEST ERROR HANDLE
//            console.log("error");
//            $scope.requestOpenMRSLocation=false;
//        });
    }
    
    $scope.setOpenMRSLocation=function(locationUuid,locationDisplay){
        console.log(locationUuid);
        $scope.OpenMRSSessionData.sessionLocation.display=locationDisplay;
        var uploadUrl=OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/appui/session";

      	$http.post(uploadUrl, {"location" : locationUuid} ,  {
            headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'}
        }) .success(function (data, status, headers, config) {
            console.log("location changed");
        })
        .error(function (data, status, headers, config) {
            console.log("console log change error");
        });
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
 

