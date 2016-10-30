var app = angular.module('app', ['ngRoute', 'ngCookies', 'ngPassword']);

app.config(function($routeProvider) {
  $routeProvider
    // index / landing page
    .when('/', {
      templateUrl: '/partials/dashboard.html',
      controller: 'mapsController'
    })

    // businesses
    .when('/businesses/new', {
      templateUrl: '/partials/business.html',
      controller: 'businessController'
    })

    // categories
    .when('/categories/new', {
      templateUrl: '/partials/categories.html',
      controller: 'categoryController'
    })

    // otherwise...
    .otherwise({
      redirectTo: '/'
    });
});
