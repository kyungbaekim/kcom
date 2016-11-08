app.factory('userFactory', function ($http){
  function SessionConstructor() {
		var users = [];
		var factory = {};
		var sessionUser = {};

    var _this = this;
		this.getAllUser = function(callback){
			$http.get('/getAllUsers').success(function(users){
				callback(users);
			})
		}

		this.getSession = function(callback){
			$http.get('/getSession').success(function(data){
				callback(data);
			})
		}

		this.fblogin = function(callback){
			$http.get('/auth/facebook').success(function(data){
				callback(data)
			})
			.error(function(err){
				callback({error: "Error occurred while logging in with Facebook credentials!"})
			})
		}

		this.register = function (data, callback) {
		  // send a post request to the server
		  $http.post('/register', data).success(function (data, status) {
        console.log("data: " + data + ", status: " + status)
				$http.get('/getUser').success(function (data){
					console.log(data)
					callback(data)
				})
				.error(function (err){
					callback({error: "Error occurred while retreiving user information!"})
				})
	    })
	    // handle error
	    .error(function (data) {
				if(data == null){
					callback({error: "Something went wrong while registration. Please try again later!"})
				}
				else{
					callback({dup_email: "Entered email address you entered is already taken."});
				}
	    });
		}

		this.login = function(data, callback) {
		  // send a post request to the server
		  $http.post('/login', data).success(function (data, status) {
	      console.log("data: " + data + ", status: " + status)
				$http.get('/getUser').success(function (data){
					console.log(data)
					callback(data)
				})
				.error(function (err){
					callback({error: "Error occurred while retreiving user information!"})
				})
	    })
	    // handle error
	    .error(function (err) {
				callback({error: "Invalid email and/or password"})
	    });
		}

		this.logout = function(callback){
		  // send a get request to the server
		  $http.get('/logout').success(function (data) {
				console.log(data);
				callback(data);
		  })
	    // handle error
	    .error(function (data) {
				console.log(data);
				callback({message: "Error occurred while logging out!"});
	    });
		}
	};

  return (new SessionConstructor());
});
