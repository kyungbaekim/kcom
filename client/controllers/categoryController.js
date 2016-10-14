app.controller('categoryController', 
    ['$scope',
    '$location',
    '$routeParams',
    '$cookies',
    'categoryFactory',
    function($scope, 
            $location,
            $routeParams,
            $cookies,
            categoryFactory) {


    /* Private Variables */
    // N/A

    /* Private Methods */
    // var index = function() {
    	
    // }

    /* Public Variables */

    /* Public Methods */
    $scope.addCategory = function() {
        categoryFactory.addCategory($scope.newCategory, function(category) {
            $scope.addCategoryForm.$setUntouched();
            $scope.newCategory = {};
        });
    }

    /* On Load */
    // index();
}]); 