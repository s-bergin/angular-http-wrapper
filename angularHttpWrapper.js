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
        idKey : null, 
        authTokenKey : null, 
        authToken : null,  
        
        /**
         * Initialise some of the service's properties and functionality 
         * @param urlBase, String
         * @param idKey, String, the Column Name of your Primary Key ID in Resource Model 
         * @param authTokenKey, String
         * @param authToken, String 
         */
        init : function init(urlBase, idKey, authTokenKey, authToken){ 
            this.setUrlBase(urlBase);
            this.setIdKey(idKey);
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
         * Set the idKey Primary Key identifier for this service
         * @param idKey, String
         */
        setIdKey : function setIdKey(idKey){
            this.idKey = idKey; 
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
        mergeUrlBaseAndEndpoint = function mergeUrlBaseAndEnpoint(endpoint){
            return this.urlBase + endpoint; 
        }, 

        /**
         * HTTP GET Request Method. 
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
         * HTTP GET Request Method. 
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

            return new Promise(function listPromise(resolve, reject){
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
        }, 

        /**
         * HTTP POST Request Method. 
         * 
         * Creates a resource at specified endpoint and returns created resource to user 
         * 
         * @param endpoint, String, the url endpoint you wish to request
         * @param payload, Object, the resource you wish to create 
         * @param ignoreUrlBase, Bool, if true it will not append {Object}.urlBase to beginning of endpoint
         */
        post : function post(endpoint, payload, ignoreUrlBase){
            if(!ignoreUrlBase){
                endpoint = this.mergeUrlBaseAndEnpoint(endpoint);
            }

            return new Promise(function postPromise(resolve, reject){
                $http.post(endpoint, payload)
                .then(function success(response){
                    resolve(response.data);
                }, function fail(response){
                    reject(response);
                });
            });
        }, 

        /**
         * HTTP PUT Request Method. 
         * 
         * Creates a resource at specified endpoint and returns created resource to user 
         * 
         * @param endpoint, String, the url endpoint you wish to request
         * @param payload, Object, the resource you wish to update 
         * @param ignoreUrlBase, Bool, if true it will not append {Object}.urlBase to beginning of endpoint
         */
        put : function put(endpoint, payload, ignoreUrlBase){
            if(!ignoreUrlBase){
                endpoint = this.mergeUrlBaseAndEnpoint(endpoint);
            }

            return new Promise(function putPromise(resolve, reject){
                $http.put(endpoint, payload)
                .then(function success(response){
                    resolve(response.data);
                }, function fail(response){
                    reject(response);
                });
            });
        }, 
        
        /**
         * HTTP POST / PUT Methods
         * 
         * save will search for {Object}.idKey presence in payload. If an id is present in the payload 
         * the put request method will be used, and the indicated resource will be updated with the data in 
         * the payload provided. If no id can be found in the payload the post method will be used,
         * and a new resource with the payload provided will be created. 
         * 
         * @param endpoint, String, the url endpoint you wish to request
         * @param payload, Object, the resource you wish to update 
         * @param ignoreUrlBase, Bool, if true it will not append {Object}.urlBase to beginning of endpoint
         */
        save : function save(endpoint, payload, ignoreUrlBase){

            /**
             * We need to save the context of this wrapper so that we 
             * can access the wrappers functions from within a Promise scope 
             */
            const that = this;

            // check for the presence of an ID in payload and return the relevant response 
            if(this.idKey in payload){
                // PUT if id is present in payload

                // append the id of the resource we wish to update 
                endpoint += "/" + payload[this.idKey]; 

                return new Promise(function savePutPromise(resolve, reject){
                    that.put(endpoint, payload)
                    .then(function savePutPromiseResolve(response){
                        resolve(response);
                    }).catch(function saveePutPromiseReject(response){
                        reject(response);
                    });     
                })
            }else{
                // POST if id not present in payload

                return new Promise(function savePostPromise(resolve, reject){
                    that.post(endpoint, payload)
                    .then(function savePostPromiseResolve(response){
                        resolve(response);
                    }).catch(function savePostPromiseReject(response){
                        reject(response);
                    });
                });
            }
        }
    };

    return angularHttpWrapper; 
}