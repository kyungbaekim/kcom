var app = angular.module('app', ['ngRoute', 'ngCookies', 'ngPassword']);

app.config(function($routeProvider) {
  $routeProvider
    // index / landing page
    .when('/', {
      templateUrl: '/partials/dashboard.html',
      controller: 'businessController'
    })

    // businesses
    .when('/businesses/new', {
      templateUrl: '/partials/business_new.html',
      controller: 'businessController'
    })

    // categories
    .when('/categories/new', {
      templateUrl: '/partials/categories_new.html',
      controller: 'categoryController'
    })

    // otherwise...
    .otherwise({
      redirectTo: '/'
    });
});