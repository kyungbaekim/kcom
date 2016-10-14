app.factory('businessFactory', ['$http', function($http) {

  function SessionConstructor() {
    var _this = this;

    this.addBusiness = function(newBusiness, callback) {
      // prepare Google Geocode API call
      var geocodeEP = "https://maps.googleapis.com/maps/api/geocode/json", // endpoint
          geocodeKey = "&key=AIzaSyDJpPm9sQDiqgfL9WZs4P-YSqtkv2mBrEw", // Jun's free API key (1000 per day limit)
          address = "?address=" +
                    newBusiness.street.split(" ").join("+") + ",+" +
                    newBusiness.city.split(" ").join("+") + ",+" +
                    newBusiness.state.split(" ").join("+") + ",+" +
                    newBusiness.zip.toString().split(" ").join("+"),
          geocodeCall = [geocodeEP, address, geocodeKey].join("");

      $http.post(geocodeCall)
        .then( function(res){
          // if we have results 
          if(res.data.status == "OK") {
            // grab location
            var geo = res.data.results[0].geometry.location;
            // store location to form data
            newBusiness.lattitude = geo.lat;
            newBusiness.longitude = geo.lng;
            // make post request to our server for creating a new business
            $http.post('/businesses', newBusiness)
              .then( function(res){
                if (res.data.errors){
                  console.log(res.data.errors)
                } else {
                  if (typeof(callback) === 'function') {
                    var business = res.data;
                    callback(business);
                  }
                }
              })
              .catch( function(res){
                console.log(res.data);
              }
              ); 
          } // end of if
          else {
            console.log(res.data.status); // should print "ZERO_RESULTS"
          }
        }) 
        .catch( function(res){
          console.log(res.error_message);
        });
        // EDGE CASES TO CONSIDER
        // 500 returned from server (bad request or server side errors)
        // validation errors from server
        // error from google api
        // zero results (google)
        // multiple results (google)
    };
  }

  return (new SessionConstructor());
}]);