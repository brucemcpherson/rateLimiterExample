function testLimiter () {

  // a window of 10 seconds
  // rate limit of 1 per second
  var limiter = new RateLimiter()
  .setWindow(10000)
  .setRate(10);
  
  var identity = "bruce";
  
  // bust it
  for (var i=0 ; i < 15 ; i++) {
    if (!limiter.useOne(identity)) {
      Logger.log('no quota for ' + i);
    }
    else {
      // simulate some work
      Utilities.sleep (400);
    }
  }
  limiter.clear(identity);
  
  // sleep for 1 secs between each one
  var start = new Date().getTime();
  for (var i=0 ; i < 15 ; i++) {
    if (!limiter.useOne(identity)) {
      Logger.log('slept..no quota for ' + i);
    }
    else {
      // simulate some work
      Utilities.sleep (400);
    }
    Utilities.sleep (1000);
  }
  Logger.log('sleeper took' + (new Date().getTime() - start));
  limiter.clear(identity);
  
  // use back off
  var start = new Date().getTime();
  for (var i=0 ; i < 15 ; i++) {
    cUseful.Utils.expBackoff (function () {
      if (!limiter.useOne(identity)) throw ('Exception: Service invoked too many times');
      // simulate some work
      Utilities.sleep(400);
    });
  }
  Logger.log('backoff took' + (new Date().getTime() - start));
  limiter.clear(identity);
}

