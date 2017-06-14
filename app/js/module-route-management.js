 
console.log(' managemodule : Arrived');
var managemodule = angular.module('managemodule', 
		['ngRoute', 'managemoduleController', 'moduleServices','uploadModuleController','seacrchModuleController','systemInfoController']);
console.log(' managemodule: Initilized');

managemodule.config(['$routeProvider',
                    function($routeProvider) {
                      $routeProvider.
                        when('/module-show', {
                          templateUrl: 'partials/view-modules.html',
                          controller: 'ModuleListCtrl',
                          resolve: {
                        	  loadClasses : function(ModulesServicess){
                              // console.log(' managemodule: getAll Called');
                        		  return ModulesServicess.getAll();
                        	  }
                          }
                        //resolve clause makes sure that $resource is resolved
                        //before getting into scope
                        }).
                        when('/install-from-module-repository', {
                          templateUrl: 'partials/search-modules.html',
                            controller: 'searchModuleCtrl'
                        }).
                        when('/system-info', {
                          templateUrl: 'partials/system-info.html',
                          controller: 'systeminfoCtrl',
                        }).
                        when('/upload-module', {
                        	templateUrl: 'partials/upload-module.html',
                            controller: 'uploadModuleCtrl'
                        }).
                         when('/upload-module-normal', {
                          templateUrl: 'partials/upload-module-normal.html',
                            controller: 'ModuleUploadCtrl'
                        }).
                        when('/module-show/:classUUID', {
                        	templateUrl: 'partials/view-module-details.html',
                        	controller: 'ModuleView',
                        }).
                        otherwise({
                          redirectTo: '/module-show'
                        });
                    }]);


console.log(' managemodule: Route provided');




// config(['RestangularProvider',function(RestangularProvider){
// RestangularProvider.setBaseUrl('http://mywebsite.com/api/');
//  RestangularProvider.setDefaultHeaders({'Accept':'text/html,application/json;q=0.9,*/*;q=0.8'});

//  // http://avik-ganguly.blogspot.com/2014/03/angularjs-tutorial-interacting-with.html