
var addNewTaskModule = angular.module('addNewTaskController', ['OWARoutes']);

addNewTaskModule.controller('addNewTaskCtrl', ['$scope','$http','OWARoutesUtil','$location',
    function($scope,$http,OWARoutesUtil,$location){

        $scope.contacts = [];
        $scope.addMoreProviderBox = function(){
            $scope.contacts.push({ encounterRole: '' , providername : ''});
        }

    }
]);
