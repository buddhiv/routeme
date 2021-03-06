// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngRoute', 'starter.controllers', 'starter.services', 'starter.filters'])

  .run(function ($ionicPlatform, $rootScope, FirebaseService) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('tab.map', {
        url: '/map',
        views: {
          'tab-map': {
            templateUrl: 'templates/tab-map.html',
            controller: 'MapCtrl'
          }
        }
      })

      .state('tab.travel', {
        url: '/travel',
        views: {
          'tab-travel': {
            templateUrl: 'templates/tab-travel.html',
            controller: 'TravelCtrl'
          }
        }
      })

      .state('tab.more', {
        url: '/more',
        views: {
          'tab-more': {
            templateUrl: 'templates/tab-more.html',
            controller: 'MoreCtrl'
          }
        }
      })

      .state('tab.about', {
        url: '/about',
        views: {
          'tab-more': {
            templateUrl: 'templates/about.html'
          }
        }
      })

      .state('tab.account', {
        url: '/account',
        views: {
          'tab-more': {
            templateUrl: 'templates/account.html',
            controller: 'AccountCtrl'
          }
        }
      })

      .state('tab.recent', {
        url: '/recent',
        views: {
          'tab-more': {
            templateUrl: 'templates/recent.html',
            controller: 'RecentCtrl'
          }
        }
      })

      .state('tab.traveldetails', {
        url: '/traveldetails',
        views: {
          'tab-more': {
            templateUrl: 'templates/traveldetails.html',
            controller: 'RecentCtrl'
          }
        }
      })

      .state('tab.nearby', {
        url: '/nearby',
        views: {
          'tab-more': {
            templateUrl: 'templates/nearby.html',
            controller: 'NearbyCtrl'
          }
        }
      })
    ;

// if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/map');

  })
;
