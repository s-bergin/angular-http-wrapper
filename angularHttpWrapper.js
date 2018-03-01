/**
 * A lightweight wrapper for angular's $http service. 
 * 
 * This function can be used as an angular factory / service. It provides htttp functionality 
 * through JS Promises. 
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
         * Initialise some of the service's properties and functionality 
         * @param urlBase, String
         * @param authTokenKey, String
         * @param authToken, String 
         */
        init : function init(urlBase, authTokenKey, authToken){ 
            this.setUrlBase(urlBase);
            this.setAuthTokenKey(authTokenKey); 
            this.setAuthToken(authToken); 
            this.setAuthTokenInRequestHeader(); 
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
            this.authTokenKey = authTokenKey; 
        },

        /**
         * Set the authToken for this service 
         * @param authToken, String 
         */
        setAuthToken : function setAuthToken(authToken){
            this.authToken = authToken; 
        },

        /**
         * Assign authToken to authTokenKey in our HTTP request headers 
         */
        setAuthTokenInRequestHeader : function setAuthTokenInRequestHeader(){
            $http.defaults.headers.common[this.authTokenKey] = this.authToken; 
        }, 

        /**
         * Merges provided endpoint with the urlBase thats been initialised 
         * @param endpoint, String the endpoint of a request 
         * 
         * TODO - Flesh out this functions functionality by including checks for '/' between urlBase and endpoint 
         */
        mergeUrlBaseAndEnpoint(endpoint){
            return this.urlBase + endpoint; 
        }, 

        /**
         * HTTP Get Request Method. 
         * 
         * Will return a single object from the response 
         * 
         * @param endpoint, String, the url endpoint you wish to request
         * @param ignoreUrlBase, Bool, if true it will not append {Object}.urlBase to beginning of endpoint
         */
        get : function get(endpoint, ignoreUrlBase = false){

            if(!ignoreUrlBase){
                endpoint = this.mergeUrlBaseAndEnpoint(endpoint);
            }

            return new Promise(function getPromise(resolve, reject){
                $http.get(endpoint)
                .then(function success(response){
                    
                    // check if type of response is array 
                    if(response.data.constructor === Array){
                        
                        // we only want to return one object with our get 
                        if(response.data.length > 0){
                            resolve(response.data[0]);
                        }else{
                            // FIXME - Is this the functionality you want to go with in case of nothing returned?  
                            resolve(null);
                        }
                    }else{

                        // return our object 
                        resolve(response.data);
                    }
                    
                }, function fail(response){
                    reject(response);
                });
            });
        }, 

        /**
         * HTTP Get Request Method. 
         * 
         * Will return a list of objects from the response 
         * 
         * @param endpoint, String, the url endpoint you wish to request
         * @param ignoreUrlBase, Bool, if true it will not append {Object}.urlBase to beginning of endpoint
         */
        list : function list(endpoint, ignoreUrlBase){
            
            if(!ignoreUrlBase){
                endpoint = this.mergeUrlBaseAndEnpoint(endpoint);
            }

            return new Promise(function getPromise(resolve, reject){
                $http.get(endpoint)
                .then(function success(response){
                    
                    // check if type of response is array 
                    if(response.data.constructor === Array){
                        resolve(response.data);
                    }else{
                        // return our response data as an array
                        resolve([response.data]);
                    }
                    
                }, function fail(response){
                    reject(response);
                });
            });
        }
    };

    return angularHttpWrapper; 
}