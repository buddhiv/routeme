/**
 * Created by Buddhi on 6/14/2016.
 */

angular.module('starter.controllers')

  .controller('NearbyCtrl', function ($scope, $state) {

    $scope.initNearby = function () {

      $scope.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.8688, lng: 151.2195},
        zoom: 13
      });
    }

    $scope.autocomplete = function () {
      console.log("type " + document.getElementById('autocompleteCombo').value);

      var input = document.getElementById('autocompleteCombo');
      var types = document.getElementById('typeSelector');

      // do layout
      // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      // map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

      var autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.bindTo('bounds', $scope.map);

      // var marker = new google.maps.Marker({
      //   map: map,
      //   anchorPoint: new google.maps.Point(0, -29)
      // });

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
        console.log(place);

        $state.go('tab.nearby');

        // marker.setIcon(/** @type {google.maps.Icon} */({
        //   url: place.icon,
        //   size: new google.maps.Size(71, 71),
        //   origin: new google.maps.Point(0, 0),
        //   anchor: new google.maps.Point(17, 34),
        //   scaledSize: new google.maps.Size(35, 35)
        // }));
        // marker.setPosition(place.geometry.location);
        // marker.setVisible(true);

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
  });

