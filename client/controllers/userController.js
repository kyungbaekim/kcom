app.controller('userController', function ($scope, $rootScope, userFactory, $uibModal, $uibModalStack, $location, $cookies, Idle, Keepalive, $uibModal){
  $scope.errorMessage = null;
  $scope.register_error = null;
  $('#email').focus();
  $('#username').focus();

  userFactory.getSession(function(data){
    console.log("Current session data: ", data)
  })

  userFactory.getAllUser(function(data){
		console.log("All users:", data);
	})

  $scope.fblogin = function(){
    userFactory.fblogin(function(data){
      console.log(data)
    })
  }

  $rootScope.$on("CallRegister", function(){
    $scope.register();
  });

	$scope.register = function () {
    $scope.message = "Register Button Clicked";
    console.log($scope.message);

    var modalInstance = $uibModal.open({
      templateUrl: 'partials/register.html',
      controller: RegModalInstanceCtrl,
    });

    modalInstance.result.then(function (data) {
			console.log(data)
			$rootScope.sessionUser = data;
			console.log('current sessionUser', $rootScope.sessionUser)
			Idle.watch();
			$scope.started = true;
    }, function () {
        console.log('Modal dismissed at: ' + new Date());
    });
	};

	var RegModalInstanceCtrl = function ($uibModalInstance, $scope) {
    $scope.register = function () {
			userFactory.register($scope.user_new, function(data){
        console.log(data);
				if(!data.dup_email && !data.error){
					$uibModalInstance.close(data)
				}
				else{
					console.log("Error occurred")
					if(data.dup_email){
						$scope.errorMessage = data.dup_email;
						console.log('register email error', $scope.errorMessage)
					}
					else{
						$scope.register_error = data.error;
						console.log('register error', $scope.register_error)
					}
				}
			});
    };
		$scope.cancel = function () {
			console.log("Cancel button clicked")
			// $uibModalInstance.dismiss('cancel');
			$uibModalStack.dismissAll('closed');
		};
	};

	$rootScope.$on("CallLogin", function(){
  	$scope.login();
  });

	$scope.login = function () {
		$scope.message = "Login Button Clicked";
		console.log($scope.message);
		var modalInstance = $uibModal.open({
			templateUrl: 'partials/login.html',
			controller: LoginModalInstanceCtrl
		});

		modalInstance.result.then(function (data) {
			$rootScope.sessionUser = data;
			console.log('current sessionUser', $rootScope.sessionUser)
			Idle.watch();
			$scope.started = true;
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	}

	var LoginModalInstanceCtrl = function ($uibModalInstance, $scope) {
		$scope.login = function () {
			userFactory.login($scope.user_login, function(data){
        // console.log(data)
				if(data){
					$uibModalInstance.close(data)
				}
				else{
					$scope.errorMessage = data.error;
					console.log('login errors', $scope.errorMessage)
				}
			});
		};

		$scope.cancel = function () {
			console.log("Cancel button clicked")
			$uibModalStack.dismissAll('closed');
		};
  };

  $scope.logout = function () {
    // call logout from service
    console.log("Logging out!")
    userFactory.logout(function(data){
      if(data.status == 'Bye!'){
        $rootScope.sessionUser = null;
        Idle.unwatch();
        $scope.started = false;
      }
    })
  };

  function closeModals() {
    if ($scope.warning) {
      $scope.warning.close();
      $scope.warning = null;
    }

    if ($scope.timedout) {
      $scope.timedout.close();
      $scope.timedout = null;
    }
  }

  $scope.$on('IdleStart', function() {
    closeModals();
    $scope.warning = $uibModal.open({
      templateUrl: 'warning-dialog.html',
      windowClass: 'modal-danger'
    });
  });

  $scope.$on('IdleEnd', function() {
    closeModals();
  });

  $scope.$on('IdleTimeout', function() {
    closeModals();
    $scope.timedout = $uibModal.open({
      templateUrl: 'timedout-dialog.html',
      windowClass: 'modal-danger'
    });
		console.log('Timeout occurred!')
		$scope.logout();
  });
});
