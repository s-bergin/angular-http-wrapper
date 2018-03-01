/**
 * A lightweight wrapper for angular's $http service. 
 * 
 * This function can be used as an angular factory / service. It provides htttp functionality 
 * through JS Promises and Callbacks. 
 */
function angularHttpWrapper($http){
    
    // define our service object 
    /** 
     * @param urlBase, String, if using this service with 1 API initialise the API base here e.g https://www.default-url.com/api/
     * @param authTokenKey, String, if you wish to send an auth token with each request header, indicate the key it'll be sent under 
     * @param authToken, String, if you wish to send an an auth token with each request 
     * @function init, 
    */
    var angularHttpWrapper = {
        
        urlBase : null,
        authTokenKey : null, 
        authToken : null,  
        
        /**
         * Initialise some of the service's properties
         * @param urlBase, String
         * @param authTokenKey, String
         * @param authToken, String 
         */
        init : function init(urlBase, authTokenKey, authToken){ 
            this.setUrlBase(urlBase);
            this.setAuthTokenKey(authTokenKey); 
            this.setAuthToken(authToken); 
        }, 

        /**
         * Set the urlBase for this service
         * @param urlBase, String
         */
        setUrlBase : function setUrlBase(urlBase){
            this.urlBase = urlBase; 
        },

        /**
         * Set the authToken for this service 
         * @param authToken, String  
         */
        setAuthTokenKey : function setAuthTokenKey(authTokenKey){
            this.authToken = authToken; 
        },

        /**
         * Set the authToken for this service 
         * @param authToken, String 
         */
        setAuthToken : function setAuthToken(authToken){
            this.authToken = authToken; 
        }
    };

    return angularHttpWrapper; 
}