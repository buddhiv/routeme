angular.module('app.controllers', ['ionic'])

  .controller('homeCtrl', function ($scope) {

  })

  .controller('resfeberCtrl', function ($scope, userService, CheckLoginService, $state) {

    $scope.checkLogin = function () {
      if (CheckLoginService.isLogged()) {
        $state.go('home');
      } else {
        $state.go('login');
      }

    };

    $scope.logout = function () {
      fb.unauth();
      $scope.checkLogin();
    };

    if(CheckLoginService.isLogged){
      var temp = CheckLoginService.getAuthData();
      console.log(temp);
      $scope.username1 = temp.loggedUser;
      $scope.userImage1 = temp.imageURL;
      console.log($scope.username);
    }

  })


  .controller("LoginController", function ($scope, $firebaseAuth, $location, $state, $ionicPopup, FirebaseService, CheckLoginService, userService) {

    $scope.fblogin = function () {
      $scope.name = null;
      $scope.image = null;

      var authObject = $firebaseAuth(fb);
      authObject.$authWithOAuthPopup('facebook').then(function (authData) {
        console.log(authData);
        if (authData) {
          console.log(authData.facebook.displayName);
          console.log(authData.facebook.profileImageURL);

          $scope.name = authData.facebook.displayName;
          $scope.image = authData.facebook.profileImageURL;

          userService.setLoggedUser($scope.name);
          userService.setUserImage($scope.image);

          console.log($scope.name + "this is name");
          console.log($scope.image + "this is image");
          $state.go('home');
        }
      }).catch(function (error) {
        console.log('error' + error);
      });
      ;
    }

    $scope.googlelogin = function () {
      var authObject = $firebaseAuth(fb);
      authObject.$authWithOAuthPopup('google').then(function (authData) {
        console.log(authData);
        if (authData) {

          $scope.name = authData.google.displayName;
          $scope.image = authData.google.profileImageURL;

          userService.setLoggedUser($scope.name);
          userService.setUserImage($scope.image);

          $state.go('home');
        }
      }).catch(function (error) {
        console.log('error' + error);
      })
    }

    // $scope.fbReference = FirebaseService.getFirebaseService();
    //
    $scope.checkLogin = function () {
      if (CheckLoginService.isLogged()) {
        $state.go('home');
      } else {
        $state.go('login');
      }

    };

    $scope.logout = function () {
      fb.unauth();
      $scope.checkLogin();
    }

    $scope.login = function (username, password) {
      var fbAuth = $firebaseAuth(fb);
      fbAuth.$authWithPassword({
        email: username,
        password: password
      }).then(function (authData) {
        $location.path("/page1");
      }).catch(function (error) {
        $ionicPopup.alert({
          title: "User Authentication Failed!",
          content: "Check your Username & Password and try again."
        })
      });
    }

    $scope.register = function (username, password) {
      var fbAuth = $firebaseAuth(fb);
      fbAuth.$createUser({email: username, password: password}).then(function () {
        return fbAuth.$authWithPassword({
          email: username,
          password: password
        });
      }).then(function (authData) {
        $location.path("/page1");
      }).catch(function (error) {
        $ionicPopup.alert({
          title: "Resfeber couldn't Sign you In!",
          content: "Check the email address you entered and try again."
        })
      });
    }

    window.authDataCallback = function (authData) {
      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
        $scope.userLogged = true;
        // $state.go("home");
      } else {
        console.log("User is logged out");
        $scope.userLogged = false;
      }
    }
  })


  .controller('newPostCtrl', function ($scope, userService,TodoService, CheckLoginService) {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    var date = mm + "/" + dd + "/" + yyyy;

    $scope.community_posts = [];
    $scope.input = {};

    $scope.username = userService.getLoggedUser();
    $scope.userImage = userService.getUserImage();

    if(!$scope.username){
      var authDataArray = CheckLoginService.getAuthData();
      $scope.username = authDataArray.loggedUser;
      $scope.userImage = authDataArray.imageURL;
    }

    $scope.uplaodPost = function () {

      var imageURL = "http://kvvu.images.worldnow.com/images/9562099_G.jpg";
      var location = document.getElementById('autocomplete').value;
      var post = document.getElementById('post').value;

      $scope.input = {
        username: $scope.username,
        profileImage: $scope.userImage,
        location: location,
        date: date,
        post: post,
        image: imageURL
      };

        TodoService.addTodo($scope.input)
          .then(function (result) {
            $scope.input = {};
            // Reload our todos, not super cool
            getAllTodos();
          });

      document.getElementById("post").value = "";

    }

    function getAllTodos() {
      TodoService.getTodos()
        .then(function (result) {
          $scope.community_posts = result.data.data;
        });
    }

    $scope.searchPlace = function () {
      var input = document.getElementById('autocomplete');
      // console.log("text" + input);

      console.log("Came in");
      navigator.geolocation.getCurrentPosition(function (p) {
        $scope.latitude = p.coords.latitude;
        $scope.longitude = p.coords.longitude;
      });

      var map = new google.maps.Map(document.getElementById('maphhh'), {
        center: {lat: -33.8688, lng: 151.2195},
        zoom: 13
      });

      var types = 'all';

      // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      // map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

      var autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.bindTo('bounds', map);

      var infowindow = new google.maps.InfoWindow();

      var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
      });

      autocomplete.addListener('place_changed', function () {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
          window.alert("Autocomplete's returned place contains no geometry");
          return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);  // Why 17? Because it looks good.
        }
        marker.setIcon(/** @type {google.maps.Icon} */({
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(35, 35)
        }));
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
          address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
          ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, marker);
      });
    }

    // $scope.list = function () {
    //   fbAuth = fb.getAuth();
    //   if (fbAuth) {
    //     var syncObject = $firebaseObject(fb.child("users/" + fbAuth.uid));
    //     syncObject.$bindTo($scope, "data");
    //   }
    // }
    //
    // $scope.create = function () {
    //   $ionicPopup.prompt({
    //       title: 'Type in everything on your mind about this place!',
    //       inputType: 'text'
    //     })
    //     .then(function (result) {
    //       if (result !== "") {
    //         if ($scope.data.hasOwnProperty("todos") !== true) {
    //           $scope.data.todos = [];
    //         }
    //         $scope.data.todos.push({title: result});
    //       } else {
    //         console.log("Action not completed");
    //       }
    //     });
    // }
  })

  // .controller("TodoController", function ($scope, $firebaseObject, $ionicPopup) {
  //
  //   $scope.list = function () {
  //     fbAuth = fb.getAuth();
  //     if (fbAuth) {
  //       var syncObject = $firebaseObject(fb.child("users/" + fbAuth.uid));
  //       syncObject.$bindTo($scope, "data");
  //     }
  //
  //     $scope.create = function () {
  //       $ionicPopup.prompt({
  //           title: 'Enter a new TODO item',
  //           inputType: 'text'
  //         })
  //         .then(function (result) {
  //           if (result !== "") {
  //             if ($scope.data.hasOwnProperty("todos") !== true) {
  //               $scope.data.todos = [];
  //             }
  //             $scope.data.todos.push({title: result});
  //           } else {
  //             console.log("Action not completed");
  //           }
  //         });
  //     }
  //   }
  // })

  .controller('resfeberCommunityCtrl', function ($scope, TodoService, $firebaseObject, $ionicPopup, $state, userService) {
    $scope.community_posts = [];
    $scope.input = {};
    $scope.specificPlaces = [];
    $scope.temp = [];
    $scope.count = 1;

    $scope.findPosts = function () {
      $scope.locatioName = document.getElementById('search').value;
      console.log($scope.locatioName);
      for (var i = 0, posts; posts = $scope.community_posts[i]; i++){
        console.log(posts);
        if(posts.location == $scope.locatioName){
          console.log('came in');
          $scope.specificPlaces.push(posts);
        }
      }

      if($scope.specificPlaces.length != 0){
        $scope.temp = $scope.community_posts;
        console.log($scope.temp);
        $scope.community_posts = $scope.specificPlaces;
        console.log($scope.community_posts);
        $state.go($state.current, {}, {reload: true});
        $scope.specificPlaces = [];
        $scope.count = 0;
      }
      // $window.location.reload(true);
    }

    $scope.createPost = function () {
      $state.go("newPost");
    }

    $scope.clear = function () {
      var temp = document.getElementById('clear');

    }

    function getAllTodos() {
      TodoService.getTodos()
        .then(function (result) {
          $scope.community_posts = result.data.data;
        });

    }

    $scope.addTodo = function () {
      TodoService.addTodo($scope.input)
        .then(function (result) {
          $scope.input = {};
          // Reload our todos, not super cool
          getAllTodos();
        });
    }

    $scope.deleteTodo = function (id) {
      TodoService.deleteTodo(id)
        .then(function (result) {
          // Reload our todos, not super cool
          getAllTodos();
        });
    }

    getAllTodos();

    $scope.searchPlace = function () {
      var input = document.getElementById('search');

      if(input.value == "" && $scope.count == 0){
        console.log('done');
        if($scope.temp.length != 0){
          $scope.community_posts = $scope.temp;
          console.log($scope.community_posts);
          $state.go($state.current, {}, {reload: true});

          $scope.count = 1;
          $scope.specificPlaces = [];
          $scope.temp = [];
        }

      }

      console.log("Came in");
      navigator.geolocation.getCurrentPosition(function (p) {
        $scope.latitude = p.coords.latitude;
        $scope.longitude = p.coords.longitude;
      });

      var map = new google.maps.Map(document.getElementById('maphh'), {
        center: {lat: -33.8688, lng: 151.2195},
        zoom: 13
      });

      var types = 'all';

      // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      // map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

      var autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.bindTo('bounds', map);

      var infowindow = new google.maps.InfoWindow();

      var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
      });

      autocomplete.addListener('place_changed', function () {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
          window.alert("Autocomplete's returned place contains no geometry");
          return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);  // Why 17? Because it looks good.
        } 
        marker.setIcon(/** @type {google.maps.Icon} */({
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(35, 35)
        }));
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
          address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
          ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, marker);
      });
    }
  })


  .controller('nearbyHotelsCtrl', function ($scope, detailService, $state) {

    var infoWindow;
    var service;
    $scope.hotel = [];
    $scope.hotelPhotos = [];

    $scope.setImageId = function (imageId) {
      console.log("ffff " + imageId);
      detailService.setId(imageId);
      $state.go("placeDetails");
    }

    $scope.initMap = function () {
      navigator.geolocation.getCurrentPosition(function (p) {
        $scope.latitude = p.coords.latitude;
        $scope.longitude = p.coords.longitude;

        var mapOptions = {
          center: {lat: $scope.latitude, lng: $scope.longitude},
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        // infoWindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService($scope.map);

        performSearch();

      });
    }


    performSearch = function () {
      console.log("s1");
      if (!$scope.map) {
        console.log("no map");
        return;
      }

      console.log($scope.map.getCenter());

      var request = {
        location: $scope.map.getCenter(),
        radius: '3500',
        keyword: 'hotels'
      };
      service.radarSearch(request, callback);
    }

    callback = function (results, status) {

      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }

      for (var i = 0, result; result = results[i]; i++) {

        service.getDetails({
          placeId: result.place_id
        }, function (place, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            // $scope.hotels.push(place.name);
            hotelPhotos = place.photos;
            if (!hotelPhotos) {
              return;
            }
            $scope.hotel.push({
              "name": place.name,
              "rating": place.rating,
              "place_id": place.place_id,
              "icon": hotelPhotos[0].getUrl({'maxWidth': 35, 'maxHeight': 35})
            });
            // if ($scope.hotel.length == results.length) {
            // console.log($scope.hotels);
            console.log($scope.hotel);
            console.log($scope.hotel);

            $scope.$evalAsync(function () {
              // var a = $scope.hotels;
              // $scope.hotels = a;
              var temp = $scope.hotel;
              $scope.hotel = temp;
            }, 1000);
            // }
          }
        });
      }
    }
  })


  .controller('nearbyRestaurantsCtrl', function ($scope, detailService, $state) {
    var infoWindow;
    var service;
    $scope.restaurants = [];

    $scope.initMap = function () {
      navigator.geolocation.getCurrentPosition(function (p) {
        $scope.latitude = p.coords.latitude;
        $scope.longitude = p.coords.longitude;

        var mapOptions = {
          center: {lat: $scope.latitude, lng: $scope.longitude},
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        // infoWindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService($scope.map);

        performSearch();

      });
    }

    performSearch = function () {
      console.log("s1");
      if (!$scope.map) {
        console.log("no map");
        return;
      }

      console.log($scope.map.getCenter());

      var request = {
        location: $scope.map.getCenter(),
        radius: '3500',
        keyword: 'restaurants'
      };

      console.log("s1");

      console.log(service);
      service.radarSearch(request, callback);
    }

    $scope.setImageId = function (imageId) {
      console.log("ffff " + imageId);
      detailService.setId(imageId);
      $state.go("placeDetails");
    }


    callback = function (results, status) {

      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }


      for (var i = 0, result; result = results[i]; i++) {
        console.log(result.place_id);

        service.getDetails({
          placeId: result.place_id
        }, function (place, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            // $scope.hotels.push(place.name);
            var photos = place.photos;
            if (!photos) {
              return;
            }
            $scope.restaurants.push({
              "name": place.name,
              "rating": place.rating,
              "place_id": place.place_id,
              "icon": photos[0].getUrl({'maxWidth': 35, 'maxHeight': 35})
            });
            if ($scope.restaurants.length == results.length) {
              // console.log($scope.hotels);
              console.log($scope.restaurants);

              $scope.$evalAsync(function () {
                // var a = $scope.hotels;
                // $scope.hotels = a;
                var temp = $scope.restaurants;
                $scope.restaurants = temp;
              }, 1000);
            }
          }
        });
      }
    }
  })


  .controller('nearbyTouristSitesCtrl', function ($scope, detailService, $state) {
    var infoWindow;
    var service;
    $scope.sites = [];

    $scope.initMap = function () {
      navigator.geolocation.getCurrentPosition(function (p) {
        $scope.latitude = p.coords.latitude;
        $scope.longitude = p.coords.longitude;

        var mapOptions = {
          center: {lat: $scope.latitude, lng: $scope.longitude},
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        // infoWindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService($scope.map);

        performSearch();

      });
    }

    performSearch = function () {
      console.log("s1");
      if (!$scope.map) {
        console.log("no map");
        return;
      }

      console.log($scope.map.getCenter());

      var request = {
        location: $scope.map.getCenter(),
        radius: '3500',
        keyword: 'tourist attraction'
      };

      console.log("s1");

      console.log(service);
      service.radarSearch(request, callback);
    }

    $scope.setImageId = function (imageId) {
      console.log("ffff " + imageId);
      detailService.setId(imageId);
      $state.go("placeDetails");
    }


    callback = function (results, status) {

      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }


      for (var i = 0, result; result = results[i]; i++) {
        console.log(result.place_id);

        service.getDetails({
          placeId: result.place_id
        }, function (place, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            // $scope.hotels.push(place.name);
            var photos = place.photos;
            if (!photos) {
              return;
            }
            $scope.sites.push({
              "name": place.name,
              "rating": place.rating,
              "place_id": place.place_id,
              "icon": photos[0].getUrl({'maxWidth': 35, 'maxHeight': 35})
            });
            if ($scope.sites.length == results.length) {
              // console.log($scope.hotels);
              console.log($scope.sites);

              $scope.$evalAsync(function () {
                // var a = $scope.hotels;
                // $scope.hotels = a;
                var temp = $scope.sites;
                $scope.sites = temp;
              }, 1000);
            }
          }
        });
      }
    }
  })

  .controller('nearbyShoppingMallsCtrl', function ($scope, $state, detailService) {
    var infoWindow;
    var service;
    $scope.malls = [];

    $scope.initMap = function () {
      navigator.geolocation.getCurrentPosition(function (p) {
        $scope.latitude = p.coords.latitude;
        $scope.longitude = p.coords.longitude;

        var mapOptions = {
          center: {lat: $scope.latitude, lng: $scope.longitude},
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        // infoWindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService($scope.map);

        performSearch();

      });
    }

    performSearch = function () {
      console.log("s1");
      if (!$scope.map) {
        console.log("no map");
        return;
      }

      console.log($scope.map.getCenter());

      var request = {
        location: $scope.map.getCenter(),
        radius: '3500',
        keyword: 'malls'
      };

      console.log("s1");

      console.log(service);
      service.radarSearch(request, callback);
    }

    $scope.setImageId = function (imageId) {
      console.log("ffff " + imageId);
      detailService.setId(imageId);
      $state.go("placeDetails");
    }

    callback = function (results, status) {

      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }


      for (var i = 0, result; result = results[i]; i++) {
        console.log(result.place_id);

        service.getDetails({
          placeId: result.place_id
        }, function (place, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            // $scope.hotels.push(place.name);
            var photos = place.photos;
            if (!photos) {
              return;
            }
            $scope.malls.push({
              "name": place.name,
              "rating": place.rating,
              "place_id": place.place_id,
              "icon": photos[0].getUrl({'maxWidth': 35, 'maxHeight': 35})
            });
            if ($scope.malls.length == results.length) {
              // console.log($scope.hotels);
              console.log($scope.malls);

              $scope.$evalAsync(function () {
                // var a = $scope.hotels;
                // $scope.hotels = a;
                var temp = $scope.malls;
                $scope.malls = temp;
              }, 1000);
            }
          }
        });
      }
    }
  })

  .controller('userReviewsCtrl', function ($scope, $state, detailService) {

    $scope.review_id = detailService.getID();
    $scope.reviewArray = [];
    var service;

    $scope.initMap = function () {
      var mapOptions = {
        center: {lat: -33.866, lng: 151.196},
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
      // infoWindow = new google.maps.InfoWindow();
      service = new google.maps.places.PlacesService($scope.map);

      service.getDetails({
        placeId: $scope.review_id
      }, function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // $scope.hotels.push(place.name);
          $scope.reviewArray = place.reviews;
          if (!$scope.reviewArray) {
            return;
          }
        }
      });
    }

  })

  .controller('directionsCtrl', function ($scope, detailService, $ionicLoading) {

    var service;
    $scope.endlat = null;
    $scope.endlong = null;

    $scope.directionId = detailService.getID();

    $scope.initMap = function () {
      console.log("init map start");

      navigator.geolocation.getCurrentPosition(function (p) {
        $scope.latitude = p.coords.latitude;
        $scope.longitude = p.coords.longitude;

        console.log("start lat " + $scope.latitude);
        console.log("start long " + $scope.longitude);

        var mapOptions = {
          center: {lat: $scope.latitude, lng: $scope.longitude},
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById('maddd'), mapOptions);

        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;

        service = new google.maps.places.PlacesService($scope.map);

        calculateAndDisplayRoute(directionsService, directionsDisplay);
      });
    }
    calculateAndDisplayRoute = function (directionsService, directionsDisplay) {
      console.log(service);
      service.getDetails({
        placeId: $scope.directionId
      }, function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {

          console.log(place);

          $scope.endlat = place.geometry.location.lat();
          $scope.endlong = place.geometry.location.lng();

          var start = new google.maps.LatLng($scope.latitude, $scope.longitude);
          var end = new google.maps.LatLng($scope.endlat, $scope.endlong);

          directionsService.route({
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
          }, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(response);
              directionsDisplay.setMap($scope.map);
            } else {
              alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
            }
          });
        }
      });
    }
  })

  .controller('placeDetailsCtrl', function ($scope, detailService, $state) {
    $scope.image_id = detailService.getID();
    $scope.imageArray = [];
    $scope.imageArray1 = [];
    $scope.hotelDetails = [];
    var service;

    $scope.setReviewId = function (reviewId) {
      detailService.setId(reviewId);
      $state.go("userReviews");
    }

    $scope.setDirectionId = function (directionId) {
      detailService.setId(directionId);
      $state.go("directions");
    }

    $scope.initMap = function () {
      var mapOptions = {
        center: {lat: -33.866, lng: 151.196},
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
      // infoWindow = new google.maps.InfoWindow();
      service = new google.maps.places.PlacesService($scope.map);
      service.getDetails({
        placeId: $scope.image_id
      }, function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // $scope.hotels.push(place.name);
          $scope.imageArray1 = place.photos;
          $scope.hotelDetails.push({
            "id": place.place_id,
            "name": place.name,
            "address": place.formatted_address,
            "phone_number": place.formatted_phone_number
          })
          if (!$scope.imageArray1) {
            return;
          }
          // if ($scope.hotel.length == results.length) {
          // console.log($scope.hotels);
          console.log($scope.imageArray);
          for (var i = 0, result; result = $scope.imageArray1[i]; i++) {
            $scope.imageArray.push(result.getUrl({'maxWidth': 350, 'maxHeight': 350}));
          }

          $scope.$evalAsync(function () {
            // var a = $scope.hotels;
            // $scope.hotels = a;
            var temp = $scope.imageArray;
            $scope.imageArray = temp;
            var temp = $scope.hotelDetails;
            $scope.hotelDetails = temp;
          }, 1000);
          // }
        }
      });
    }


  })


  .controller("ImageController", function ($scope, $ionicHistory, $firebaseArray, $cordovaCamera) {

    $ionicHistory.clearHistory();
    $scope.images = [];

    var fbAuth = fb.getAuth();
    if (fbAuth) {
      var userReference = fb.child("users/" + fbAuth.uid);
      var syncArray = $firebaseArray(userReference.child("images"));
      $scope.images = syncArray;
    } else {
      $state.go("firebase");
    }

    $scope.upload = function () {
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        targetWidth: 500,
        targetHeight: 500,
        saveToPhotoAlbum: false
      };
      $cordovaCamera.getPicture(options).then(function (imageData) {
        syncArray.$add({image: imageData}).then(function () {
          alert("Image has been uploaded");
        });
      }, function (error) {
        console.error(error);
      });
    }

  })

.controller('DemoCtrl',function ($scope, $http, Backand) {

  var baseUrl = '/1/objects/';
  var baseActionUrl = baseUrl + 'action/'
  var objectName = 'test';
  var filesActionName = 'files';

  // Display the image after upload
  $scope.imageUrl = null;

  // Store the file name after upload to be used for delete
  $scope.filename = null;

  // input file onchange callback
  function imageChanged(fileInput) {

    //read file content
    var file = fileInput.files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
      upload(file.name, e.currentTarget.result).then(function(res) {
        $scope.imageUrl = res.data.url;
        $scope.filename = file.name;
      }, function(err){
        alert(err.data);
      });
    };

    reader.readAsDataURL(file);
  };

  // register to change enent on input file
  function initUpload() {
    var fileInput = document.getElementById('fileInput');

    fileInput.addEventListener('change', function(e) {
      imageChanged(fileInput);
    });
  }

  // call to Backand action with the file name and file data
  function upload(filename, filedata) {
    // By calling the files action with POST method in will perform
    // an upload of the file into Backand Storage
    return $http({
      method: 'POST',
      url : Backand.getApiUrl() + baseActionUrl +  objectName,
      params:{
        "name": filesActionName
      },
      headers: {
        'Content-Type': 'application/json'
      },
      // you need to provide the file name and the file data
      data: {
        "filename": filename,
        "filedata": filedata.substr(filedata.indexOf(',') + 1, filedata.length) //need to remove the file prefix type
      }
    });
  };

  $scope.deleteFile = function(){
    if (!$scope.filename){
      alert('Please choose a file');
      return;
    }
    // By calling the files action with DELETE method in will perform
    // a deletion of the file from Backand Storage
    $http({
      method: 'DELETE',
      url : Backand.getApiUrl() + baseActionUrl +  objectName,
      params:{
        "name": filesActionName
      },
      headers: {
        'Content-Type': 'application/json'
      },
      // you need to provide the file name
      data: {
        "filename": $scope.filename
      }
    }).then(function(){
      // Reset the form
      $scope.imageUrl = null;
      document.getElementById('fileInput').value = "";
    });
  }

  $scope.initCtrl = function() {
    initUpload();
  }
})



  .controller('TravelAssistantCtrl', function ($scope) {

  })


  .controller('cinnamonLakeSideCtrl', function ($scope) {

  })


  .controller('addPostCtrl', function ($scope) {

  })

  .controller('helpCtrl', function ($scope) {

  })


// .controller('resfeberCommunityCtrl', function($scope) {
//
// })

//  .controller('resfeberCommunityCtrl', ['$scope','$http',function ($http, $scope, ResfeberService) {
//      $scope.posts = [];
//      $scope.input = {};
//
//      function getAllPosts() {
//          ResfeberService.getPosts().then(function (result) {
//              $scope.posts = result.data.data;
//          });
//      }
//
//      $scope.addPost = function(){
//          ResfeberService.addPost($scope.input).then(function(result){
//              $scope.input = {};
//          })
//      }
//      // $scope.deletePost(){
//      //
//      // }
//
// //     getAllPosts();
//  }])




