/**
 * Created by Buddhi on 6/11/2016.
 */
angular.module('starter.controllers')

  // travel controller
  .controller('TravelCtrl', function ($scope, $rootScope, RouteResponseService, RouteStartEndService, CheckLoginService) {

    $scope.initTravel = function () {
      $scope.logged = CheckLoginService.isLogged();

      if ($scope.logged) {
        $scope.authData = CheckLoginService.getAuthData();
      }

      $scope.responseT = null;
      $scope.start = null;
      $scope.end = null;

      $scope.$evalAsync(function () {
        $scope.responseT = RouteResponseService.getResponse();

        console.log($scope.responseT);

        $scope.start = RouteStartEndService.getStart();
        $scope.end = RouteStartEndService.getEnd();

        console.log($scope.end + "end");
        console.log($scope.start + "start");

      });
    };


  });
