// SystemInfoModule module initilation
var SystemInfoServiceModule = angular.module('systemInfoService', ['OWARoutes']);


SystemInfoServiceModule.service('systemInfoService',['$http', 'OWARoutesUtil','$q', function ($http, OWARoutesUtil,$q) {
    return{
        getSystemInformation : function(){
            var def = $q.defer();
            var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/systeminformation";
            $http.get(requestUrl, {})
            .success(function (data, status){ // GET REQUEST SUCCESS HANDLE
                def.resolve(["GET",1,data,status]);
            }).error(function (data,status){ // GET REQUEST ERROR HANDLE
                def.resolve(["GET",0,data,status]);
            });
            return def.promise;
        }
    }
}]);