/**
 * Created by Buddhi on 6/11/2016.
 */
angular.module('starter.controllers')

  // travel controller
  .controller('TravelCtrl', function ($scope, $rootScope, RouteResponseService, RouteStartEndService, CheckLoginService) {

    $scope.initTravel = function () {
      $scope.logged = CheckLoginService.isLogged();


      $scope.responseT = null;
      $scope.start = null;
      $scope.end = null;

      $scope.$evalAsync(function () {
        $scope.responseT = RouteResponseService.getResponse();

        console.log("responseT");
        console.log($scope.responseT);

        $scope.start = RouteStartEndService.getStart();
        $scope.end = RouteStartEndService.getEnd();

        console.log($scope.end + "end");
        console.log($scope.start + "start");

        /////////////////////////////////////////////////////////////
        console.log("true func");

        if ($scope.responseT) {
          if ($scope.logged) {
            $scope.authData = CheckLoginService.getAuthData();

            console.log("has response");

            var firebaseRef = new Firebase("https://routeme.firebaseio.com");
            var travelRef = firebaseRef.child('travel');
            var newTravelRef = travelRef.push();

            var userid = $scope.authData.uid;
            console.log(userid);

            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();

            console.log($scope.responseT.routes[0].legs.length + " l length");

            var throughPoints = [];
            for (i = 0; i < $scope.responseT.routes[0].legs.length; i++) {
              for (j = 0; j < $scope.responseT.routes[0].legs[i].steps.length; j++) {
                throughPoints.push($scope.responseT.routes[0].legs[i].steps[j].instructions);
              }
            }

            newTravelRef.set({
              user: userid,
              start: $scope.start,
              through: throughPoints,
              end: $scope.end,
              year: yyyy,
              month: mm,
              date: dd
            }, function (error) {
              if (error) {
                console.log("error");
              } else {
                console.log("no error");
              }
            });

          }
        } else {
          console.log("has no response");
        }
      });
    };

  });
