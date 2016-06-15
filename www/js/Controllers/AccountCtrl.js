/**
 * Created by Buddhi on 6/11/2016.
 */

angular.module('starter.controllers')

  // account controller
  .controller('AccountCtrl', function ($scope, $firebaseAuth, $state, $rootScope, FirebaseService, CheckLoginService) {

    $scope.fbReference = FirebaseService.getFirebaseService();

    $scope.checkLogin = function () {

      console.log($scope.fbReference);
      console.log($scope.userEmail);
      if (CheckLoginService.isLogged()) {
        $scope.logged = true;

        var authData = CheckLoginService.getAuthData();

        console.log(authData);

        $scope.$evalAsync(function () {
          $scope.userEmail = authData.google.email;
          $scope.userName = authData.google.displayName;
          $scope.imageUrl = authData.google.profileImageURL;
        });

      } else {
        $scope.logged = false;
      }

      console.log($scope.userName);

    };

    $scope.loginUser = function () {
      var firebaseAuth = $firebaseAuth($scope.fbReference);

      firebaseAuth.$authWithOAuthPopup("google", function (error, authData) {

      }).then(function (authData) {

        console.log("logged in");
        $scope.logged = true;

        $scope.$evalAsync(function () {
          $scope.userEmail = authData.google.email;
          $scope.userName = authData.google.displayName;
          $scope.imageUrl = authData.google.profileImageURL;
        });

        $state.go('tab.account');
      }).catch(function (error) {
        console.log("Login Failed!", error);

      })
      ;
    };

    $scope.logoutUser = function () {
      $scope.fbReference.unauth();

      console.log("logged out");
      $scope.logged = false;

      $scope.$evalAsync(function () {
        $scope.userEmail = null;
      });

      $state.go('tab.account');
    }

    $scope.addData = function () {
      console.log('add data');

      var fbRef = new Firebase("https://routeme.firebaseio.com");

      var studentsRef = fbRef.child("students");

      var newStudentRef = studentsRef.push();
      newStudentRef.set({
        name: "Buddhi Vikasitha",
        address: "Akuressa",
        age: 30
      }, function (error) {
        if (error) {
          console.log("error");
        } else {
          console.log("no error");
        }
      });


    }

  });
