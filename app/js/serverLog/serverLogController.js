var ServerLogModule = angular.module('serverLogController', ['OWARoutes']);

ServerLogModule.controller('serverLogCtrl',
    ['$scope', '$route', '$routeParams', 'OWARoutesUtil', '$rootScope', '$http',  'logger', 'serverLogService', 'ngCopy' , '$timeout',
        function ($scope, $route, $routeParams, OWARoutesUtil, $rootScope, $http, logger, serverLogService, ngCopy, $timeout) {

 			// OpenMRS breadcrumbs
      		$rootScope.$emit("updateBreadCrumb", {breadcrumbs : [["SysAdmin","#"],["Live Log Viewer",""]]});
			
			$scope.lastDataFetchedTime;
			finalLogData =[];
			lastLogRetrivedTimeStamp = 0;
			$scope.copyToClipboardText = "Copy Logs";
			$scope.copiedToClipboardIcon = "copy";
			$scope.newLogsUpdated = false;
			$scope.infoChecked = true;
			$scope.errorChecked = true;
			$scope.warnChecked = true;
			$scope.debugChecked = true;
			$scope.creatSecureGist = true;
			$scope.gistDescription = "";

			function showLoadingPopUp() {
		        $('#loadingModal').show();
		        $('#loadingModal').modal({
		            backdrop: 'static',
		            keyboard: false
		        });
		    }

		    function hideLoadingPopUp() {
		        angular.element('#loadingModal').modal('hide');
		    }

			logAnalyzeData = {
				totalCount : 0,
				infoCount : 0,
				errorCount : 0,
				warnCount : 0,
				debugCount : 0
			};

			function resetLogAnalyseData() {
				logAnalyzeData = {
					totalCount : 0,
					infoCount : 0,
					errorCount : 0,
					warnCount : 0,
					debugCount : 0
				};
			}

			$scope.getAllServerLogs = function () {
				showLoadingPopUp();
				logTextDocument = null;
				$scope.lastDataFetchedTime = getCurrentDate();
		        if (typeof($scope.allServerLog) != undefined) {
		            delete $scope.allServerLog;
		        }
		        if (typeof($scope.requestAllServerLog) != undefined) {
		            delete $scope.requestAllServerLog;
		        }
		        var response = serverLogService.getAllLogs();
		        response.then(function (result) {
		            responseType = result[0]; //UPLOAD or DOWNLOAD
		            responseValue = result[1]; // 1- success | 0 - fail
		            responseData = result[2];
		            responseStatus = result[3];
		            if (responseType == "GET") {
		                if (responseValue == 1) {
							$scope.requestAllServerLog = true;	

							for(index in responseData.serverLog) {
								logLine = responseData.serverLog[index];
								updateFinalLogData(logLine,[0,1,2,3], true);
							}
							logAnalyzeData['totalCount'] = tmpCheckData.length;
							$scope.allServerLog = tmpCheckData;
							$scope.logAnalyzeData = logAnalyzeData;
							lastLogRetrivedTimeStamp = getTimeStampForLogTime(finalLogData[finalLogData.length-1]['time']);
							setRefrechTimeOut();
							
		                }
		                else {
		                    $scope.requestAllServerLog = false;
		                    logger.error("Could not get all server log details", responseData);
						}
						hideLoadingPopUp();
					}
				});
			}
		
			function updateFinalLogData(logLine, keys, isUpdateFinalLogData) {
					value = {};
					switch(logLine[keys[0]]) {
						case "INFO" :
								value['logTypeCSS'] = 'logType_info';
								value['logTypeArrowCSS'] = 'arrow_type_info';
								logAnalyzeData['infoCount'] +=1;
							break;
						case "WARN" :
								value['logTypeCSS'] = 'logType_warn';
								value['logTypeArrowCSS'] = 'arrow_type_warn';
								logAnalyzeData['warnCount'] +=1;
							break;
						case "ERROR" :
								value['logTypeCSS'] = 'logType_error';
								value['logTypeArrowCSS'] = 'arrow_type_error';
								logAnalyzeData['errorCount'] +=1;
							break;
						case "DEBUG" :
								value['logTypeCSS'] = 'logType_debug';
								value['logTypeArrowCSS'] = 'arrow_type_debug';
								logAnalyzeData['debugCount'] +=1;
							break;
						default :
								value['logTypeCSS'] = 'logType_info';
								value['logTypeArrowCSS'] = 'arrow_type_info';
								logAnalyzeData['infoCount'] +=1;
							break;
					}
					value['logType'] = logLine[keys[0]];
					value['appender'] = logLine[keys[1]];
					value['time'] = logLine[keys[2]]; 
					value['timeForDisplay'] = removeMilliSecondFromLogTime(logLine[keys[2]]);
					value['message'] = logLine[keys[3]];

					if(isUpdateFinalLogData){
						finalLogData[finalLogData.length] = value;
					}

					if(($scope.infoChecked && logLine[keys[0]]=="INFO") ||
					($scope.errorChecked && logLine[keys[0]]=="ERROR") ||
					($scope.warnChecked && logLine[keys[0]]=="WARN") ||
					($scope.debugChecked && logLine[keys[0]]=="DEBUG")) {
						tmpCheckData[tmpCheckData.length] = value;
						return true;
					}
					else {
						return false;
					}
			}

			$scope.logTypeBoxesClicked = function(type) {
				$scope.infoChecked = false;
				$scope.errorChecked = false;
				$scope.warnChecked = false;
				$scope.debugChecked = false;	
				switch(type){
					case "INFO":
						$scope.infoChecked = true;
						break;
					case "ERROR":
						$scope.errorChecked = true;
						break;
					case "WARN":
						$scope.warnChecked = true;
						break;
				}
				$scope.logTypeOptionsClicked();
			}

			tmpCheckData = [];
			$scope.logTypeOptionsClicked = function() {
				tmpCheckData = [];
				$scope.terminalLogLine = {};
				resetLogAnalyseData();
				// getting logs from finalLogData to tmpCheckData
				for(index in finalLogData){
					logLine = finalLogData[index];
					updateFinalLogData(logLine,['logType','appender', 'time','message'], false);	
				}
				$scope.allServerLog = tmpCheckData;
				logAnalyzeData['totalCount'] = tmpCheckData.length;
				$scope.logAnalyzeData = logAnalyzeData;
			}

			function setRefrechTimeOut() {
				$timeout(function(){ refreshLogs();  }, 3000);  
			}

			$scope.refreshLogsClicked = function() {
				refreshLogs();
			}

			function refreshLogs() {
				$scope.lastDataFetchedTime = getCurrentDate();
				var response = serverLogService.getAllLogs();
		        response.then(function (result) {
		            responseType = result[0]; //UPLOAD or DOWNLOAD
		            responseValue = result[1]; // 1- success | 0 - fail
		            responseData = result[2];
		            responseStatus = result[3];
		            if (responseType == "GET") {
		                if (responseValue == 1) {
							newLogData = responseData.serverLog;
							currenLastLogRetrivedTimeStamp = getTimeStampForLogTime(newLogData[newLogData.length-1][2]);
							if(currenLastLogRetrivedTimeStamp > lastLogRetrivedTimeStamp){
								updateLogTerminal(newLogData);
							}
						}
					}
					else {
						logger.error("Could not check the server log details", responseData);
					}
				});
				setRefrechTimeOut();
			}

			isRefreshUpdateStared= false;
			function updateLogTerminal(newLogData) {
				lastIndex = newLogData.length;
				for(i=newLogData.length-1;i>=0;i--){
					currenLastLogRetrivedTimeStamp = getTimeStampForLogTime(newLogData[i][2]);
					if(currenLastLogRetrivedTimeStamp <= lastLogRetrivedTimeStamp) {
						lastIndex = i+1;
						break;
					}
				}
				
				isRefreshUpdateStared=true;
				for(index=lastIndex; index<newLogData.length; index++){
					logLine = newLogData[index];
					response = updateFinalLogData(logLine,[0,1,2,3], true);
					if(response){
						$scope.newLogsUpdated = true;
					}
				}
				logAnalyzeData['totalCount']  = tmpCheckData.length;
				lastLogRetrivedTimeStamp = getTimeStampForLogTime(finalLogData[finalLogData.length-1]['time']);
				$scope.allServerLog = tmpCheckData; 
				isRefreshUpdateStared=false;
			}

			angular.element(document.querySelector('.OpenMRSLogBody')).bind('scroll', function(){
				if($scope.newLogsUpdated && !isRefreshUpdateStared){
					$timeout(function(){ $scope.newLogsUpdated = false; }, 500); 
				}
			});

			function checkTerminalLogLineSelectedStatus(index){
				if($scope.terminalLogLine.hasOwnProperty(index)){
					return $scope.terminalLogLine[index];
				}
				else {
					return false;
				}
			}

			$scope.terminalLogLineMouseHover = function(index) {
				angular.element(document.querySelector('#terminalLogLine_'+index)).show();
			}

			$scope.terminalLogLineMouseLeave = function(index) {
				if(!checkTerminalLogLineSelectedStatus(index)){
					angular.element(document.querySelector('#terminalLogLine_'+index)).hide();
				}
			}

			$scope.terminalLogLine = {};
			$scope.terminalLogLineSelected = function(logLineIndex, isFromCheckBox) {
				logLine = tmpCheckData[logLineIndex];
				logTextLine =  logLine['logType'] + " - " + logLine['appender']  + " | " + logLine['time'] + " | " + logLine['message'];
				if(ngCopy(logTextLine)) {
					// logger.info("Logs have been copied");
				}
				else{
					logger.error("Could not copy to clipboard.")
				}

				if(!isFromCheckBox) {
					if($scope.terminalLogLine.hasOwnProperty(logLineIndex)){
						$scope.terminalLogLine[logLineIndex] = !$scope.terminalLogLine[logLineIndex];
					}
					else {
						$scope.terminalLogLine[logLineIndex] = true;
					}
				}
			}

			$scope.openMRSLogBodyRepeatCompleted = function() {
				if(!$scope.newLogsUpdated && !isRefreshUpdateStared){
					$timeout(function(){ document.querySelector('.OpenMRSLogBody').scrollTo(0,document.querySelector('#livelogviewerLogsContainer').scrollHeight); }, 100); 
				}
			}

			function getCurrentDate() {
				return new Date();
			}

			function getCurrentTimeStamp() {
				return new Date().getTime();
			}

			function saveTextAsFile (data, filename) {
				if(!data) {
					return;
				}
				if(!filename) filename = 'OpenMRS-log.json'
				var blob = new Blob([data], {type: 'text/plain'}),
					e    = document.createEvent('MouseEvents'),
					a    = document.createElement('a')
				// FOR IE:
				if (window.navigator && window.navigator.msSaveOrOpenBlob) {
					window.navigator.msSaveOrOpenBlob(blob, filename);
				}
				else{
					var e = document.createEvent('MouseEvents'),
						a = document.createElement('a');
				
					a.download = filename;
					a.href = window.URL.createObjectURL(blob);
					a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
					e.initEvent('click', true, false, window,
						0, 0, 0, 0, 0, false, false, false, false, 0, null);
					a.dispatchEvent(e);
				}
			}

		$scope.gistDiscriptionEmptyError = false; 
		$scope.gistCreationError = false;
		$scope.gistURL = "";
		$scope.createNewGist = function() {
			url = 'https://api.github.com/gists';
			if($scope.gistDiscription!=""){
				bodyParameters = {
					"description": $scope.gistDescription,
					"public": !($scope.creatSecureGist),
					"files": {
						"OpenMRS-logs.txt" : {
						"content": prepareTextContent()
					  }
					}
				  }
	
				showLoadingPopUp();
				$scope.gistCreationError = false;
				$('#exportToGistModal').modal({
                    backdrop: 'static',
                    keyboard: false
				});
				
				$http.post(url, bodyParameters, {
					headers: {
						'Content-Type': undefined,
						'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
					}
				})
				.success(function (data, status, headers, config) {
					$scope.gistCreationError = false;
					$scope.gistURL = data.html_url;
					$scope.gistURLModalShow();
					hideLoadingPopUp();

				}).error(function (data, status, header, config) {
					logger.error("Could not create the Gist. Please try again");
					$scope.gistCreationError = true;
					$scope.gistURLModalShow();
					$scope.gistURL= "err";
					hideLoadingPopUp();
				});
			
			}
			else {
				$scope.gistDiscriptionEmptyError = true;
			}
		}

		$scope.copyGistURLIcon = "copy";
		$scope.copyCreatedGistURL = function(gistURL) {
			if(ngCopy(gistURL)) {
				$scope.copyGistURLIcon = "ok";
				$timeout(function(){ $scope.copyGistURLIcon = "copy";  }, 3000);  
			}
		}

		$scope.exportToGistModalShow = function() {
			$scope.gistDescription = getGistDescription();
			angular.element('#exportToGistModal').modal('show');
		}
		
		$scope.exportToGistModalHide = function() {
			angular.element('#exportToGistModal').modal('hide');
		}

		$scope.gistURLModalShow = function() {
			angular.element('#gistURLModal').modal('show');
		}	

		$scope.gistURLModalHide = function() {
			angular.element('#gistURLModal').modal('hide');
		}

		$scope.exportLogsModalShow = function() {
			angular.element('#exportLogModal').modal('show');
		}	

		$scope.exportLogsModalHide = function() {
			angular.element('#exportLogModal').modal('hide');
		}

		$scope.preparingFileForDownloadModalShow = function() {
			angular.element('#preparingFileForDownloadModal').modal('show');
		}	

		$scope.preparingFileForDownloadModalHide = function() {
			angular.element('#preparingFileForDownloadModal').modal('hide');
		}

		function getGistName() {
			return "OpenMRS-Logs-" + getCurrentTimeStamp();
		}

		function getGistDescription() {
			return "OpenMRS-Logs-" + getCurrentDate();
		}


		function prepareTextContent(){
			logTextDocument="";
			logLinesData = getLogLineDataForExportAndDownload();
			for(index in logLinesData) {
				logLine = logLinesData[index];
				logTextDocument+=  logLine['logType'] + " - " + logLine['appender']  + " | " + logLine['time'] + " | " + logLine['message'];
			}
			return logTextDocument;
		}

		function getLogLineDataForExportAndDownload() {
			responseLogLines = []
			allKeysAreFalse = false;
			if(Object.keys($scope.terminalLogLine).length > 0) {
				counter = 0;
				for(index in $scope.terminalLogLine) {
					if($scope.terminalLogLine[index]) {
						responseLogLines[counter] = tmpCheckData[index];
						counter += 1;
						allKeysAreFalse = true;
					}

					// if all keys are false - all are deselected
					if(!allKeysAreFalse) {
						responseLogLines = tmpCheckData;
					}
				}
			}
			else {
				responseLogLines = tmpCheckData;
			}
			return responseLogLines;
		}

		$scope.prepareForTextDownload = function() {
			logLinesData = getLogLineDataForExportAndDownload();
			if(logLinesData.length>0) {
				$scope.exportLogsModalHide();
				$scope.preparingFileForDownloadModalShow();
				logTextDocument = "OpenMRS Server logs generated on " + getCurrentDate().toString();
				logTextDocument += "\n--------------------------------------------------------------------------\n\n"
				logTextDocument += prepareTextContent();
				fileName = "OpenMRS-logfile-" + getCurrentTimeStamp() + ".txt";
				saveTextAsFile(logTextDocument, fileName);
				$scope.preparingFileForDownloadModalHide();
			}
		}

		$scope.prepareForJSONDownload = function() {
			logLinesData = getLogLineDataForExportAndDownload();
			if(logLinesData.length>0) {
				$scope.exportLogsModalHide();
				$scope.preparingFileForDownloadModalShow();
				fileName = "OpenMRS-logfile-" + getCurrentTimeStamp() + ".json";
				saveTextAsFile(JSON.stringify(logLinesData), fileName);
				$scope.preparingFileForDownloadModalHide();
			}
		}
			
		$scope.prepareForXMLDownload = function() {
			logLinesData = getLogLineDataForExportAndDownload();
			if(logLinesData.length>0) {
				$scope.exportLogsModalHide();
				$scope.preparingFileForDownloadModalShow();
				logXMLDocument = "<title>OpenMRS Server logs generated on " + getCurrentDate().toString() + "</title>";
				logXMLDocument += "<logs>";
				for(index in logLinesData) {
					logLine = logLinesData[index];
					logXMLDocument += "<log>";
					logXMLDocument+= "<logtype>" + logLine['logType'] + "</logtype>"; 
					logXMLDocument+= "<logTime>" + logLine['tile'] + "</logTime>";
					logXMLDocument+= "<logappender>" + logLine['appender'] + "</logappender>";
					logXMLDocument+= "<logMessage>" + logLine['logType'] + "</logMessage>";
					logXMLDocument += "</log>";
				}
				logXMLDocument += "</logs>";
				fileName = "OpenMRS-logfile-" + getCurrentTimeStamp() + ".xml";
				saveTextAsFile(logXMLDocument, fileName);
				$scope.preparingFileForDownloadModalHide();
			}
		}

		$scope.prepareForCSVDownload = function() {
			logLinesData = getLogLineDataForExportAndDownload();
			if(logLinesData.length>0) {
				$scope.exportLogsModalHide();
				$scope.preparingFileForDownloadModalShow();
				logTextDocument="";
				for(index in logLinesData) {
					logLine = logLinesData[index];
					logTextDocument+= '"' + logLine['logType'] + '","' + logLine['time'] + '","' + logLine['appender'] + '","' + logLine['message'] + '"\r';
				}
				fileName = "OpenMRS-logfile-" + getCurrentTimeStamp() + ".csv";
				saveTextAsFile(logTextDocument, fileName);
				$scope.preparingFileForDownloadModalHide();
			}
		}

		$scope.copyLogToClipboard = function() {
			logTextDocument=prepareTextContent();
			$scope.copiedToClipboard = ngCopy(logTextDocument);
			if(ngCopy(logTextDocument)) {
				$scope.copyToClipboardText = "Copied!";
				$scope.copiedToClipboardIcon = "ok";
				$timeout(function(){ $scope.copyToClipboardText = "Copy Logs"; $scope.copiedToClipboardIcon = "copy";  }, 3000);  
			}
			else {
				$scope.copyToClipboardText = "Error";
				$scope.copiedToClipboardIcon = "remove";
				$timeout(function(){ $scope.copyToClipboardText = "Copy Logs"; $scope.copiedToClipboardIcon = "copy"; }, 3000); 
			}
		}

		function getTimeStampForLogTime(time){
			if(time) {
				return Date.parse(time.replace(",",":"));
			}
			else {
				return "";
			}
		} 

		function removeMilliSecondFromLogTime(time) {
			return time.split(",")[0];
		}
}]);