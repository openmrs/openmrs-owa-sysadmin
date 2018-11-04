
var sysAdminCommonModule = angular.module('sysAdminCommon', []);

sysAdminCommonModule.service('commonUtil', ['$http', 'OWARoutesUtil', '$q' , 
    function($http, OWARoutesUtil, $q){
    return {
  
        checkWebAdminPropertyForUserAccess : function () {
            var def = $q.defer();
            var requestUrl = OWARoutesUtil.getOpenmrsUrl() + "/ws/rest/owa/allowModuleWebUpload";
            var response = false;
            $http.get(requestUrl, {})
                .success(function (data) { 
                    def.resolve(data);
                })
                .error(function (data) { 
                    def.resolve(data);   
                });
                return def.promise;    
        }
    };
    
}]);
