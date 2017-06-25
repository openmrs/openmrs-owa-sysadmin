
var managemoduleController = angular.module('managemoduleController', ['OWARoutes']);


managemoduleController.controller('ModuleListCtrl', 
		['$scope', 'loadClasses', 'ModulesServicess', '$location', '$route', '$routeParams', 'OWARoutesUtil', '$http' , '$rootScope', 
        function($scope, loadClasses, ModulesServicess, $location, $route, $routeParams, OWARoutesUtil, $http , $rootScope) {


	$scope.classes = loadClasses;
	//loadClasses is resolve function, it returns array of concept class objects using ClassesService service
		
	$scope.go = function ( path ) {
		$location.path( path );
	};

	$scope.redirect = function(){
  		window.location = "#/page.html";
	}
	
	//holds objects of selected checkboxes
	$scope.selected = {};

	$scope.deleteSelected = function(){
	    angular.forEach($scope.selected, function(key,value){
	        if(key){
	        	ModulesServicess.deleteClass({uuid : value});
	        }
	    });
	    //updates classes list in scope after deletion
	    ModulesServicess.getAll().then(function(data) {
	    	$scope.classes = data;
	    	$route.reload();});
	}

	$scope.classAdded = $routeParams.classAdded;

	$scope.CommonStartModule = function(){
		// call CommonStartModule
		 $rootScope.$emit("StartModule", {});
	}

	$scope.CommonStopModule = function(){

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


}]);


managemoduleController.controller('ModuleView', ['$scope', 'ModulesServicess', '$routeParams','$http','OWARoutesUtil' , '$rootScope',  function($scope, ModulesServicess, $routeParams, $http, OWARoutesUtil, $rootScope ) {
      $scope.singleClass = ModulesServicess.getClass({uuid : $routeParams.classUUID});

      $scope.StartModule = function(moduleUuid){
      	//console.log("start module");

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
	
      $scope.StopModule = function(moduleUuid){
      	//console.log("Stop module");

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

        	$scope.stopModuleSuccess="Module Started successfully.";
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

  }]);



managemoduleController.controller('ModuleEditCtrl', ['$scope', 'ModulesServicess', '$routeParams',  function($scope, ModulesServicess, $routeParams ) {
      $scope.singleClass = ModulesServicess.getClass({uuid : $routeParams.classUUID});
  }]);

