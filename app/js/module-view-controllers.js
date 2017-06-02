// console.log(' managemoduleController: Arrivrd');
var managemoduleController = angular.module('managemoduleController', []);
// console.log(' managemoduleController: Initilized');

 

managemoduleController.controller('ModuleListCtrl', 
		['$scope', 'loadClasses', 'ModulesServicess', '$location', '$route', '$routeParams',
        function($scope, loadClasses, ModulesServicess, $location, $route, $routeParams) {

    // console.log(' ModuleListCtrl : Started 1');
	$scope.classes = loadClasses;
	//loadClasses is resolve function, it returns array of concept class objects using ClassesService service
		
	$scope.go = function ( hash ) {
		$location.path( hash );
	};
	
	//holds objects of selected checkboxes
	$scope.selected = {};
	// console.log(' ModuleListCtrl : Started 2');
	//deletes selected classes

	$scope.deleteSelected = function(){
	    angular.forEach($scope.selected, function(key,value){
	        if(key){
	        	ModulesServicess.deleteClass({uuid : value});
	        	// console.log(' ModuleListCtrl : Deleted Modules Added');
	        }
	    });
	    //updates classes list in scope after deletion
	    ModulesServicess.getAll().then(function(data) {
	    	$scope.classes = data;
	    	$route.reload();});
	    	// console.log(' ModuleListCtrl : Modules loaded to list');
	}

	$scope.classAdded = $routeParams.classAdded;
	// console.log(' ModuleListCtrl : Started 3');
}]);


managemoduleController.controller('ModuleView', ['$scope', 'ModulesServicess', '$routeParams',  function($scope, ModulesServicess, $routeParams ) {
      $scope.singleClass = ModulesServicess.getClass({uuid : $routeParams.classUUID});
      // console.log(' ModuleView : Started 1');
  }]);

managemoduleController.controller('ModuleEditCtrl', ['$scope', 'ModulesServicess', '$routeParams',  function($scope, ModulesServicess, $routeParams ) {
      $scope.singleClass = ModulesServicess.getClass({uuid : $routeParams.classUUID});
  }]);



managemoduleController.controller('TestController', ['$scope', 'ModulesServicess', '$location', function($scope, ModulesServicess, $location){
	 
 	$scope.redirectToList = function() {
		$location.path('/module-show').search({classAdded: $scope.class.name});
	};

	$scope.cancel = function () {
		$scope.class.file = ' ';
		console.log(' ModuleUploadCtrl : cancle click');
		$location.path('/module-show').search({classAdded: ''});
	}
 

	
}]);

