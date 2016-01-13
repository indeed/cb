// Ionic cb App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'cb' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'cb.controllers' is found in controllers.js
var app = angular.module('cb', ['ionic', 'cb.controllers', 'cb.services', 'cb.utils', 'cb.filters', 'ngTouch', 'ngAnimate', 'ngStorage', 'ngCordova', 'angular-toArrayFilter', 'firebase' ])

app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        /*if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }*/
        if (StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.backgroundColorByHexString("#0A4AA5");
        }
    })

});

app.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider) {

    $ionicConfigProvider.tabs.position('bottom');

    $compileProvider.directive('compile', function ($compile) {
        // directive factory creates a link function
        return function (scope, element, attrs) {
            scope.$watch(
                function (scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
                },
                function (value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);

                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                }
            );
        };
    });

    $stateProvider
      .state('app', {
          url: '/app',
          abstract: true,
          templateUrl: 'views/menu.html',
          controller: 'menuCtrl'
      })

      .state('app.calendar', {
          url: '/calendar',
          views: {
              'menuContent': {
                  templateUrl: 'views/calendar.html',
                  controller: 'calendarCtrl'
              }
          }
      })

      .state('app.classes', {
          url: '/classes',
          views: {
              'menuContent': {
                  templateUrl: 'views/classes.html',
                  controller: 'classCtrl'
              }
          }
      })

      .state('app.news', {
          url: '/news',
          views: {
              'menuContent': {
                  templateUrl: 'views/news.html',
                  controller: 'newsCtrl'
              }
          }
      })

     .state('app.cougarvision', {
         url: '/cougarvision',
         views: {
             'menuContent': {
                 templateUrl: 'views/cougarvision.html',
                 controller: 'cvCtrl'
             }
         }
     });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/news');
});
