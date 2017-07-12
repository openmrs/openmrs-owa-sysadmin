 

var managemodule =angular.module('managemodule',
		['ngRoute', 'managemoduleController', 'uploadModuleController', 'seacrchModuleController', 'systemInfoController', 'encountersController', 'mainController']);

managemodule.config(['$routeProvider',
                    function ($routeProvider) {
                      $routeProvider.
                        when('/module-show', {
                          templateUrl: 'js/module/view-modules.html',
                          controller: 'ModuleListCtrl',
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
                        	controller: 'ModuleListCtrl',
                        }).
                        when('/check-for-module-updates', {
                        	templateUrl: 'js/module/module-update-details.html',
                        	controller: 'ModuleListCtrl',
                        }).
                        when('/system-info', {
                          templateUrl: 'js/systeminfo/system-info.html',
                          controller: 'systeminfoCtrl',
                        }).
                        when('/search-encounters', {
                          templateUrl: 'js/encounters/search-encounters.html',
                          controller: 'searchEncounterCtrl',
                        }).
//                        when('/manage-encounters/:encounterUUID', {
//                          templateUrl: 'js/encounters/manage-encounters.html',
//                          controller: 'manageEncounterCtrl',
//                        }).
                        when('/add-encounter', {
                          templateUrl: 'js/encounters/manage-encounters.html',
                          controller: 'AddNewEncounterCtrl',
                        }).
                        when('/manage-encounter-types', {
                          templateUrl: 'js/encounters/manage-encounter-type.html',
                          controller: 'manageEncounterTypeCtrl',
                        }).
                        when('/manage-encounter-roles', {
                          templateUrl: 'js/encounters/manage-encounter-role.html',
                          controller: 'manageEncounterRoleCtrl',
                        }).
                        otherwise({
                          //redirectTo: '/module-show'
                          templateUrl: 'js/home/home.html',
                          controller: 'mainHomeCtrl',
                        
                        });
                    }]);


