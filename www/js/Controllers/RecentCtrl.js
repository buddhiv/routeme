/**
 * Created by Buddhi on 6/16/2016.
 */

angular.module('starter.controllers')

  .controller('RecentCtrl', function ($scope, CheckLoginService, $state, TravelDetailsService) {
    $scope.initRecent = function () {
      if (CheckLoginService.isLogged()) {
        $scope.logged = true;

        var authData = CheckLoginService.getAuthData();

        console.log(authData);

        $scope.$evalAsync(function () {
          $scope.userEmail = authData.google.email;
          $scope.userName = authData.google.displayName;
          $scope.imageUrl = authData.google.profileImageURL;
        });


        ///////read data
        var fbRef = new Firebase("https://routeme.firebaseio.com/travel");

        fbRef.on("value", function (snapshot) {
          $scope.$evalAsync(function () {
            $scope.travelValues = snapshot.val();
          });
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });

      } else {
        $scope.logged = false;
      }
    }

    $scope.travelDetails = function (tra) {
      TravelDetailsService.setTravelDetails(tra);

      console.log(tra.date);
      $state.go('tab.traveldetails');
    }

    $scope.initTravelDetails = function () {
      var t = TravelDetailsService.getTravelDetails();

      console.log(t);

      $scope.$evalAsync(function () {
        $scope.travel = t;
      });
    }
  });
