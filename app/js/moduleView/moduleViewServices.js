 
var manageModuleService = angular.module('manageModuleService', ['OWARoutes']);

manageModuleService.service('ModuleService',['$http', 'OWARoutesUtil','$q', function ($http, OWARoutesUtil,$q) {
    
    return{
        uploadModules : function(moduleUrl){
                 ////////////////////////////////
                var def = $q.defer();
            
                  var fd = new FormData();
                  $http.get(moduleUrl, {responseType: "arraybuffer"})
                  .success(function (data){ // GET REQUEST ERROR HANDLE
                        var filename = moduleUrl.substring(moduleUrl.lastIndexOf('/')+1);
                        let blob = new Blob([data], {type: 'application/octet-stream'});  
                        var url=(window.URL).createObjectURL(blob);
                        var file = new File([data], filename, {type:"application/octet-stream", lastModified: new Date().getTime()});
                        fd.append('file', file);
                      
                    console.log("POST started...");
                      
                    var uploadUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/module/?"; //CHANGE
                    isUploading=true;

                 $http.post(uploadUrl, fd, {
                   transformRequest: angular.identity,
                   headers: { 
                    'Content-Type': undefined ,  
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'}
                  }) .success(function (data, status, headers, config) {  // POST REQUEST ERROR HANDLE
                     def.resolve(["UPLOAD",1,data,status]);
                 })
                      .error(function (data, status, header, config) { // POST REQUEST ERROR HANDLE
                        def.resolve(["UPLOAD",0,data,status]);
                 });
                }).error(function (data,status){ // GET REQUEST ERROR HANDLE
                      def.resolve(["DOWNLOAD",0,data,status]);
                });
                 return def.promise;
                ////////////////////////////////
        },
        getModuleDetails : function(moduleUuid){
            var def = $q.defer();
            var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/module/"+moduleUuid;
            $http.get(requestUrl, {params:{ v : 'full'}})
            .success(function (data, status){ // GET REQUEST SUCCESS HANDLE
                def.resolve(["GET",1,data,status]);
            }).error(function (data,status){ // GET REQUEST ERROR HANDLE
                def.resolve(["GET",0,data,status]);
            });
            return def.promise;
        },

        getModuleDetailsFromOnline : function(modulePackageName){
            var def = $q.defer();
            //var requestUrl = "https://modules.openmrs.org/modulus/api/search?q="+moduleLegacyId;
            var requestUrl = "https://addons-stg.openmrs.org/api/v1/addon?&modulePackage="+modulePackageName;
            //$http.jsonp(requestUrl)
            try{
                console.log("1");
                $http({
                    method: 'JSONP',
                    url: requestUrl,
                    params: {
                        format: 'jsonp',
                        json_callback: 'JSON_CALLBACK'
                    }
                }).then(function (data){ // GET REQUEST SUCCESS HANDLE
                    console.log("2");
                    // console.log("jsonp : " + status);
                    // if(status==200){
                    //     console.log("success")
                    //     def.resolve(["GET",1,data,status]);
                    // }
                    // else{
                    //     console.log("error")
                    //     def.resolve(["GET",0,data,status]);
                    // }
                    console.log("3");
                });
            }
            catch(err){
                console.log("4");
                console.log(err);
            }
            console.log("5");
            return def.promise;
        },

        // getModuleDetailsFromOnline : function(modulePackageName){
        //     var def = $q.defer();
        //     //var requestUrl = "https://modules.openmrs.org/modulus/api/search?q="+moduleLegacyId;
        //     var requestUrl = "https://addons-stg.openmrs.org/api/v1/addon?&modulePackage="+modulePackageName;
        //     //$http.jsonp(requestUrl)
        //     $http({
        //         url: requestUrl,
        //         method: 'JSONP',
        //     })
        //     .success(function (data, status){ // GET REQUEST SUCCESS HANDLE
        //         console.log("success")
        //         def.resolve(["GET",1,data,status]);
        //     }).error(function (data,status){ // GET REQUEST ERROR HANDLE
        //         console.log("eerrr : " + data);
        //         def.resolve(["GET",0,data,status]);
        //     });
        //     return def.promise;
        // },
        
        getAllModuleDetails : function(){
            var def = $q.defer();
            var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/module";
            $http.get(requestUrl, {params:{ v : 'full'}})
            .success(function (data,status){ // GET REQUEST SUCCESS HANDLE
                 def.resolve(["GET",1,data,status]);
            }).error(function (data,status){ // GET REQUEST ERROR HANDLE
                 def.resolve(["DOWNLOAD",0,data,status]);
            });
            return def.promise;
        },
        
        checkModuleUpdate : function(moduleUuid){
           var def = $q.defer();
         //  var searchValue = moduleUuid.replace(new RegExp(escapeRegExp(" "), 'g'), "-"); //replaceAll(" ","-");
            var searchValue =moduleUuid;
           var column_count=1;
           var columns="CVersion";
           var displayStart=0;
           var displayLength=15;

           //var urll="https://modules.openmrs.org/modulus/modules/findModules?callback=JSON_CALLBACK&sEcho=13&iColumns="+column_count+"&sColumns="+columns+"&iDisplayStart="+displayStart+"&iDisplayLength="+displayLength+"&bEscapeRegex=true&sSearch="+searchValue;
           // var urll="https://modules.openmrs.org/modulus/api/modules/"+searchValue;
            
           var urll="https://addons.openmrs.org/api/v1/addon/"+searchValue;
           $http({
             method: 'JSONP', 
             url: urll
           })
           .success(function(data,status) {
                def.resolve(["GET",1,data,status]);
                  })
           .error(function(data, status) {
                def.resolve(["GET",0,data,status]);
           });
           return def.promise;
        },
        
//        getModuleReleaseDetails : function(moduleId,releaseId){
//           var def = $q.defer();
//            var urll="https://modules.openmrs.org/modulus/api/modules/"+moduleId+"/"+releaseId
//           $http({
//             method: 'JSONP',
//             url: urll
//           })
//           .success(function(data,status) {
//                def.resolve(["GET",1,data,status]);
//                  })
//           .error(function(data, status) {
//                def.resolve(["GET",0,data,status]);
//           });
//           return def.promise;
//        }
    };
}]);
