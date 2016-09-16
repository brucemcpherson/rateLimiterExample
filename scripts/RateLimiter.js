
// an implementation of a rate limiter
// @constructor RateLimiter

var RateLimiter = function () {

  var cache_,windwms_,rate_,self = this;
  
  /**
   * the cache to use
   * @param {CacheService} cache the cache to use
   * @return {RateLimiter} self
   */
  self.setCache = function (cache) {
    cache_ = cache;
    return self;
  };
  
  /**
   * the window size
   * @param {number} windowms the duration in ms of the measurement window
   * @return {RateLimiter} self
   */
  self.setWindow = function (windowms) {
    windowms_ = windowms;
    return self;
  };
  
  /**
   * the rate per window size
   * @param {number} rate the number allowed per window size
   * @return {RateLimiter} self
   */
  self.setRate = function (rate) {
    rate_ = rate;
    return self;
  };
  
  /**
   * test for quota left and update it if there is some
   * @param {string} identity the identity of who is being measured
   * @return {object|null} the cache entry if there is quota, null if not
   */
  self.useOne = function (identity)  {
    // probably should use the lockservice here too...
    var key = getKey_ (identity) ;
    
    // get an unexpired cache entry if there is one
    var entry = getFromCache_ (key);
    
    // if there's enough quota, then update it
    if (entry.used < rate_) {
      entry.used++;
      return putToCache_ (key,entry);
    }
    else {
      return null;
    }

  };
  
  // this just clears the current counter
  self.clear = function (identity)  {
    putToCache_ (getKey_ (identity) , {used:0});
    return self;
  }
  /**
   * get the window counter from cache
   * @param {string} key the key
   * @param {object} ob what to put
   */
  function putToCache_ (key, ob) {
    cache_.put (key, JSON.stringify(ob),  Math.round(windowms_ / 500));
    return ob;
  }
  
  /**
   * get the window counter from cache
   * @param {string} key the key
   * @return {object} the result
   */
  function getFromCache_ (key) {
    var result = cache_.get (key);
    if (!result) {
      var ob  = {used:0};
      putToCache_ (key, ob)
    }
    else {
      var ob = JSON.parse(result);
    }
    return ob;
  }
  /**
   * the key of the user/window combination
   * @param {string} identity the identity of who is being measured
   * @return {string} the cahce key
   */
  function getKey_ (identity) {
    return identity+'-'+getWindow_ ();
  }
  
  /**
   * the window number of now
   * @return {number} the winow number
   */
  function getWindow_ () {
    return Math.floor(new Date().getTime() / windowms_);
  }
  
  
};

