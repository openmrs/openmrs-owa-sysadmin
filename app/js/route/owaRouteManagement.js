 

var managemodule =angular.module('managemodule',
		['ngRoute', 'manageModuleController','manageModuleService', 'uploadModuleController', 'seacrchModuleController', 'systemInfoController', 'systemInfoService', 'mainController','mainService']);

managemodule.config(['$routeProvider',
                    function ($routeProvider) {
                      $routeProvider.
                        when('/module-show', {
                          templateUrl: 'js/moduleView/viewModules.html',
                          controller: 'ModuleListCtrl',
                        }).
                        when('/install-from-module-repository', {
                          templateUrl: 'js/moduleSearch/searchModules.html',
                            controller: 'searchModuleCtrl'
                        }).
                      when('/search-modules-view-detaisl', {
                          templateUrl: 'js/moduleSearch/searchModulesViewDetails',
                            controller: 'searchModuleCtrl'
                        }).
                        when('/upload-module', {
                        	templateUrl: 'js/moduleUpload/uploadModule.html',
                            controller: 'uploadModuleCtrl'
                        }).
                         when('/upload-module-normal', {
                          templateUrl: 'js/moduleUpload/uploadModuleNormal.html',
                            controller: 'ModuleUploadCtrl'
                        }).
                        when('/module-show/:classUUID', {
                        	templateUrl: 'js/moduleView/viewModuleDetails.html',
                        	controller: 'ModuleListCtrl',
                        }).
                        when('/check-for-module-updates', {
                        	templateUrl: 'js/moduleUpdate/moduleUpdateDetails.html',
                        	controller: 'ModuleListCtrl',
                        }).
                        when('/system-info', {
                          templateUrl: 'js/systeminfo/systemInfo.html',
                          controller: 'systeminfoCtrl',
                        }).
                         
                        otherwise({
                          //redirectTo: '/module-show'
                          templateUrl: 'js/main/home.html',
                          controller: 'mainHomeCtrl',
                        
                        });
                    }]);


