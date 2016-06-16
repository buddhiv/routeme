/**
 * Created by Buddhi on 6/14/2016.
 */

angular.module('starter.controllers')

  .controller('NearbyCtrl', function ($scope, $state, NearbyLocationService) {

    $scope.initNearby = function () {

      $scope.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.8688, lng: 151.2195},
        zoom: 13
      });
    }

    //autocomplete the dropdown suggestions
    $scope.autocomplete = function () {
      // console.log("type " + document.getElementById('autocompleteCombo').value);

      var input = document.getElementById('autocompleteCombo');
      var types = document.getElementById('typeSelector');

      var autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.bindTo('bounds', $scope.map);

      autocomplete.addListener('place_changed', function () {
        // marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
          window.alert("Autocomplete's returned place contains no geometry");
          return;
        }

        $scope.$evalAsync(function () {
          $scope.placeDetails = place;
        });

        $state.go('tab.nearby');

        var address = '';
        if (place.address_components) {
          address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
          ].join(' ');
        }

      });
    }

    $scope.gotoMap = function (placeDetails) {

      $scope.map = NearbyLocationService.getLocation();

      var marker = new google.maps.Marker({
        position: {
          lat: placeDetails.geometry.location.lat(),
          lng: placeDetails.geometry.location.lng()
        },
        map: $scope.map
      });

      $scope.map.setCenter(new google.maps.LatLng(placeDetails.geometry.location.lat(), placeDetails.geometry.location.lng()));

      $state.go('tab.map');
    }
  });

