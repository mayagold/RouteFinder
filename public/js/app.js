/////////////////////////////////////////////////////
//     ANGULAR APP
/////////////////////////////////////////////////////
const app = angular.module("routemapp", []);


/////////////////////////////////////////////////////
//     ROUTE CONTROLLER
/////////////////////////////////////////////////////
app.controller('routeController', ['$http', '$scope', function($http, $scope){

  $scope.modalShown = false;
  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };

  const controller = this;
  this.routes = [];
  this.loggedIn = false;
  this.currentUser = '';
  this.commentsView = false; //switching will make comments appear

  // WORKING ON LIKE ROUTE
  this.likeRoute = function(route){
    console.log("like button clicked");
    $http({
      method: 'PUT',
      url: '/routes/' + route._id
    }).then(
      function(response){
        route.likes += 1;
        console.log(route.likes, " number of likes");
        // controller.getRoutes();
      }
    ), function(error){
        console.log(error);
      }
  }

  // WORKING ON VIEWING COMMENTS
  this.viewComments = function(){
    this.commentsView = !this.commentsView;
    console.log("Comments tag clicked");
  }

  // WORKING ON ADDING A COMMENT
  this.addComment = function(){
    console.log("User is adding a comment");
  }

  // SETS CURRENT USER UPON REGISTRATION
  this.checkRegister = function(username, password){
    $http({
      method: 'POST',
      url: '/session/registration',
      data: {
        username: this.registeredUsername,
        password: this.registeredPassword
      }
    }).then(
      function(response){
        controller.loggedIn = true;
        controller.currentUser = response.config.data.username;
        // console.log(controller.loggedIn, " should be true");
        // console.log(controller.currentUser, " should say current user");
      },
      function(error){
        console.log(error);
      }
    );
  }
  // SET CURRENT USER WHEN LOGGING IN
  this.checkAuth = function(){
      $http({
        method: 'POST',
        url: '/session/login',
        data: {
          username: this.loggedUsername,
          password: this.loggedPassword
        }
      }).then( function(response){
          // console.log(response.config.data);
          controller.loggedIn = true;
          controller.currentUser = response.config.data.username;
          // console.log(controller.currentUser);
        },
        function(error){
          console.log(error);
        }
      );
  }
  // LOGOUT
  this.logout = function() {        // still need to add ng-click
    $http({
      method: 'GET',
      url: '/session/logout'
    }).then(function(response){
      controller.loggedIn = false;
    })
  }
  /////////////////////////////////////////////////////
  //     CRUD
  /////////////////////////////////////////////////////
  // GET ROUTES
  this.getRoutes = function(){
    $http({
      method: 'GET',
      url: '/routes'
    }).then(
      function(response){
        controller.routes = response.data
      },
      function(error){
        console.log(error);
      }
    );
  }
  // CREATE A NEW ROUTE AND APPEND TO PAGE
  this.createRoute = function(){
    $http({
      method: 'POST',
      url: '/routes',
      data: {
        gpxFile: this.gpxFile,
        description: this.description,
      }
    }).then(
      function(response){
        controller.getRoutes();
      },
      function(error){
        console.log(error);
      }
    );
  }
  // DELETE A ROUTE
  this.deleteRoute = function(routes) {
    $http({
      method: 'DELETE',
      url: '/routes/' + routes._id,
    }).then(
      function(response){
        controller.getRoutes();
      },
      function(error){
        console.log(error);
      }
    );
  }
  // EDIT A ROUTE
  this.editRoute = function(route){
    console.log('working');
    $http({
      method: 'PUT',
      url: '/routes/' + route._id,
      data: {
        description: controller.description,
        details: controller.details
      }
    }).then(
      function(response){
        route.description = controller.description;
        route.details = controller.details;
        controller.getRoutes();
      },
      function(error){
        console.log(error);
      }
    );
  }
  // CALL GETROUTES WHEN PAGE LOADS
  this.getRoutes();
  // WHEN YOU CLICK ON A ROUTE, SHOW THAT ROUTE IN THE GOOGLE MAPS VIEW
  this.showRoute = function (route) {
    console.log('showRoute', route.gpxFile);
    showMap(route.gpxFile);
  };
}]);


/////////////////////////////////////////////////////
//     ANGULAR DIRECTIVE FOR REGISTRATION MODAL
/////////////////////////////////////////////////////
app.directive('modalDialog', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true,
    transclude: true,
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
      };
    },
      template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
  };
});
