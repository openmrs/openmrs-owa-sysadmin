 

var managemodule = angular.module('managemodule', 
		['ngRoute', 'managemoduleController', 'moduleServices','uploadModuleController','seacrchModuleController','systemInfoController']);

managemodule.config(['$routeProvider',
                    function($routeProvider) {
                      $routeProvider.
                        when('/module-show', {
                          templateUrl: 'js/module/view-modules.html',
                          controller: 'ModuleListCtrl',
                          resolve: {
                        	  loadClasses : function(ModulesServicess){
                        		  return ModulesServicess.getAll();
                        	  }
                          }
                        }).
                        when('/install-from-module-repository', {
                          templateUrl: 'js/module/search-modules.html',
                            controller: 'searchModuleCtrl'
                        }).
                        when('/upload-module', {
                        	templateUrl: 'js/module/upload-module.html',
                            controller: 'uploadModuleCtrl'
                        }).
                         when('/upload-module-normal', {
                          templateUrl: 'js/module/upload-module-normal.html',
                            controller: 'ModuleUploadCtrl'
                        }).
                        when('/module-show/:classUUID', {
                        	templateUrl: 'js/module/view-module-details.html',
                        	controller: 'ModuleView',
                        }).
                        when('/system-info', {
                          templateUrl: 'js/systeminfo/system-info.html',
                          controller: 'systeminfoCtrl',
                        }).
                        otherwise({
                          //redirectTo: '/module-show'
                          templateUrl: 'js/home/home.html',
                          //controller: 'ModuleView',
                        });
                    }]);


