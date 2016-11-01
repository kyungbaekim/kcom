app.controller('userController', function ($scope, $rootScope, userFactory){
  $scope.register = function(){
    console.log($scope.user)
    console.log("calling register function in userController. Calling newUser function in userFactory!")
    userFactory.newUser($scope.user, function(data){
      console.log(data)
			$rootScope.sessionUser = data;
		});
  }
});
