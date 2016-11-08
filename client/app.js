var app = angular.module('app', ['ngRoute', 'angularMoment', 'ngCookies', 'ngPassword', 'ui.bootstrap', 'ngIdle']);

app.config(function($routeProvider) {
  $routeProvider
    // index / landing page
    .when('/', {
      templateUrl: '/partials/dashboard.html',
      controller: 'mapController'
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

app.config(function(IdleProvider, KeepaliveProvider) {
  IdleProvider.idle(60 * 15); // 15 minutes
  IdleProvider.timeout(30); // 30 seconds
  KeepaliveProvider.interval(30); // 30 seconds
});

// Custom validator based on expressions.
app.directive("passwordVerify", function() {
  return {
    require: "ngModel",
    scope: {
      passwordVerify: '='
    },
    link: function(scope, element, attrs, ctrl) {
      scope.$watch(function() {
        var combined;
        if (scope.passwordVerify || ctrl.$viewValue) {
           combined = scope.passwordVerify + '_' + ctrl.$viewValue;
        }
        return combined;
      }, function(value) {
        if (value) {
          ctrl.$parsers.unshift(function(viewValue) {
            var origin = scope.passwordVerify;
            if (origin !== viewValue) {
              ctrl.$setValidity("passwordVerify", false);
              return undefined;
            } else {
              ctrl.$setValidity("passwordVerify", true);
              return viewValue;
            }
          });
        }
      });
     }
   };
});
