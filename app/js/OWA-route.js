 
var OWARoutes = angular.module('OWARoutes', []);
 
OWARoutes
.factory('OWARoutesUtil', [function(){
	return {
		/**
		 * @returns openmrs server url
		 */
		getOpenmrsUrl: function(){
			// http://localhost:8080/openmrs/server1/owa/ManageModule/managemodule.html#/system-info

			var location = window.location.toString();
			var serverLocation= location.substring(0, location.indexOf('/owa/')); // http://localhost:8080/openmrs/server1
			var last_string=serverLocation.substring(serverLocation.lastIndexOf('/')+1,serverLocation.length).toLowerCase(); // server1

			var finallocation=serverLocation;
			//console.log(finallocation);
			var isOpenMRS=last_string.indexOf('openmrs');
			//console.log(isOpenMRS);

			if(isOpenMRS<0){
				finallocation=serverLocation.substring(0, serverLocation.lastIndexOf('/')); // http://localhost:8080/openmrs
			}
			//console.log(finallocation);
			//console.log(finallocation);
			return finallocation;
		}
	}
}]);