app.factory('userFactory', function ($http){
  function SessionConstructor() {
		var users = [];
		var factory = {};

    var _this = this;
		this.getAllUser = function(callback){
			$http.get('/getAllUsers').success(function(users){
				callback(users);
			})
		}

		this.getUser = function(id, callback){
			$http.get('/getUser/' + id).success(function(user){
				callback(user);
			})
		}

		this.getSession = function(callback){
			$http.get('/getSession').success(function(data){
				callback(data);
			})
		}

		this.FBlogin = function(callback){
			FB.login(function(response){
				console.log('Welcome!  Fetching your information.... ');
				FB.api('/me', { fields: 'email, gender, first_name, last_name, name, link, timezone, age_range, locale' }, function(response) {
					console.log(response)
					if(!response.error){
						// console.log('Successful login for: ' + response.name);
						$http.post('/FBlogin', response).success(function(data){
							callback(data)
						})
						.error(function(err){
							callback({ error: 'Error occurred while saving your information!' })
						})
					}
					else{
						// console.log('Error occurred while fetching your information!')
						callback({ error: 'Error occurred while fetching your information!' })
					}
				});
			})
		}

		this.getCookieUser = function(_id, callback){
			$http.get('/getCookieUser/' + _id).success(function (data){
				console.log(data)
				callback(data)
			})
			.error(function (err){
				callback({ error: "Error occurred while retreiving user information!" })
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
					callback({ error: "Error occurred while retreiving user information!" })
				})
	    })
	    // handle error
	    .error(function (data) {
				if(data == null){
					callback({ error: "Something went wrong while registration. Please try again later!" })
				}
				else{
					callback({ dup_email: "Entered email address you entered is already taken." });
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
					callback({ error: "Error occurred while retreiving user information!" })
				})
	    })
	    // handle error
	    .error(function (err) {
				callback({ error: "Invalid email and/or password" })
	    });
		}

		this.logout = function(callback){
		  // send a get request to the server
		  $http.get('/logout').success(function (data) {
				console.log(data);
				if(data.status){
					callback(data);
				}
				else{
					callback(data);
				}
		  })
	    // handle error
	    .error(function (data) {
				console.log(data);
				callback({ message: "Error occurred while logging out!" });
	    });
		}
	};

  return (new SessionConstructor());
});
