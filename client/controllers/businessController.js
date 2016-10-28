app.controller('businessController', function($scope, $location, $routeParams, $cookies, businessFactory, categoryFactory) {
  // On load, bring all saved categories from DB
  var index = function() {
    categoryFactory.getCategories(function(categories) {
      $scope.categories = categories;
    });
  }

  index();

  // Add business to DB
  $scope.addBusiness = function() {
    businessFactory.addBusiness($scope.newBusiness, function(business) {
      $scope.addBusinessForm.$setUntouched();
      $scope.newBusiness = {};
      index();
    });
  }
});
