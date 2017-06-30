
var managemoduleController = angular.module('managemoduleController', ['OWARoutes']);


managemoduleController.controller('ModuleListCtrl', 
		['$scope', '$location', '$route', '$routeParams', 'OWARoutesUtil', '$http' , '$rootScope', 
        function($scope, $location, $route, $routeParams, OWARoutesUtil, $http , $rootScope) {
    
    
      // *** /OpenMRS breadcrumbs ***  
      $rootScope.$emit("updateBreadCrumb", {breadcrumbs : [["Home","#"],["Modules","#/module-show"]]});
      // *** /OpenMRS breadcrumbs ***
	
	$scope.go = function ( path ) {
		$location.path( path );
	};

	$scope.redirect = function(){
  		window.location = "#/page.html";
	}
	
	//holds objects of selected checkboxes
	$scope.selected = {};

        
    $scope.StartModule = function(moduleUuid,resource){
      	console.log("start module");

      	if(typeof($scope.startModuleSuccess)!=undefined){
            delete $scope.startModuleSuccess;
        }
      	 if(typeof($scope.startModuleError)!=undefined){
            delete $scope.startModuleError;
        }

      	var uploadUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/moduleaction";
      	var moduleData = 
                     {
                         "action": "start",
                         "modules": [moduleUuid]
                     };

      	$http.post(uploadUrl, moduleData ,  {
            headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'}
        }) .success(function (data, status, headers, config) {
            if(resource=="ALLMODULES"){
                $scope.getAllModuleDetails();
            }
            else {
                $scope.getModuleViewDetails();
            }
        	$scope.startModuleSuccess="Module Started successfully.";
        })
        .error(function (data, status, headers, config) {
        		console.log(status);
        		console.log(config);
        		console.log(headers);
        		
        		var x2js = new X2JS();
                var JsonSuccessResponse = x2js.xml_str2json(data);

                if (typeof(JsonSuccessResponse["org.openmrs.module.webservices.rest.SimpleObject"].map.string) != "undefined"){
                    // File Error Catched
                    if (typeof(JsonSuccessResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["linked-hash-map"].entry.string) != "undefined"){
                        // Error Message given
                        $scope.startModuleError=JsonSuccessResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["linked-hash-map"].entry.string;
                    }
                    else{
                        // Unknown Error Message
                        $scope.startModuleError="Could not Start this Module!"
                    }
                }
                else{
                    //unknown Error
                    $scope.startModuleError="Could not Start this Module!"
                }
        });
      }
	
      $scope.StopModule = function(moduleUuid,resource){
      	console.log("Stop module");

      	if(typeof($scope.stopModuleSuccess)!=undefined){
            delete $scope.stopModuleSuccess;
        }
        if(typeof($scope.stopModuleError)!=undefined){
            delete $scope.stopModuleError;
        }

      	var uploadUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/moduleaction";
      	var moduleData = 
                     {
                         "action": "stop",
                         "modules": [moduleUuid]
                     };

      	$http.post(uploadUrl, moduleData ,  {
            headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'}
        }) .success(function (data, status, headers, config) {
            if(resource=="ALLMODULES"){
                $scope.getAllModuleDetails();
            }
            else {
                $scope.getModuleViewDetails();
            }
        	$scope.stopModuleSuccess="Module Stoped successfully.";
        })
        .error(function (data, status, headers, config) {

        		var x2js = new X2JS();
                var JsonSuccessResponse = x2js.xml_str2json(data);

                if (typeof(JsonSuccessResponse["org.openmrs.module.webservices.rest.SimpleObject"].map.string) != "undefined"){
                    // File Error Catched
                    if (typeof(JsonSuccessResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["linked-hash-map"].entry.string) != "undefined"){
                        // Error Message given
                        $scope.stopModuleError=JsonSuccessResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["linked-hash-map"].entry.string;
                    }
                    else{
                        // Unknown Error Message
                        $scope.stopModuleError="Could not Stop this Module!"
                    }
                }
                else{
                    //unknown Error
                    $scope.stopModuleError="Could not Stop this Module!"
                }
        });
      }
    
      
      $scope.unloadModule = function(moduleUuid){
      	console.log("Unload module");

      	if(typeof($scope.unloadModuleSuccess)!=undefined){
            delete $scope.unloadModuleSuccess;
        }
        if(typeof($scope.unloadModuleError)!=undefined){
            delete $scope.unloadModuleError;
        }

      	var uploadUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/moduleaction";
      	var moduleData = 
                     {
                         "action": "unload",
                         "modules": [moduleUuid]
                     };

      	$http.post(uploadUrl, moduleData ,  {
            headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'}
        }) .success(function (data, status, headers, config) {
            $scope.getAllModuleDetails();
        	$scope.unloadModuleSuccess="Module Unloaded successfully.";
        })
        .error(function (data, status, headers, config) {

        		var x2js = new X2JS();
                var JsonSuccessResponse = x2js.xml_str2json(data);

                if (typeof(JsonSuccessResponse["org.openmrs.module.webservices.rest.SimpleObject"].map.string) != "undefined"){
                    // File Error Catched
                    if (typeof(JsonSuccessResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["linked-hash-map"].entry.string) != "undefined"){
                        // Error Message given
                        $scope.unloadModuleError=JsonSuccessResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["linked-hash-map"].entry.string;
                    }
                    else{
                        // Unknown Error Message
                        $scope.unloadModuleError="Could not unload this Module!"
                    }
                }
                else{
                    //unknown Error
                    $scope.unloadModuleError="Could not unload this Module!"
                }
        });
      }
      
      
      
    $scope.StartAllModules = function(){
      	console.log("start all module");

      	if(typeof($scope.startAllModuleSuccess)!=undefined){
            delete $scope.startAllModuleSuccess;
        }
      	 if(typeof($scope.startAllModuleError)!=undefined){
            delete $scope.startAllModuleError;
        }

      	var uploadUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/moduleaction";
      	var moduleData = 
                     {
                         "action": "start",
                         "allModules": "true"
                     };

      	$http.post(uploadUrl, moduleData ,  {
            headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'}
        }) .success(function (data, status, headers, config) {
            $scope.getAllModuleDetails();
        	$scope.startAllModuleSuccess="Required action is compeleted. Please check the module's status";
        })
        .error(function (data, status, headers, config) {
        		var x2js = new X2JS();
                var JsonSuccessResponse = x2js.xml_str2json(data);

                if (typeof(JsonSuccessResponse["org.openmrs.module.webservices.rest.SimpleObject"].map.string) != "undefined"){
                    // File Error Catched
                    if (typeof(JsonSuccessResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["linked-hash-map"].entry.string) != "undefined"){
                        // Error Message given
                        $scope.startModuleError=JsonSuccessResponse["org.openmrs.module.webservices.rest.SimpleObject"].map["linked-hash-map"].entry.string;
                    }
                    else{
                        // Unknown Error Message
                        $scope.startModuleError="Could not complete this action!"
                    }
                }
                else{
                    //unknown Error
                    $scope.startModuleError="Could not complete this action!"
                }
        });
      }


    $scope.getModuleViewDetails= function(){
        
       // *** /OpenMRS breadcrumbs ***  
      $rootScope.$emit("updateBreadCrumb", {breadcrumbs : [["Home","#"],["Modules","#/module-show"], ["Module View","#/module-show/"+$routeParams.classUUID]]});
      // *** /OpenMRS breadcrumbs ***
        
        console.log("getModuleViewDetails");
        $scope.requestModuleViewDetails=false;
        if(typeof($scope.ModuleViewData)!=undefined){
            delete $scope.ModuleViewData;
        }
        var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/module/"+$routeParams.classUUID;
        $http.get(requestUrl, {params:{ v : 'full'}})
        .success(function (data){ // GET REQUEST SUCCESS HANDLE
            $scope.requestModuleViewDetails=true;
            $scope.ModuleViewData=data;
        }).error(function (data){ // GET REQUEST ERROR HANDLE
            console.log("error");
            $scope.requestModuleViewDetails=false;
        });
    }
    
    $scope.getAllModuleDetails= function(){
        
      // *** /OpenMRS breadcrumbs ***  
      $rootScope.$emit("updateBreadCrumb", {breadcrumbs : [["Home","#"],["Modules","#/module-show"]]});
      // *** /OpenMRS breadcrumbs ***
        
        console.log("getAllModuleDetails");
        $scope.requestAllModuleDetails=false;
        if(typeof($scope.AllModuleViewData)!=undefined){
            delete $scope.AllModuleViewData;
        }
        var requestUrl = OWARoutesUtil.getOpenmrsUrl()+"/ws/rest/v1/module";
        $http.get(requestUrl, {params:{ v : 'full'}})
        .success(function (data){ // GET REQUEST SUCCESS HANDLE
            $scope.requestAllModuleDetails=true;
            $scope.AllModuleViewData=data.results;
        }).error(function (data){ // GET REQUEST ERROR HANDLE
            console.log("error");
            $scope.requestAllModuleDetails=false;
        });
    }
    
}]);




managemoduleController.controller('ModuleEditCtrl', ['$scope', 'ModulesServicess', '$routeParams',  function($scope, ModulesServicess, $routeParams ) {
      $scope.singleClass = ModulesServicess.getClass({uuid : $routeParams.classUUID});
  }]);

