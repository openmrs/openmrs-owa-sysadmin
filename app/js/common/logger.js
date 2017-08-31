
var owaLoggerModule = angular.module('logAppender', []);

owaLoggerModule.factory('logger', function(){
    var DISPLAY_INFO_LOGS = true;
    var DISPLAY_INFO_LOGS_STACK = false;
    var DISPLAY_ERROR_LOGS = true;
    var DISPLAY_ERROR_LOGS_STACK = false;
    var DISPLAY_WARN_LOGS = true;
    return {
        // to print the info logs
        info : function (message, data) {
            if(DISPLAY_INFO_LOGS){
                console.log(message);
            }

            if(typeof(data)!=undefined && DISPLAY_INFO_LOGS_STACK){
                if(typeof(data)!=String){
                    console.log(JSON.stringify(data));
                }
                else{
                    console.log(data);
                }
            }
        },
        // to print the warn logs
        warn : function (message) {
            if(DISPLAY_WARN_LOGS){
                console.warn(message);
            }
        },
        // to print the error logs
        error : function (message , data) {
            if(DISPLAY_ERROR_LOGS){
                console.error(message);
            }

            if(typeof(data)!=undefined && DISPLAY_ERROR_LOGS_STACK){
                if(typeof(data)!=String){
                    console.error(JSON.stringify(data));
                }
                else{
                    console.error(data);
                }
            }
        }
    };

});
