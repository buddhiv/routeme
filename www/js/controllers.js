angular.module('starter.controllers', ['ionic'])

  // map controller
  .controller('MapCtrl', function ($scope, $ionicLoading, $compile, $state) {

    $scope.markersArray = [];

    $scope.directionsDisplay = null;
    $scope.directionsService = null;

    $scope.placename = "";

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
              $scope.$apply(function () {
                $scope.geocodeResults = results;
              });
            }
          }
        });

        console.log("sdsss");

        // if ($scope.geocodeResult) {
        //   console.log("sdsd");
        //
        //   var marker = new google.maps.Marker({
        //     position: {
        //       lat: $scope.geocodeResult.geometry.location.lat(),
        //       lng: $scope.geocodeResult.geometry.location.lng()
        //     },
        //     map: map,
        //     draggable: true
        //   });
        //
        //   $scope.markersArray[$scope.markersArray.length] = marker;
        //   console.log("no of markers: " + $scope.markersArray.length);
        // }

      });

      google.maps.event.addListener(map, 'center_changed', function (event) {
        $scope.updateCurrentLocationHeader();
      });

      $scope.map = map;

      //center the map on the current location
      $scope.centerMap();
    };

    // place a marker at the given location
    $scope.placeMarker = function (geometry) {
      console.log('clicked');

      var marker = new google.maps.Marker({
        position: {
          lat: geometry.location.lat(),
          lng: geometry.location.lng()
        },
        map: $scope.map
      });

      $scope.$apply(function () {
        $scope.geocodeResults = [];
        console.log("empty");
      });
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
            console.log(results[0].formatted_address);

            $scope.$apply(function () {
              $scope.placename = results[0].formatted_address;
            });
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
        console.log("I" + i);
      }
      console.log("markers length" + $scope.markersArray.length);
      console.log("waypoints length" + waypointsArray.length);

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
          console.log("routes" + response.routes.length);
        } else {
          console.log("status not OK");
        }
      });
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
        // cmap.setZoom(16);
      })

      $scope.updateCurrentLocationHeader();

      $scope.map = cmap;
    }
  })

  // travel controller
  .controller('TravelCtrl', function ($scope) {

  })

  // more tab controller
  .controller('MoreCtrl', function ($scope) {

  })

  // about controller
  .controller('AboutCtrl', function () {
  });
