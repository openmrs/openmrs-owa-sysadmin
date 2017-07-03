 
var moduleServicesModule = angular.module('moduleServices', ['ngResource','OWARoutes']);
 
moduleServicesModule
.factory('Util', [function(){
	return {
		/**
		 * @returns openmrs server url
		 */
		getOpenmrsUrl: function(){
			var location = window.location.toString();
			return location.substring(0, location.indexOf('/owa/'));
		}
	}
}])
.factory('Classes',['$resource', 'Util','OWARoutesUtil', function($resource, Util, OWARoutesUtil){
	// console.log(' Service Classed : Started');
	return $resource(OWARoutesUtil.getOpenmrsUrl()+'/ws/rest/v1/module/:uuid?:mode', {}, 
			//Returns all classes as results object
				{getAll: {method:'GET', params:{mode : 'v=full'}, isArray:false},
			//Returns single class
				 getClass: {method: 'GET', params:{mode : 'v=full'}, isArray:false },
			//deletes class with specified uuid
				 deleteClass: {method: 'DELETE'},
			//uplaod module
				 uploadModule: {method: 'POST',headers: { 'Content-Type': 'multipart/form-data'}, isArray:false},
			//Adds new class
				 addClass: {method: 'POST', isArray:false}});
		
}])
.factory('ModulesServicess', ['Classes', function(Classes){
   return{
	   /**
	    * unwraps results object
	    * @returns array of concept class objects
	    */
	   getAll: function(){
		   return Classes.getAll().$promise.then(function(response){
		   	 	// console.log(' Service Function : getAll()');
			   return response.results;
		   });
	   },
	   /**
	    * fetches single concept class
	    * @param uuid the uuid of concept class which will be fetched
	    * @returns concept class object
	    */
	   getClass: function(uuid){
	   		// console.log(' Service Function : getClass()');
		   return Classes.getClass(uuid);
	   },
	   //wraps Classes.getClass function
	   deleteClass: function(uuid){
	   		// console.log(' Service Function : deleteClass()');
		   return Classes.deleteClass(uuid);
		   
	   },
	   uploadModule: function(newClass){
	   	 // console.log(' Service Function : uploadModule()');
		   return Classes.uploadModule(newClass).$promise;
		  
	   }
   }
}]);