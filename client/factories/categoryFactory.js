app.factory('categoryFactory', ['$http', function($http) {

  function SessionConstructor() {
    var _this = this;

    this.addCategory = function(newCategory, callback) {
      $http.post('/categories', newCategory).then( function(res){
        if (res.data.errors){
          console.log(res.data.errors)
        } else {
          if (typeof(callback) === 'function') {
            var category = res.data;
            callback(category);
          }
        }
      }); 
    };

    this.getCategories = function(callback) {
      $http.get('/categories').then( function(res){
        if (res.data.errors){
          console.log(res.data.errors)
        } else {
          if (typeof(callback) === 'function') {
            var categories = res.data;
            callback(categories);
          }
        }
      });
    };
  }

  return (new SessionConstructor());
}]);