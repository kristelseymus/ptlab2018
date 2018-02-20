var app = angular.module('gamingNews', ['ui.router']);

app.factory('posts', ['$http', 'auth', function($http, auth){
  var o = {
    posts: []
  };

  o.getAll = function() {
    return $http.get('/posts').success(function(data) {
      angular.copy(data, o.posts);
    })
  };

  o.create = function(post) {
    return $http.post('/posts', post, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      o.posts.push(data);
    });
  };

  o.upvote = function(post) {
    return $http.put('/posts/' + post._id + '/upvote', null, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      post.upvotes += 1;
    });
  };

  o.downvote = function(post) {
    return $http.put('/posts/' + post._id + '/downvote', null, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      post.downvotes += 1;
    });
  };

  o.get = function(id) {
    return $http.get('/posts/' + id).then(function(res) {
      return res.data;
    });
  };

  o.addComment = function(id, comment) {
    console.log(id);
    console.log(comment);
    return $http.post('/posts/' + id + '/comments', comment, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    });
  };

  o.upvoteComment = function(post, comment) {
    return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote', null, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      comment.upvotes += 1;
    });
  };

  o.downvoteComment = function(post, comment) {
    return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/downvote', null, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      comment.downvotes += 1;
    });
  };

  return o;
}]);

app.factory('auth', ['$http', '$window', function($http, $window){
  var auth = {};

  auth.saveToken = function(token) {
    $window.localStorage['gaming-news-token'] = token;
  };

  auth.getToken = function() {
    return $window.localStorage['gaming-news-token'];
  };

  auth.isLoggedIn = function(){
    var token = auth.getToken();

    if(token){
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };

  auth.currentUser = function(){
    if(auth.isLoggedIn()){
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.username;
    }
  };

  auth.register = function(user){
    console.log("auth");
    console.log(user);
    return $http.post('/register', user).success(function(data){
      auth.saveToken(data.token);
    });
  };

  auth.logIn = function(user){
    return $http.post('/login', user).success(function(data){
      auth.saveToken(data.token);
    });
  };

  auth.logOut = function(user){
    $window.localStorage.removeItem('gaming-news-token');
  };

  return auth;
}]);

app.controller('MainCtrl', [
    '$scope',
    'posts',
    'auth',
    '$state',
    function($scope, posts, auth, $state) {
        $scope.posts = posts.posts;
        $scope.isLoggedIn = auth.isLoggedIn;

        $scope.addPost = function() {
            if (!$scope.title || $scope.title === '') {
                return;
            }
            posts.create({
              title: $scope.title,
              summary: $scope.summary,
              body: $scope.body,
              link: $scope.link,
              date: new Date(),
            }).then(function(){
              $state.go('home');
            });
            $scope.title = '';
            $scope.summary = '';
            $scope.body = '';
            $scope.link = '';

        };

        $scope.incrementUpvotes = function(post) {
            posts.upvote(post);
        };

        $scope.incrementDownvotes = function(post) {
            posts.downvote(post);
        };


    }
]);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
        postPromise: ['posts', function(posts){
          return posts.getAll();
        }]
      }
    })
    .state('posts', {
      url: '/posts/{id}',
      templateUrl: '/posts.html',
      controller: 'PostsCtrl',
      resolve: {
        post: ['$stateParams', 'posts', function($stateParams, posts) {
          return posts.get($stateParams.id);
        }]
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: '/login.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
    })
    .state('register', {
      url: '/register',
      templateUrl: '/register.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
    }).state('addnewpost', {
      url: '/addnewpost',
      templateUrl: '/addnewpost.html',
      controller: 'MainCtrl',
      onEnter: ['$state', 'auth', function($state, auth) {
          if (!auth.isLoggedIn()) {
            $state.go('login');
          }
      }]
    });

  $urlRouterProvider.otherwise('home');
}]);

app.controller('PostsCtrl', [
  '$scope',
  'posts',
  'post',
  'auth',
  function($scope, posts, post, auth){
    $scope.post = post;
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.addComment = function(){
      if($scope.body === ''){
        return;
      }
      posts.addComment(post._id, {
        body: $scope.body,
        date: new Date()
      }).success(function(comment) {
        $scope.post.comments.push(comment);
      });
      $scope.body = '';
    };

    $scope.hasLink = function(){
      if(angular.isUndefined(post.link)){
        return false;
      }
      return true;
    };

    $scope.hasComments = function(){
      if(post.comments.length === 0){
        return false;
      }
      return true;
    };

    $scope.incrementUpvotes = function(comment){
      posts.upvoteComment(post, comment);
    };

    $scope.incrementDownvotes = function(comment){
      posts.downvoteComment(post, comment);
    };

  }
]);

app.controller('AuthCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
  $scope.user = {};

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logOut = function(){
    auth.logOut($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
}]);

app.controller('NavCtrl', [
  '$scope',
  'auth',
  function($scope, auth){
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.logOut = auth.logOut;
}]);
app.directive("registerdirective", function() {
    return {
        restrict : "E",
        template : '<div class="wrapper"> <div ng-show="error.message" class="alert alert-danger alert-custom" role="alert">{{error.message}}</div>      <form ng-submit="register()" class="form-signin">          <h2 class="form-signin-heading text-center">Register</h2>        <input type="text" class="form-control form-login" name="username" placeholder="Username" required                 ng-model="user.username"/>    <input type="email" class="form-control form-login" name="emailadres" placeholder="Email Address" required             autofocus ng-model="user.emailadres"/>    <input type="password" class="form-control form-login" name="password" placeholder="Password" required             ng-model="user.password"/><button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>  </form></div></div>'
    };
});
app.directive("logindirective", function() {
    return {
      restrict : "E",
      template : '<div class="wrapper">        <div ng-show="error.message" class="alert alert-danger alert-custom text-center" role="alert">{{error.message}}</div>        <form ng-submit="logIn()" class="form-signin">            <h2 class="form-signin-heading text-center">Login</h2>            <input type="text" class="form-control form-login" name="username" placeholder="Username" required               autofocus ng-model="user.username"/>  <input type="password" class="form-control form-login" name="password" placeholder="Password" required         ng-model="user.password"/><button class="btn btn-lg btn-primary btn-block" type="submit">Login</button>    </form></div>'
    };
});

$(document).ready(function(){
  // Add smooth scrolling to all links
  $("a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){

        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
});
//<div class="wrapper"> <div ng-show="error.message" class="alert alert-danger alert-custom" role="alert">{{error.message}}</div>      <form ng-submit="register()" class="form-signin">          <h2 class="form-signin-heading text-center">Register</h2>        <input type="text" class="form-control form-login" name="username" placeholder="Username" required                 ng-model="user.username"/>    <input type="email" class="form-control form-login" name="emailadres" placeholder="Email Address" required             autofocus ng-model="user.emailadres"/>    <input type="password" class="form-control form-login" name="password" placeholder="Password" required             ng-model="user.password"/><button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>  </form></div>'
