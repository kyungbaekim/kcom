app.controller('businessController', 
    ['$scope',
    '$location',
    '$routeParams',
    '$cookies',
    'businessFactory',
    'categoryFactory',
    function($scope, 
            $location,
            $routeParams,
            $cookies,
            businessFactory,
            categoryFactory) {


    /* Private Variables */
    // N/A

    /* Private Methods */
    var index = function() {
    	categoryFactory.getCategories( function(categories) {
            $scope.categories = categories;
        });
    }

    /* Public Variables */

    /* Public Methods */
    $scope.addBusiness = function() {
        businessFactory.addBusiness($scope.newBusiness, function(business) {
            $scope.addBusinessForm.$setUntouched();
            $scope.newBusiness = {};
        });
    }

    /* On Load */
    index();
}]); 