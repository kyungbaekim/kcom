app.factory('userFactory', function ($http){
	var users = [];
	var factory = {};
	var sessionUser = {};

	factory.newUser = function (data, callback){
		$http.post('/signup', data).success(function (output){
			sessionUser = output;
			//run callback to pass data from factory to controller after getting http resp
			callback(sessionUser);
		})
	}

	factory.getAllUser = function(callback){
		$http.get('/getUsers').success(function(users){
			callback(users);
		})
	}

	factory.login = function(data, callback){
		$http.post('/login', data).success(function (output){
			sessionUser = output;
			callback(sessionUser)
		});
	}

	factory.forgot = function(data, callback){
		$http.post('/forgot', data).success(function (output){
			console.log(output)
			sessionUser = output;
			callback(sessionUser)
		});
	}

	factory.getSession = function(callback){
		//make full http get request to get the latest sessionUser status
		$http.get('/session_user').success(function (output){
			sessionUser = output
			callback(sessionUser);
		})
	}

	factory.logout = function(){
		$http.get('/logout').success(function (output){
			sessionUser = output;
		})
	}

	return factory;
})
