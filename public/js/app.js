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
  this.login = function(){
    this.loggedIn = true;
  }

  // WORKING ON LIKE ROUTE
  this.likeRoute = function(){
    console.log("like button clicked");
  }

  // WORKING ON VIEWING COMMENTS
  this.viewComments = function(){
    console.log("Comments tag clicked");
  }

  // WORKING ON ADDING A COMMENT
  this.addComment = function(){
    console.log("User is adding a comment");
  }

  // WHAT DOES THIS DO
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
          controller.login();
        },
        function(error){
        }
      );
  }

  // HOW IS THIS DIFFERENT THAN ABOVE
  this.checkAuth = function(){
      $http({
        method: 'POST',
        url: '/session/login',
        data: {
          username: this.loggedUsername,
          password: this.loggedPassword
        }
      }).then(
        function(response){
          // console.log(response.config.data);
          controller.currentUser = response.config.data.username;
          // console.log(controller.currentUser);
        },
        function(error){
          console.log(error);
        }
      );
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
