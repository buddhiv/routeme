/**
 * Created by Buddhi on 6/11/2016.
 */

angular.module('starter.controllers')

  // map controller
  .controller('MapCtrl', function ($scope, $ionicLoading, $compile, $state, $rootScope, RouteResponseService, RouteStartEndService, NearbyLocationService) {

    $scope.markersArray = [];
    $scope.addressesArray = [];

    // indicates whether the route is displaying or not
    $scope.routeDisplaying = false;

    $scope.directionsDisplay = null;
    $scope.directionsService = null;

    $scope.currentplace = "";

    $scope.geocodeResults = [];

    // initialize map on the window
    $scope.initMap = function () {

      var myLatlng = new google.maps.LatLng(0, 0);

      var mapOptions = {
        center: myLatlng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        suppressInfoWindows: false
      };

      var map = new google.maps.Map(document.getElementById("map"), mapOptions);

      //add marker on the map onclick
      google.maps.event.addListener(map, 'click', function (event) {

        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({
          'location': event.latLng
        }, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results) {
              $scope.$evalAsync(function () {
                $scope.geocodeResults = results;
              }, 1000);
            }
          }
        });

      });

      google.maps.event.addListener(map, 'center_changed', function (event) {
        $scope.updateCurrentLocationHeader();
      });

      $scope.map = map;

      //center the map on the current location
      $scope.centerMap();

      //check nearby location variable
      var place = NearbyLocationService.setLocation($scope.map);
      // console.log(place)
      // if (place) {
      //   console.log(place)
      //   if ($scope.directionsDisplay) {
      //     $scope.$evalAsync(function () {
      //
      //       $scope.clearRoute();
      //
      //       var marker = new google.maps.Marker({
      //         position: {
      //           lat: place.geometry.location.lat(),
      //           lng: place.geometry.location.lng()
      //         },
      //         map: $scope.map
      //       });
      //
      //       console.log(place);
      //
      //       $scope.map.serCenter(place.geometry.location.lat(), place.geometry.location.lng());
      //       $scope.markersArray[$scope.markersArray.length] = marker;
      //     });
      //   }
      // }
    };

    // place a marker at the given location
    $scope.placeMarker = function (result) {
      console.log('clicked');

      var marker = new google.maps.Marker({
        position: {
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng()
        },
        map: $scope.map
      });

      $scope.$evalAsync(function () {
        $scope.geocodeResults = [];
      }, 1000);
      $scope.markersArray[$scope.markersArray.length] = marker;
    };

    //update the current location on top of the screen
    $scope.updateCurrentLocationHeader = function () {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        'location': $scope.map.getCenter()
        // 'location': new google.maps.LatLng(6.913, 79.858)
      }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            $scope.$evalAsync(function () {
              $scope.currentplace = results[0];
            }, 1000);
          }
        }
      });
    };

    $scope.markRoute = function () {
      if (!$scope.map) {
        console.log("no map");
        return;
      }
      if ($scope.markersArray.length == 0) {
        console.log("no markers");
        return;
      }

      if (!$scope.directionsService) {
        $scope.directionsService = new google.maps.DirectionsService();
      }
      if (!$scope.directionsDisplay) {
        $scope.directionsDisplay = new google.maps.DirectionsRenderer({
          draggable: true
        });
      }

      if ($scope.routeDisplaying) {
        console.log('direct');

        // go to the travel page
        $state.go('tab.travel');

        // display the route if it doesnt
      } else {
        $scope.directionsDisplay.setMap($scope.map);

        var start = $scope.markersArray[0].position;
        var end = $scope.markersArray[1].position;

        // var start = new google.maps.LatLng(6, 79);
        // var end = new google.maps.LatLng(7, 79);

        var waypointsArray = [];
        for (var i = 0; i <= ($scope.markersArray.length - 1); i++) {
          waypointsArray.push({
            location: $scope.markersArray[i].position,
            stopover: true
          });
        }

        var request = {
          origin: start,
          destination: end,
          waypoints: waypointsArray,
          optimizeWaypoints: false,
          provideRouteAlternatives: true,
          travelMode: google.maps.TravelMode.DRIVING
        };

        $scope.directionsService.route(request, function (response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            $scope.directionsDisplay.setDirections(response);

            console.log("aaa");
            console.log(response);
            RouteResponseService.setResponse(response);

            $scope.routeDisplaying = true;

          } else {
            console.log("status not OK");
          }
        });

        // show start and end for the route
        var geocoder = new google.maps.Geocoder;

        // geocode the start location
        geocoder.geocode({'location': start}, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              console.log("start result");
              RouteStartEndService.setStart(results[1].formatted_address);
            } else {
              console.log('No results found for start');
            }
          } else {
            console.log('Geocoder failed for start');
          }
        });

        // geocode the end location
        geocoder.geocode({'location': end}, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              console.log("end result");
              RouteStartEndService.setEnd(results[1].formatted_address);
            } else {
              console.log('No results found for end');
            }
          } else {
            console.log('Geocoder failed for end');
          }
        });
      }
    };

    // clear the map markers and route
    $scope.clearRoute = function () {
      if (!$scope.map) {
        return;
      }

      for (var i = 0; i < $scope.markersArray.length; i++) {
        $scope.markersArray[i].setMap(null);
      }
      $scope.markersArray = [];

      $scope.directionsDisplay.setMap(null);
      $scope.directionsDisplay = null;
      $scope.directionsService = null;

      $scope.routeDisplaying = false;
    };

    // center map on the current location
    $scope.centerMap = function () {
      if (!$scope.map) {
        console.log("no map");
        return;
      }

      var cmap = $scope.map;
      navigator.geolocation.getCurrentPosition(function (position) {
        cmap.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
      });

      $scope.updateCurrentLocationHeader();

      $scope.map = cmap;
    }
  });
