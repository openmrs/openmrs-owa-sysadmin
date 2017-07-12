
var encounters = angular.module('encountersController', ['OWARoutes']);

mainModule.service('encountersService',['$http', 'OWARoutesUtil','$q', function ($http, OWARoutesUtil,$q) {
    
    return{
        getEncounterType : function(){
            var def = $q.defer();
            var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/encountertype";
            $http.get(requestUrl, {params:{includeAll : 'true' , v : 'default'}})
            .success(function (data, status){ // GET REQUEST SUCCESS HANDLE
                def.resolve(["GET",1,data,status]);
            }).error(function (data,status){ // GET REQUEST ERROR HANDLE
                def.resolve(["GET",0,data,status]);
            });
            return def.promise;
        },
        getForms: function(){
            var def = $q.defer();
            var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/form";
            $http.get(requestUrl, {params:{ v : 'default'}})
            .success(function (data, status){ // GET REQUEST SUCCESS HANDLE
                def.resolve(["GET",1,data,status]);
            }).error(function (data,status){ // GET REQUEST ERROR HANDLE
                def.resolve(["GET",0,data,status]);
            });
            return def.promise;
        },
        getEncounterRoles: function(){
            var def = $q.defer();
            var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/encounterrole";
            $http.get(requestUrl, {params:{ includeAll : 'true' , v : 'default'}})
            .success(function (data, status){ // GET REQUEST SUCCESS HANDLE
                def.resolve(["GET",1,data,status]);
            }).error(function (data,status){ // GET REQUEST ERROR HANDLE
                def.resolve(["GET",0,data,status]);
            });
            return def.promise;
        },
        getProviders: function(){
            var def = $q.defer();
            var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/provider";
            $http.get(requestUrl, {params:{ v : 'default'}})
            .success(function (data, status){ // GET REQUEST SUCCESS HANDLE
                def.resolve(["GET",1,data,status]);
            }).error(function (data,status){ // GET REQUEST ERROR HANDLE
                def.resolve(["GET",0,data,status]);
            });
            return def.promise;
        },
        getVisits: function(){
            var def = $q.defer();
            var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/visit";
            $http.get(requestUrl, {params:{ v : 'default'}})
            .success(function (data, status){ // GET REQUEST SUCCESS HANDLE
                def.resolve(["GET",1,data,status]);
            }).error(function (data,status){ // GET REQUEST ERROR HANDLE
                def.resolve(["GET",0,data,status]);
            });
            return def.promise;
        }
    }
}
]);

encounters.controller('searchEncounterCtrl', ['$scope','$http','OWARoutesUtil','$rootScope', function($scope,$http,OWARoutesUtil,$rootScope){
    
      // *** /OpenMRS breadcrumbs ***  
      $rootScope.$emit("updateBreadCrumb", {breadcrumbs : [["SysAdmin","#"],["Encounters",""]]});
      // *** /OpenMRS breadcrumbs ***    
    
    $scope.searchText = null;

    $scope.getDateFormat = function(timestamp) {
        return new Date(timestamp);
    }
    
    $scope.change = function() {
       $scope.encounterFound=false;
        if(typeof($scope.searchedEncounterData)!=undefined){
            delete $scope.searchedEncounterData;
        }
        
       var searchValue = $scope.searchText;
        //var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/encounter?q="+text+"&v=default";
        var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/encounter";
        console.log(searchValue);
        $http.get(requestUrl, {params:{q : searchValue, v : 'default'}})
       .success(function (data){ // GET REQUEST ERROR HANDLE
            //console.log("success");
            $scope.encounterFound=true;
            $scope.searchedEncounterData=data.results;
        }).error(function (data){ // GET REQUEST ERROR HANDLE
            console.log("error");
            $scope.encounterFound=false;
             // $scope.downloadErrorMsg="Could not download the Module";
        });
        
    }
 
}]);

encounters.controller('AddNewEncounterCtrl', ['$scope','$http','OWARoutesUtil','mainService', 'encountersService', function($scope,$http,OWARoutesUtil,mainService,encountersService){
 
    $scope.saveEncounter = function(){
        //2017-07-11T00:00:00.000+0530
        var encounterData = {
          "obs": [],
          "encounterProviders": [],
          "form": $scope.encounterForm,
          "provider": [],
          "patient": "19a07a3d-0a55-4508-bb46-a980ede1e067",//$scope.patientName,
          "location": $scope.encounterLocation,
          "orders": [],
          "encounterDatetime": "2017-07-11T00:00:00.000+0530",//$scope.encounterDate,
          "encounterDatetime": $scope.encounterDate,
          "visit": $scope.encounterVisit,
          "encounterType": $scope.encounterType
        }
        console.log(encounterData);
        
      	var uploadUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/encounter";

      	$http.post(uploadUrl, encounterData ,  {
            headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'}
        }) .success(function (data, status, headers, config) {
           // $scope.savedEncounterType=[1,"Encounter saved successfully"];
            //$scope.searchEncounterTypes();
        	console.log("Encounter Type Saved");
            
        })
        .error(function (data, status, headers, config) {
            //$scope.savedEncounterType=[0,"Couldn't save Encounter"];
            console.log("Encounter Type couldn't Saved");
        });
        

    }
    
    $scope.addOpenMRSLocations=function(){
        $scope.requestOpenMRSLocation=false;
        var response = mainService.getOpenMRSLocation();
        response.then(function(result){            
            if(result[0]=="GET"){
                if(result[1]==1){
                    $scope.OpenMRSLocationData=result[2].results;
                }
            }
        });
    }
    
    $scope.getEncounterTypes = function() {
        var response = encountersService.getEncounterType();
        response.then(function(result){            
            if(result[0]=="GET"){
                if(result[1]==1){
                    $scope.EncounterTypeData=result[2].results;
                }
            }
        });
    }
    
    $scope.getForm = function() {
        var response = encountersService.getForms();
        response.then(function(result){            
            if(result[0]=="GET"){
                if(result[1]==1){
                    $scope.fromData=result[2].results;
                }
            }
        });
    }
    
    $scope.getEncounterRole = function() {
        var response = encountersService.getEncounterRoles();
        response.then(function(result){            
            if(result[0]=="GET"){
                if(result[1]==1){
                    $scope.encounterRoleData=result[2].results;
                }
            }
        });
    }
    
    $scope.getProviders = function() {
        var response = encountersService.getProviders();
        response.then(function(result){            
            if(result[0]=="GET"){
                if(result[1]==1){
                    $scope.providerData=result[2].results;
                }
            }
        });
    }

    $scope.getVisits = function() {
        var response = encountersService.getVisits();
        response.then(function(result){            
            if(result[0]=="GET"){
                if(result[1]==1){
                    $scope.visitData=result[2].results;
                }
            }
        });
    }
    
    $scope.contacts = [];
    $scope.addMoreProviderBox = function(){
         $scope.contacts.push({ encounterRole: '' , providername : ''});
    }
 
}]);

encounters.controller('manageEncounterTypeCtrl', ['$scope','$http','OWARoutesUtil','$location', function($scope,$http,OWARoutesUtil,$location){
    $scope.searchText = null;
    
    $scope.getEncounterTypes = function() {
       $scope.encounterTypeFound=false;
        if(typeof($scope.searchedEncounterTypeData)!=undefined){
            delete $scope.searchedEncounterTypeData;
        }
        var response = mainService.getEncounterType();
        response.then(function(result){            
            if(result[0]=="GET"){
                if(result[1]==1){
                    $scope.encounterTypeFound=true;
                    $scope.searchedEncounterTypeData=result[2].results;
                }
                else{
                    $scope.encounterTypeFound=false;
                }
            }
        });

        
    }
 
    
    $scope.searchEncounterTypes = function() {
       $scope.encounterTypeFound=false;
        if(typeof($scope.searchedEncounterTypeData)!=undefined){
            delete $scope.searchedEncounterTypeData;
        }
        
       var searchValue = $scope.searchText;
        var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/encountertype";
        $http.get(requestUrl, {params:{q : searchValue, includeAll : 'true' , v : 'full'}})
       .success(function (data){ // GET REQUEST ERROR HANDLE
            //console.log("success");
            if(data.results.length>0){
                $scope.encounterTypeFound=true;
                $scope.searchedEncounterTypeData=data.results;
            }
            else{
                $scope.encounterTypeFound=false;
            }
        }).error(function (data){ // GET REQUEST ERROR HANDLE
            console.log("error");
            $scope.encounterTypeFound=false;
             // $scope.downloadErrorMsg="Could not download the Module";
        });
    }
    
    $scope.getPrivilege = function() {
       $scope.PrivilegeFound=false;
        if(typeof($scope.PrivilegeData)!=undefined){
            delete $scope.PrivilegeData;
        }
        var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/privilege";
        $http.get(requestUrl, {params:{v : 'default'}})
       .success(function (data){ // GET REQUEST ERROR HANDLE
            //console.log("success");
//            var x2js = new X2JS();
//            var JsonSuccessResponse = x2js.xml_str2json(data);
            
            $scope.PrivilegeFound=true;
            $scope.PrivilegeData=data.results;
        }).error(function (data){ // GET REQUEST ERROR HANDLE
            console.log("error");
            $scope.PrivilegeFound=false;
             // $scope.downloadErrorMsg="Could not download the Module";
        });
    }
    
    
    $scope.saveEncounterType= function(){
        if(typeof($scope.savedEncounterType)!=undefined){
            delete $scope.savedEncounterType;
        }
        angular.element('#addEncounterModal').modal('hide');
      	var uploadUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/encountertype";
      	var moduleData = 
                     {
                         "display": $scope.encounterTypeName,
                         "name": $scope.encounterTypeName,
                         "description" : $scope.encounterTypeDescription
                     };

      	$http.post(uploadUrl, moduleData ,  {
            headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'}
        }) .success(function (data, status, headers, config) {
//            $scope.searchText = null; // auto reload the Encounter Types
            $scope.savedEncounterType=[1,"Encounter type saved successfully"];
            $scope.searchEncounterTypes();
        	console.log("Encounter Type Saved");
            
        })
        .error(function (data, status, headers, config) {
            $scope.savedEncounterType=[0,"Couldn't save Encounter type"];
            console.log("Encounter Type couldn't Saved");
        });
    }    
    
    $scope.updateEncounterType=function(encounterTypeUuid){
        if(typeof($scope.savedEncounterType)!=undefined){
            delete $scope.savedEncounterType;
        }
        angular.element('#addEncounterModal').modal('hide');
      	var uploadUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/encountertype/"+encounterTypeUuid;
      	var moduleData = 
                     {
                         "display": $scope.encounterTypeName,
                         "name": $scope.encounterTypeName,
                         "description" : $scope.encounterTypeDescription
                     };
        console.log(moduleData);
      	$http.post(uploadUrl, moduleData ,  {
            headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'}
        }) .success(function (data, status, headers, config) {
//            $scope.searchText = null; // auto reload the Encounter Types
            $scope.savedEncounterType=[1,"Encounter type updated successfully"];
            $scope.searchEncounterTypes();
        	console.log("Encounter Type updated");
        })
        .error(function (data, status, headers, config) {
            $scope.savedEncounterType=[0,"Couldn't update Encounter type"];
            console.log("Encounter Type couldn't update");
            
        });
    }
    
    $scope.encounterTypeEdit = function(Uuid){
        console.log(Uuid);
        
        $scope.requestEditEncounterType=false;
        var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/encountertype/"+Uuid;
        $http.get(requestUrl, {params:{v : 'full'}})
        .success(function (data){ // GET REQUEST ERROR HANDLE
            $scope.requestEditEncounterType=true;
            $scope.encounterTypeUuid=data.uuid;
            $scope.encounterTypeName=data.display;
            $scope.encounterTypeDescription=data.description;
            angular.element('#addEncounterModal').modal('show');
        }).error(function (data){ // GET REQUEST ERROR HANDLE
            console.log("error");
            $scope.requestEditEncounterType=false;
        });
    }
    
    $scope.encounterTypeRetire = function(Uuid,value){
        console.log(Uuid);
        if(typeof($scope.savedEncounterType)!=undefined){
            delete $scope.savedEncounterType;
        }
      	var moduleData = 
                     {
                         "retired": value
                     };
        $scope.requestEditEncounterType=false;
        var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/encountertype/"+Uuid;
        $http.post(requestUrl, moduleData)
        .success(function (data){ // GET REQUEST ERROR HANDLE
            $scope.savedEncounterType=[1,"Encounter type retried successfully"];
            $scope.searchEncounterTypes();
             console.log("retired");
        }).error(function (data){ // GET REQUEST ERROR HANDLE
            console.log("error");
            $scope.savedEncounterType=[0,"Couldn't retire Encounter type"];
        });
    }
    
    $scope.encounterTypeDelete = function(Uuid){
        console.log(Uuid);
        if(typeof($scope.savedEncounterType)!=undefined){
            delete $scope.savedEncounterType;
        }
        $scope.requestEditEncounterType=false;
        var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/encountertype/"+Uuid;
        $http.delete(requestUrl, {params : {purge : 'true'}})
        .success(function (data){ // GET REQUEST ERROR HANDLE
            $scope.savedEncounterType=[1,"Encounter type deleted successfully"];
            $scope.searchEncounterTypes();
             console.log("deleted");
        }).error(function (data){ // GET REQUEST ERROR HANDLE
            console.log("error");
            $scope.savedEncounterType=[0,"Couldn't delete Encounter type"];
        });
    }
    
    $scope.openEncounterTypeModal=function(){
        $scope.requestEditEncounterType=false;
        // clear variables
        $scope.encounterTypeUuid='';
        $scope.encounterTypeName='';
        $scope.encounterTypeDescription='';
        if(typeof($scope.savedEncounterType)!=undefined){
            delete $scope.savedEncounterType;
        }
        angular.element('#addEncounterModal').modal('show');
    }
}]);

encounters.controller('manageEncounterRoleCtrl', ['$scope','$http','OWARoutesUtil', 'mainService', function($scope,$http,OWARoutesUtil,mainService){
 
     $scope.searchText = null;
    
    $scope.getEncounterRoles = function() {
       $scope.encounterRoleFound=false;
        if(typeof($scope.searchedEncounterRoleData)!=undefined){
            delete $scope.searchedEncounterRoleData;
        }
        var response = mainService.getEncounterRoles();
        response.then(function(result){            
            if(result[0]=="GET"){
                if(result[1]==1){
                    $scope.encounterRoleFound=true;
                    $scope.searchedEncounterRoleData=result[2].results;
                }
                else{
                    $scope.encounterRoleFound=false;
                }
            }
        });
//       var searchValue = $scope.searchText;
//        var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/encounterrole";
//        $http.get(requestUrl, {params:{ includeAll : 'true' , v : 'default'}})
//       .success(function (data){ // GET REQUEST ERROR HANDLE
//            console.log("success");
//            $scope.encounterRoleFound=true;
//            $scope.searchedEncounterRoleData=data.results;
//        }).error(function (data){ // GET REQUEST ERROR HANDLE
//            console.log("error");
//            $scope.encounterRoleFound=false;
//             // $scope.downloadErrorMsg="Could not download the Module";
//        });
        
    }
 
    
    $scope.searchEncounterRoles = function() {
       $scope.encounterRoleFound=false;
        if(typeof($scope.searchedEncounterRoleData)!=undefined){
            delete $scope.searchedEncounterRoleData;
        }
        
       var searchValue = $scope.searchRoleText;
        var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/encounterrole";
        $http.get(requestUrl, {params:{q : searchValue, includeAll : 'true' ,v : 'full'}})
       .success(function (data){ // GET REQUEST ERROR HANDLE
            //console.log("success");
            if(data.results.length>0){
                $scope.encounterRoleFound=true;
                $scope.searchedEncounterRoleData=data.results;
            }
            else{
                $scope.encounterRoleFound=false;
            }
        }).error(function (data){ // GET REQUEST ERROR HANDLE
            console.log("error");
            $scope.encounterRoleFound=false;
             // $scope.downloadErrorMsg="Could not download the Module";
        });
    }
    
    $scope.getPrivilege = function() {
       $scope.PrivilegeFound=false;
        if(typeof($scope.PrivilegeData)!=undefined){
            delete $scope.PrivilegeData;
        }
        var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/privilege";
        $http.get(requestUrl, {params:{v : 'default'}})
       .success(function (data){ // GET REQUEST ERROR HANDLE
            //console.log("success");
//            var x2js = new X2JS();
//            var JsonSuccessResponse = x2js.xml_str2json(data);
            
            $scope.PrivilegeFound=true;
            $scope.PrivilegeData=data.results;
        }).error(function (data){ // GET REQUEST ERROR HANDLE
            console.log("error");
            $scope.PrivilegeFound=false;
             // $scope.downloadErrorMsg="Could not download the Module";
        });
    }
    
    
    $scope.saveEncounterRole= function(){
        if(typeof($scope.savedEncounterRole)!=undefined){
            delete $scope.savedEncounterRole;
        }
        angular.element('#addEncounterRoleModal').modal('hide');
      	var uploadUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/encounterrole";
      	var moduleData = 
                     {
                         "display": $scope.encounterRoleName,
                         "name": $scope.encounterRoleName,
                         "description" : $scope.encounterRoleDescription
                     };

      	$http.post(uploadUrl, moduleData ,  {
            headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'}
        }) .success(function (data, status, headers, config) {
//            $scope.searchText = null; // auto reload the Encounter Types
            $scope.savedEncounterRole=[1,"Encounter Role saved successfully"];
            $scope.searchEncounterRoles();
        	console.log("Encounter Role Saved");
            
        })
        .error(function (data, status, headers, config) {
            $scope.savedEncounterRole=[0,"Couldn't save Encounter Role"];
            console.log("Encounter Role couldn't Saved");
        });
    }    
    
    $scope.updateEncounterRole=function(encounterRoleUuid){
        if(typeof($scope.savedEncounterRole)!=undefined){
            delete $scope.savedEncounterRole;
        }
        angular.element('#addEncounterRoleModal').modal('hide');
      	var uploadUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/encounterrole/"+encounterRoleUuid;
      	var moduleData = 
                     {
                         "display": $scope.encounterRoleName,
                         "name": $scope.encounterRoleName,
                         "description" : $scope.encounterRoleDescription
                     };
        console.log(moduleData);
      	$http.post(uploadUrl, moduleData ,  {
            headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'}
        }) .success(function (data, status, headers, config) {
//            $scope.searchText = null; // auto reload the Encounter Types
            $scope.savedEncounterRole=[1,"Encounter Role updated successfully"];
            $scope.searchEncounterRoles();
        	console.log("Encounter Role updated");
        })
        .error(function (data, status, headers, config) {
            $scope.savedEncounterRole=[0,"Couldn't update Encounter Role"];
            console.log("Encounter Role couldn't update");
            
        });
    }
    
    $scope.encounterRoleEdit = function(Uuid){
        console.log(Uuid);
        
        $scope.requestEditEncounterRole=false;
        var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/encounterrole/"+Uuid;
        $http.get(requestUrl, {params:{v : 'full'}})
        .success(function (data){ // GET REQUEST ERROR HANDLE
            $scope.requestEditEncounterRole=true;
            $scope.encounterRoleUuid=data.uuid;
            $scope.encounterRoleName=data.display;
            $scope.encounterRoleDescription=data.description;
            angular.element('#addEncounterRoleModal').modal('show');
        }).error(function (data){ // GET REQUEST ERROR HANDLE
            console.log("error");
            $scope.requestEditEncounterRole=false;
        });
    }
    
    $scope.encounterRoleRetire = function(Uuid,value){
        console.log(Uuid);
        if(typeof($scope.savedEncounterRole)!=undefined){
            delete $scope.savedEncounterRole;
        }
      	var moduleData = 
                     {
                         "retired": value
                     };
        $scope.requestEditEncounterRole=false;
        var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/encounterrole/"+Uuid;
        $http.post(requestUrl, moduleData)
        .success(function (data){ // GET REQUEST ERROR HANDLE
            $scope.savedEncounterRole=[1,"Encounter Role retried successfully"];
            $scope.searchEncounterRoles();
             console.log("retired");
        }).error(function (data){ // GET REQUEST ERROR HANDLE
            console.log("error");
            $scope.savedEncounterRole=[0,"Couldn't retire Encounter Role"];
        });
    }
    
    $scope.encounterRoleDelete = function(Uuid){
        console.log(Uuid);
        if(typeof($scope.savedEncounterRole)!=undefined){
            delete $scope.savedEncounterRole;
        }
        $scope.requestEditEncounterRole=false;
        var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/encounterrole/"+Uuid;
        $http.delete(requestUrl, {params : {purge : 'true'}})
        .success(function (data){ // GET REQUEST ERROR HANDLE
            $scope.savedEncounterRole=[1,"Encounter Role deleted successfully"];
            $scope.searchEncounterRoles();
             console.log("deleted");
        }).error(function (data){ // GET REQUEST ERROR HANDLE
            console.log("error");
            $scope.savedEncounterRole=[0,"Couldn't delete Encounter Role"];
        });
    }
    
    $scope.openEncounterRoleModal=function(){
        $scope.requestEditEncounterRole=false;
        // clear variables
        $scope.encounterRoleUuid='';
        $scope.encounterRoleName='';
        $scope.encounterRoleDescription='';
        if(typeof($scope.savedEncounterRole)!=undefined){
            delete $scope.savedEncounterRole;
        }
        angular.element('#addEncounterRoleModal').modal('show');
    }
}]);