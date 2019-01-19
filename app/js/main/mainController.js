var mainControllerModule = angular.module('mainController', ['OWARoutes']);

// mainController Controller used for home.html 
mainControllerModule.controller('mainHomeCtrl', ['$scope','$http','OWARoutesUtil','$rootScope','mainService', 'logger',
    function($scope,$http,OWARoutesUtil,$rootScope,mainService,logger){

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
                        logger.info("Retrieved OpenMRS locations from the server(" + $scope.OpenMRSLocationData.length + ")", $scope.OpenMRSLocationData);
                    }
                    else{
                        $scope.requestOpenMRSLocation=false;
                        logger.error("Could not fetch the OpenMRS locations from the server", result[2]);
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
                logger.info("OpenMRS Location changed to " + locationDisplay + " - " + locationUuid);
            })
                .error(function (data, status, headers, config) {
                    logger.error("Could not change the OpenMRS location : (Display : " + locationDisplay + " , UUID : " + locationUuid + ")" , data);

                });
        }

        $scope.getOpenMRSSession= function(){
            $scope.requestOpenMRSSession=false;
            if(typeof($scope.OpenMRSSessionData)!=undefined){
                delete $scope.OpenMRSSessionData;
            }
            var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/appui/session";
            $http.get(requestUrl, {})
                .success(function (data){
                    $scope.requestOpenMRSSession=true;
                    $scope.OpenMRSSessionData=data;
                    logger.info("OpenMRS Session information fetched from the server", $scope.OpenMRSSessionData);
                }).error(function (data,status){
                $scope.requestOpenMRSSession=false;
                logger.error("Could not fetch the OpenMRS Session information from the server", data);
            });
        }

        $scope.getLogoutSuccessPath = function() {
            var openMrsUrl = OWARoutesUtil.getOpenmrsUrl();
            logoutSuccessPath = openMrsUrl.substring(openMrsUrl.lastIndexOf('/') + 1);
            return logoutSuccessPath;
        }
    }]);

mainControllerModule.controller('breadCrumbCtrl', ['$scope','$rootScope', function($scope,$rootScope){

    $rootScope.$on("updateBreadCrumb", function(event, args){
        $scope.updateBreadCrumb(args.breadcrumbs);
    });

    $scope.updateBreadCrumb = function(values) {
        $scope.openMRSBreadcrumbs =values;
    }
}]);
 

