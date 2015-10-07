// Ionic cb App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'cb' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'cb.controllers' is found in controllers.js
var app = angular.module('cb', ['ionic', 'cb.controllers', 'cb.services', 'cb.utils', 'ngTouch', 'ngAnimate', 'ngStorage', 'angular-toArrayFilter'])

app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    })
});

app.config(function ($stateProvider, $urlRouterProvider) {
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
