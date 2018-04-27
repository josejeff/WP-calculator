var app = angular.module('app', ['ngRoute', 'ngCookies']);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/home', {
            controller: 'dashboardCtrl',
            templateUrl: 'home/home.view.html',
        })

        .when('/login', {
            controller: 'loginCtrl',
            templateUrl: 'login/login.view.html',

        })

        .when('/register', {
            controller: 'loginCtrl',
            templateUrl: 'register/register.view.html',
        })

        .otherwise({redirectTo: '/login'});
});
var userLevel;
app.controller('loginCtrl', function ($scope,$http,$location,user,userInfo) {
    $scope.login = function() {
        var username = $scope.username;
        var password = $scope.password;
        $http({
            url: 'http://localhost/WP-calculator/model/server.php',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'username='+username+'&password='+password
        }).then(function(response) {
            if(response.data.status == 'loggedin') {
                user.saveData(response.data);
                $location.path('/home');
            } else {
                alert('invalid login');
            }
        })

        $http({
            url: 'http://127.0.0.1:5000/api',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            data: {username:username}
        }).then(function(response) {
            console.log(response.data)
            userInfo.addUser(response.data);
        })

    }

        /*$scope.getCustomer = function () {
            $http.post("./model/getCustomer.php", {'uName': $cookies.get('username')}).success(function (data) {
                $scope.customer = data;

            });
        }*/
});
app.controller('dashboardCtrl', function($scope, user,userInfo, $http) {
    $scope.user = user.getName();
    $scope.level = userInfo.getLevel();
    $scope.newPass = function() {
        var password = $scope.newpassword;
       /* $http({
            url: 'http://localhost/angularjs-mysql/updatePass.php',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'newPass='+password+'&id='+user.getID()
        }).then(function(response) {
            if(response.data.status == 'done') {
                alert('Password updated');
            } else {
                alert('CSRF maybe?');
            }
        })*/
    }
});

app.service('userInfo',function () {
    var userLevel;
    this.addUser = function (data) {
        userLevel = data.summonerLevel

    }
    this.getLevel = function () {
        return userLevel;
    }

})
app.service('user', function() {
    var username;
    var loggedin = false;
    var id;

    this.getName = function() {
        return username;
    };

    this.setID = function(userID) {
        id = userID;
    };
    this.getID = function() {
        return id;
    };

    this.isUserLoggedIn = function() {
        if(!!localStorage.getItem('login')) {
            loggedin = true;
            var data = JSON.parse(localStorage.getItem('login'));
            username = data.username;
            id = data.id;
        }
        return loggedin;
    };

    this.saveData = function(data) {
        username = data.user;
        id = data.id;
        loggedin = true;
        localStorage.setItem('login', JSON.stringify({
            username: username,
            id: id
        }));
    };

    this.clearData = function() {
        localStorage.removeItem('login');
        username = "";
        id = "";
        loggedin = false;
    }
})

