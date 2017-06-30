
var encounters = angular.module('encountersController', ['OWARoutes']);

encounters.controller('searchEncounterCtrl', ['$scope','$http','OWARoutesUtil','$rootScope', function($scope,$http,OWARoutesUtil,$rootScope){
    
      // *** /OpenMRS breadcrumbs ***  
      $rootScope.$emit("updateBreadCrumb", {breadcrumbs : [["Home","#"],["Encounters","#/search-encounters"]]});
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

encounters.controller('manageEncounterCtrl', ['$scope','$http','OWARoutesUtil', function($scope,$http,OWARoutesUtil){
 
 
}]);

encounters.controller('manageEncounterTypeCtrl', ['$scope','$http','OWARoutesUtil','$location', function($scope,$http,OWARoutesUtil,$location){
    $scope.searchText = null;
    
    $scope.getEncounterTypes = function() {
       $scope.encounterTypeFound=false;
        if(typeof($scope.searchedEncounterTypeData)!=undefined){
            delete $scope.searchedEncounterTypeData;
        }
        
       var searchValue = $scope.searchText;
        var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/encountertype";
        $http.get(requestUrl, {params:{ v : 'default'}})
       .success(function (data){ // GET REQUEST ERROR HANDLE
            console.log("success");
            $scope.encounterTypeFound=true;
            $scope.searchedEncounterTypeData=data.results;
        }).error(function (data){ // GET REQUEST ERROR HANDLE
            console.log("error");
            $scope.encounterTypeFound=false;
             // $scope.downloadErrorMsg="Could not download the Module";
        });
        
    }
 
    
    $scope.searchEncounterTypes = function() {
       $scope.encounterTypeFound=false;
        if(typeof($scope.searchedEncounterTypeData)!=undefined){
            delete $scope.searchedEncounterTypeData;
        }
        
       var searchValue = $scope.searchText;
        var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/encountertype";
        $http.get(requestUrl, {params:{q : searchValue, v : 'full'}})
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
        angular.element('#addEncounterModal').modal('hide');
        $scope.searchText = null; // auto reload the Encounter Types
        console.log("location changed");
        
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

        	console.log("Encounter Type Saved");
            
        })
        .error(function (data, status, headers, config) {
            console.log("Encounter Type couldn't Saved");
        });
    }    
    
    $scope.encounterTypeEdit = function(Uuid){
        console.log(Uuid);
        
        
        $scope.requestEncounterType=false;
//        if(typeof($scope.requestEncounterTypeData)!=undefined){
//            delete $scope.requestEncounterTypeData;
//        }
        var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/encountertype/"+Uuid;
        $http.get(requestUrl, {params:{v : 'full'}})
        .success(function (data){ // GET REQUEST ERROR HANDLE
            $scope.requestEncounterType=true;
           // $scope.requestEncounterTypeData=data.results;
            $scope.encounterTypeUuid=data.uuid;
            $scope.encounterTypeName=data.display;
            angular.element('#addEncounterModal').modal('show');
        }).error(function (data){ // GET REQUEST ERROR HANDLE
            console.log("error");
            $scope.requestEncounterType=false;
             // $scope.downloadErrorMsg="Could not download the Module";
        });
    }
}]);

encounters.controller('manageEncounterRoleCtrl', ['$scope','$http','OWARoutesUtil', function($scope,$http,OWARoutesUtil){
 
 
}]);