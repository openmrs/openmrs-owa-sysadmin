
var owaLoggerModule = angular.module('logAppender', []);

owaLoggerModule.factory('logger', function(){
    var DISPLAY_INFO_LOGS = true;
    var DISPLAY_INFO_LOGS_STACK = false;
    var DISPLAY_ERROR_LOGS = true;
    var DISPLAY_ERROR_LOGS_STACK = false;
    return {
        info : function (message, data) {
            console.log(message);

            if(typeof(data)!=undefined && DISPLAY_INFO_LOGS_STACK){
                if(typeof(data)!=String){
                    console.log(JSON.stringify(data));
                }
                else{
                    console.log(data);
                }
            }
        },
        warn : function (message) {
            console.warn(message);
        },
        error : function (message , data) {
            console.error(message);

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
