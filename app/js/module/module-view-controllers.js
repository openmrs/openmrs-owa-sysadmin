
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
    
 
   $scope.checkModuleUpdate = function (moduleUuid, currentVersion){
       var searchValue = moduleUuid;
       var column_count=1;
       var columns="CVersion";
       var displayStart=0;
       var displayLength=15;

       var urll="https://modules.openmrs.org/modulus/modules/findModules?callback=JSON_CALLBACK&sEcho=13&iColumns="+column_count+"&sColumns="+columns+"&iDisplayStart="+displayStart+"&iDisplayLength="+displayLength+"&bEscapeRegex=true&sSearch="+searchValue;
       
       if(typeof($scope.moduleUpdateURL)!=undefined){
            delete $scope.moduleUpdateURL;
        }
       $scope.moduleNewUpdateFound="0"; // working
       $http({
         method: 'JSONP', 
         url: urll
       })
       .success(function(data) {
         if(data.iTotalDisplayRecords>0)
                {
            	  	// Modules Found
                    console.log("REST New Version : " + data.aaData[0][2]);
                    var compateValue = version_compare(currentVersion, data.aaData[0][2]);
                    if(compateValue==0){
                        // Same Version
                        $scope.moduleNewUpdateFound="-1"; // same version
                    }
                    else if(compateValue==1){
                        // New Version Found
                        $scope.moduleNewUpdateFound="1"; // found
                        $scope.moduleUpdateURL=data.aaData[0][0];
                    }
                    else if(compateValue==-1){
                        // Upto Data - Server contains older version
                        $scope.moduleNewUpdateFound="-1"; // no need of update
                    }
                    console.log(data.aaData[0][2] + " , " + currentVersion + " : " + compateValue)
            	  }
            	  else 
                  {
            	  	// No Modules Found
                    console.log("Error");
            	  	$scope.moduleNewUpdateFound=false;
            	  }
              })
       .error(function(data, status) {
            console.error('Repos error', status, data);
            $scope.moduleNewUpdateFound=false;
       });
        
   }

// ******* Version Compare ********
/*
Split a version string into components and map prefixes and suffixes to integers.
Examples:
- 1.0
- 2.0.4
- 1.4RC
- 0.7beta
*/
function version_bits(version) {
    console.log(version);
   //  console.log(typeof(version);
    version = version.replace(/(\d+)([^\d\.]+)/, "$1.$2");
    version = version.replace(/([^\d\.]+)(\d+)/, "$1.$2");    
    var parts = version.split('.'), 
        rmap = {
            'rc' : -1,
            'pre' : -2,            
            'beta' : -3,
            'b' : -3,            
            'alpha' : -4,
            'a' : -4,            
        },
        v, n;
    
    var bits = [];
    for (var i = 0; i < parts.length; ++i) {
        v = parts[i];
            
        n = parseInt(v, 10);
        if ( isNaN(n) ) {
            n = rmap[v] || -1;
        }
        bits.push(n);
    }    
    return bits;
}

/*
Compare different software version strings.
Returns 0 if same, -1 if version2 is older or 1 if version2 is newer.
*/
function version_compare(version1, version2) {
    console.log(version1+" , "+version2)
    var v1parts = version_bits(version1);
    var v2parts = version_bits(version2);
    var v2, v1;
    
    for (var i = 0; i < Math.max(v1parts.length, v2parts.length); ++i) {
        v1 = v1parts[i] || 0;
        v2 = v2parts[i] || 0;
        
        if (v2 > v1) {
            return 1;
        }
        else if (v1 > v2) {
            return -1;
        }
    }
        
    return 0;
}
// ******* Version Compare ********

            
}]);




managemoduleController.controller('ModuleEditCtrl', ['$scope', 'ModulesServicess', '$routeParams',  function($scope, ModulesServicess, $routeParams ) {
      $scope.singleClass = ModulesServicess.getClass({uuid : $routeParams.classUUID});
  }]);

