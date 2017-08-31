
var mainServiceModule = angular.module('mainService', ['OWARoutes']);

mainServiceModule.service('mainService',['$http', 'OWARoutesUtil','$q', function ($http, OWARoutesUtil,$q) {
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