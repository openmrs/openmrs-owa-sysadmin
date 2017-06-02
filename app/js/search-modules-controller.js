 var app = angular.module('seacrchModuleController',[]);

 
 app.controller('searchModuleCtrl', function($scope, $http, $timeout) {
 	$scope.modules=[];
    $scope.searchText = null;
    $scope.change = function(text) {
    	$scope.moduleFound=false;
    	$scope.modules=[];

        var searchValue = $scope.searchText;
        var column_count=5;
        var columns="Action%2CName%2CVersion%2CAuthor%2CDescription";
        var displayStart=0;
        var displayLength=15;
        var urll="https://modules.openmrs.org/modulus/modules/findModules?callback=JSON_CALLBACK&sEcho=13&iColumns="+column_count+"&sColumns="+columns+"&iDisplayStart="+displayStart+"&iDisplayLength="+displayLength+"&bEscapeRegex=true&sSearch="+searchValue;

        $http({
  			method: 'JSONP', 
    		url: urll
			})
        	.success(function(data) {

        	console.log(data.iTotalDisplayRecords);
        	  if(data.iTotalDisplayRecords>0){
        	  	// Modules Found
        	  	$scope.moduleFound=true;
        	  	$scope.modules = data.aaData;
        	  }
        	  else {
        	  	// No Modules Found
        	  	$scope.moduleFound=false;
        	  }
			  
			   console.log('Data Retrived');
			})
			.error(function(data, status) {
			  console.error('Repos error', status, data);
			})
			.finally(function() {
			  console.log("finally finished search");
			});

        };

        $scope.trysearch = function(val) {
        	console.dir(val);
        	var fd = new FormData();
			$http.get(val, {responseType: "arraybuffer"}).success((data) => {
			    fd.append('file', data);
			  	 
			    //console.dir("file");
			    //console.dir(data);
			   // console.log(fd);
			}).then(function() { 
				 
				var uploadUrl = "http://localhost:8080/openmrs/ws/rest/v1/module/?";
				$http.post(uploadUrl, fd, {
	            transformRequest: angular.identity,
	            headers: { 
	            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'}
	        	}) .success(function (data, status, headers, config) {
	                console.log("UPLOAD - Sucess.");
	                $scope.isUploading=false;
	                var x2js = new X2JS();
	                var JsonSuccessResponse = x2js.xml_str2json(data);

	                })
	            .error(function (data, status, header, config) { 
	                console.log("UPLOAD - Error.");
	                $scope.isUploading=false;
	                var x2js = new X2JS();
	                var JsonErrorResponse = x2js.xml_str2json(data);

	            });
			});
			
        };
    });



//  +++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //  WORKING - MODULE SEARCH 
//  +++++++++++++++++++++++++++++++++++++++++++++++++++++++

  // app.controller('instantSearchCtrl', function($scope, $http, $timeout) {
 	// $scope.modules=[];
  //   $scope.searchText = null;
  //   $scope.change = function(text) {
  //   	$scope.moduleFound=false;
  //   	$scope.modules=[];

  //       valtosend = $scope.searchText;
  //       $http.get('https://modules.openmrs.org/modulus/api/search?q=' + valtosend)
		// 	.success(function(data) {

  //       	//console.log(data.totalCount);
  //       	  if(data.totalCount>0){
  //       	  	// Modules Found
  //       	  	$scope.moduleFound=true;
  //       	  	$scope.modules = data.items;
  //       	  }
  //       	  else {
  //       	  	// No Modules Found
  //       	  	$scope.moduleFound=false;
  //       	  }
			  
		// 	   console.log('Data Retrived');
		// 	})
		// 	.error(function(data, status) {
		// 	  console.error('Repos error', status, data);
		// 	})
		// 	.finally(function() {
		// 	  console.log("finally finished search");
		// 	});

  //       };
  //   });

