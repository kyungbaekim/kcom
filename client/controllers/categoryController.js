app.controller('categoryController', function($scope, $location, $routeParams, $cookies, categoryFactory) {
  // On load, bring all saved categories from DB
  var index = function(){
    categoryFactory.getCategories( function(categories) {
      $scope.categories = categories;
    });
  }

  index();

  $scope.addCategory = function() {
    categoryFactory.addCategory($scope.newCategory, function(category) {
      $scope.addCategoryForm.$setUntouched();
      $scope.newCategory = {};
      index();
    });
  }
});
