angular.module('starter.services', [])

  .service('RouteResponseService', function ($rootScope) {
    var routeResponse = null;

    return {
      setResponse: function (res) {
        routeResponse = res;
      },
      getResponse: function () {
        return routeResponse;
      }
    }
  })

  .service('RouteStartEndService', function ($rootScope) {
    var start = null;
    var end = null;

    return {
      setStart: function (s) {
        start = s;
      },
      setEnd: function (e) {
        end = e;
      },
      getStart: function () {
        return start;
      },
      getEnd: function () {
        return end;
      }
    }
  })

  .service('CheckLoginService', function ($rootScope, FirebaseService) {

    var auth = null;

    return {
      isLogged: function () {
        var fbs = FirebaseService.getFirebaseService();
        var isLogged = false;

        fbs.onAuth(function (authData) {
          if (authData) {
            auth = authData;
            isLogged = true;
            console.log("logged");
          } else {
            isLogged = false;
            console.log("not logged");
          }
        });

        return isLogged;
      },
      getAuthData: function () {
        return auth;
      }
    }
  })

  .service('FirebaseService', function ($rootScope) {
    var firebaseService = new Firebase("https://routeme.firebaseio.com/");

    return {
      getFirebaseService: function () {
        return firebaseService;
      }
    }
  })

  .service('TravelDetailsService', function ($rootScope) {
    var travelDetails = null;

    return {
      setTravelDetails: function (travel) {
        travelDetails = travel;
      },
      getTravelDetails: function () {
        return travelDetails;
      }
    }
  })

  .service('NearbyLocationService', function ($rootScope) {
    var location = null;

    return {
      setLocation: function (l) {
        location = l;
      },
      getLocation: function () {
        return location
      }
    }
  });

