var app = angular.module('app', ['ngRoute', 'ngCookies','ui.router']);

app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('login', {
            url:'/',
            templateUrl: 'login/login.view.html',
            controller:'loginCtrl'
        })
        /*.state('home.list', {
            url:'/list',
            templateUrl: 'home.list.html',
            controller: function($scope) {
                $scope.items = ['Item 1','Item 2','Item 3','Item 4']
            }
        })*/
        .state('register', {
            url:'/register',
            templateUrl: 'register/register.view.html',
            controller:'registerCtrl'
        })
        .state('home', {
            url:'/home',
            templateUrl: 'home/home.view.html',
            controller:'homeCtrl'
        })
        .state('home.static', {
            url:'/home/static',
            templateUrl: 'home/static.html',
            controller:'homeCtrl'
        })
        .state('home.table', {
            url:'/home/table',
            templateUrl: 'home/table.html',
            controller:'homeCtrl'
        })
        .state('home.wp', {
            url:'/home/wp',
            templateUrl: 'home/wp.html',
            controller:'homeCtrl'
        });
}]);
/*app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/home', {
            controller: 'loginCtrl',
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
        .when('/home/static', {
            controller: 'loginCtrl',
            templateUrl: 'home/static.html',
        })
        .when('/home/table', {
            controller: 'loginCtrl',
            templateUrl: 'home/table.html',
        })
        .when('/home/wp', {
            controller: 'loginCtrl',
            templateUrl: 'home/wp.html',
        })
        .otherwise({redirectTo: '/login'});


});*/

app.controller('loginCtrl', function ($scope,$http,$location,user,userInfo,$q) {

    $scope.login = function() {

        var username = $scope.username;
        var password = $scope.password;
        $scope.request1 = $http({
            url: 'http://localhost/WP-calculator/model/server.php',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'username='+username+'&password='+password
        });
        $scope.request2 = $http({
            url: 'http://127.0.0.1:5000/api',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            data: {username:username}
        });
        $q.all([$scope.request1,$scope.request2]).then(function (response) {
            console.log(response[0].data);
            console.log(response[1].data);
            user.saveData(response[0].data);
            userInfo.saveData(response[1].data);
            $location.path('/home');

        });
    }


});
app.controller('registerCtrl',function ($scope,$http,$location,user,userInfo,$q) {

    $scope.addCustomer = function() {
        var email = $scope.email;
        var username = $scope.username;
        var password = $scope.password;
        var reenterpassword = $scope.reenterpassword;
        console.log(email);
        $http({
            url: 'http://localhost/WP-calculator/model/register.php',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'username='+username+'&password='+password+'&email='+email
        }).then(function (response) {
            console.log(response.data.status);
            if(response.data.status == 'done') {
                $location.path('/');
            }else{
                alert("error");
            }
        }).catch(function (response) {
            console.log(response);
        })



    }
});

app.controller('homeCtrl', function($scope, user, userInfo, $http,$q) {
    $scope.user = user.getName();
    $scope.level = userInfo.getLevel();
    $scope.id = userInfo.getID();

    $scope.getData = function () {
        $http({
            url: 'http://127.0.0.1:5000/totalWinRate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            data: {username:$scope.user}
        }).then(function (response) {
            $scope.winRate = Math.round(response.data*100)/100;
        })
    }
    $scope.getStatic = function() {
        $.ajaxSetup({
            async: false
        });
        $http({
            url: 'http://127.0.0.1:5000/top20Played',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            data: {username:$scope.user}
        }).then(function (response) {
            console.log(response.data);

            var topchamp = response.data;

                var champdata;
                var names = [];
                var data = [];
                var title = [];

                $.getJSON('home/champions.json')
                    .then(function (champ) {

                        champdata = champ;
                        console.log(champdata);

                        // getOhject function credit by https://gist.github.com/iwek/3924925
                        // get the champions names and title from aonther json file.
                        function getObject(theObject, id) {
                            var result = null;
                            if (theObject instanceof Array) {
                                for (var i = 0; i < theObject.length; i++) {
                                    result = getObject(theObject[i], key);
                                    if (result) {
                                        break;
                                    }
                                }
                            }
                            else {
                                for (var prop in theObject) {
                                    //console.log(prop + ': ' + theObject[prop]);
                                    if (prop == 'id') {
                                        if (theObject[prop] == key) {
                                            return theObject;
                                        }
                                    }
                                    if (theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
                                        result = getObject(theObject[prop], key);
                                        if (result) {
                                            break;
                                        }
                                    }
                                }
                            }
                            return result;
                        }

                        for (var i in topchamp) {
                            var obj = new Object()
                            var key = topchamp[i][0];
                            obj = getObject(champdata, key.toString());
                            console.log(obj);
                            names[i] = obj.key;
                            title[i] = obj.title;
                        }
                        ;
                        //create objects with arrtributes for the data displaying.
                        for (var i in topchamp) {
                            var games = topchamp[i][1];
                            //if (checkedValue == 2) var games = topchamp[i].winRate * 100;
                            var states = "Title:" + title[i].toString();
                            var name = names[i];
                            data[i] = ({
                                cat: 'Cate',
                                name: name,
                                value: games,
                                icon: 'home/img/' + name + '.png',
                                desc: states
                            });
                        }
                        ;
                        console.log(data);
                        // generate chart with data.
                        updata(data);
                    })
                    .fail(function () {

                        console.log("error1");
                    });//give error if it fails to load the file.

            function updata(data) {
                //font-family="sans-serif" font-size="10" text-anchor="middle"
                var svg = d3.select('svg');
                svg.remove();
                svg = d3.selectAll("#container-fluid").append("svg");
                svg.attr("cx", 40)
                    .attr("width", "700")
                    .attr("height", "500")
                    .attr("font-family", "sans=serif")
                    .attr("font-size", "10")
                    .attr("background","#000000")
                    .attr("text-anchor", "middle");
                //var width = document.body.clientWidth; // get width in pixels
                var width = svg.attr('width');
                var height = +svg.attr('height');
                var centerX = width * 0.5;
                var centerY = height * 0.5;
                var strength = 0.05;
                var focusedNode;
                var format = d3.format(',d');
                var scaleColor = d3.scaleOrdinal(d3.schemeCategory20);
                // use pack to calculate radius of the circle
                var pack = d3.pack()
                    .size([width, height])
                    .padding(1.5);
                var forceCollide = d3.forceCollide(d => d.r + 1);
                // use the force
                var simulation = d3.forceSimulation()
                // .force('link', d3.forceLink().id(d => d.id))
                    .force('charge', d3.forceManyBody())
                    .force('collide', forceCollide)
                    // .force('center', d3.forceCenter(centerX, centerY))
                    .force('x', d3.forceX(centerX).strength(strength))
                    .force('y', d3.forceY(centerY).strength(strength));
                // reduce number of circles on mobile screen due to slow computation
                if ('matchMedia' in window && window.matchMedia('(max-device-width: 767px)').matches) {
                    data = data.filter(el => {
                            return el.value >= 50;
                });
                }
                var root = d3.hierarchy({children: data})
                        .sum(d => d.value);
                // we use pack() to automatically calculate radius conveniently only
                // and get only the leaves
                var nodes = pack(root).leaves().map(node => {
                        console.log('node:', node.x, (node.x - centerX) * 2);
                const data = node.data;
                console.log(data);
                return {
                    x: centerX + (node.x - centerX) * 3, // magnify start position to have transition to center movement
                    y: centerY + (node.y - centerY) * 3,
                    r: 0, // for tweening
                    radius: node.r, //original radius
                    id: data.cat + '.' + (data.name.replace(/\s/g, '-')),
                    cat: data.cat,
                    name: data.name,
                    value: data.value,
                    icon: data.icon,
                    desc: data.desc,
                }
            });
                simulation.nodes(nodes).on('tick', ticked);
                svg.style('background-color', '#eee');
                var node = svg.selectAll('.node')
                    .data(nodes)
                    .enter().append('g')
                    .attr('class', 'node')
                    .call(d3.drag()
                            .on('start', (d) => {
                            if (!d3.event.active) simulation.alphaTarget(0.2).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on('drag', (d) => {
                    d.fx = d3.event.x;
                d.fy = d3.event.y;
            })
            .on('end', (d) => {
                    if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }));
                console.log(node);
                node.append('circle')
                    .attr('id', d => d.id)
            .attr('r', 0)
                    .style('fill', d => scaleColor(d.cat))
            .transition().duration(2000).ease(d3.easeElasticOut)
                    .tween('circleIn', (d) => {
                    var i = d3.interpolateNumber(0, d.radius);
                return (t) => {
                    d.r = i(t);
                    simulation.force('collide', forceCollide);
                }
            })
                node.append('clipPath')
                    .attr('id', d => `clip-${d.id}`)
            .append('use')
                    .attr('xlink:href', d => `#${d.id}`);
                // display text as circle icon
                node.filter(d => !String(d.icon).includes('img/'))
            .append('text')
                    .classed('node-icon', true)
                    .attr('clip-path', d => `url(#clip-${d.id})`)
            .selectAll('tspan')
                    .data(d => d.icon.split(';'))
            .enter()
                    .append('tspan')
                    .attr('x', 0)
                    .attr('y', (d, i, nodes) => (13 + (i - nodes.length / 2 - 0.5) * 10))
            .text(name => name);
                // display image as circle icon
                node.filter(d => String(d.icon).includes('img/'))
            .append('image')
                    .classed('node-icon', true)
                    .attr('clip-path', d => `url(#clip-${d.id})`)
            .attr('xlink:href', d => d.icon)
            .attr('x', d => -d.radius * 1.1)
            .attr('y', d => -d.radius * 1.1)
            .attr('height', d => d.radius * 2 * 1.2)
            .attr('width', d => d.radius * 2 * 1.2)
                node.append('title')
                    .text(d => (d.cat + '::' + d.name + '\n' + d.value));
                //node.exit().remove();
                // var legendOrdinal = d3.legendColor()
                //     .scale(scaleColor)
                //     .shape('circle');
                // var legend = svg.append('g')
                //     .classed('legend-color', true)
                //     .attr('text-anchor', 'start')
                //     .attr('transform', 'translate(20,30)')
                //     .style('font-size', '12px')
                //     .call(legendOrdinal);
                // var legendSize = d3.legendSize()
                //     .scale(sizeScale)
                //     .shape('circle')
                //     .shapePadding(10)
                //     .labelAlign('end');
                var legend2 = svg.append('g')
                    .classed('legend-size', true)
                    .attr('text-anchor', 'start')
                    .attr('transform', 'translate(150, 25)')
                    .style('font-size', '12px')
                    .call(legendSize);
                var infoBox = node.append('foreignObject')
                    .classed('circle-overlay hidden', true)
                    .attr('x', -350 * 0.5 * 0.8)
                    .attr('y', -350 * 0.5 * 0.8)
                    .attr('height', 350 * 0.8)
                    .attr('width', 350 * 0.8)
                    .append('xhtml:div')
                    .classed('circle-overlay__inner', true);
                infoBox.append('h2')
                    .classed('circle-overlay__title', true)
                    .text(d => d.name);
                infoBox.append('p')
                    .classed('circle-overlay__body', true)
                    .html(d => d.desc);
                node.on('click', (currentNode) => {
                    d3.event.stopPropagation();
                console.log('currentNode', currentNode);
                var currentTarget = d3.event.currentTarget; // the <g> el
                if (currentNode === focusedNode) {
                    // no focusedNode or same focused node is clicked
                    return;
                }
                var lastNode = focusedNode;
                focusedNode = currentNode;
                simulation.alphaTarget(0.2).restart();
                // hide all circle-overlay
                d3.selectAll('.circle-overlay').classed('hidden', true);
                d3.selectAll('.node-icon').classed('node-icon--faded', false);
                // don't fix last node to center anymore
                if (lastNode) {
                    lastNode.fx = null;
                    lastNode.fy = null;
                    node.filter((d, i) => i === lastNode.index)
                .transition().duration(2000).ease(d3.easePolyOut)
                        .tween('circleOut', () => {
                        var irl = d3.interpolateNumber(lastNode.r, lastNode.radius);
                    return (t) => {
                        lastNode.r = irl(t);
                    }
                })
                .on('interrupt', () => {
                        lastNode.r = lastNode.radius;
                });
                }
                // if (!d3.event.active) simulation.alphaTarget(0.5).restart();
                d3.transition().duration(2000).ease(d3.easePolyOut)
                    .tween('moveIn', () => {
                    console.log('tweenMoveIn', currentNode);
                var ix = d3.interpolateNumber(currentNode.x, centerX);
                var iy = d3.interpolateNumber(currentNode.y, centerY);
                var ir = d3.interpolateNumber(currentNode.r, centerY * 0.5);
                return function (t) {
                    // console.log('i', ix(t), iy(t));
                    currentNode.fx = ix(t);
                    currentNode.fy = iy(t);
                    currentNode.r = ir(t);
                    simulation.force('collide', forceCollide);
                };
            })
            .on('end', () => {
                    simulation.alphaTarget(0);
                var $currentGroup = d3.select(currentTarget);
                $currentGroup.select('.circle-overlay')
                    .classed('hidden', false);
                $currentGroup.select('.node-icon')
                    .classed('node-icon--faded', true);
            })
            .on('interrupt', () => {
                    console.log('move interrupt', currentNode);
                currentNode.fx = null;
                currentNode.fy = null;
                simulation.alphaTarget(0);
            });
            });
                // blur
                d3.select(document).on('click', () => {
                    var target = d3.event.target;
                // check if click on document but not on the circle overlay
                if (!target.closest('#circle-overlay') && focusedNode) {
                    focusedNode.fx = null;
                    focusedNode.fy = null;
                    simulation.alphaTarget(0.2).restart();
                    d3.transition().duration(2000).ease(d3.easePolyOut)
                        .tween('moveOut', function () {
                            console.log('tweenMoveOut', focusedNode);
                            var ir = d3.interpolateNumber(focusedNode.r, focusedNode.radius);
                            return function (t) {
                                focusedNode.r = ir(t);
                                simulation.force('collide', forceCollide);
                            };
                        })
                        .on('end', () => {
                        focusedNode = null;
                    simulation.alphaTarget(0);
                })
                .on('interrupt', () => {
                        simulation.alphaTarget(0);
                });
                    // hide all circle-overlay
                    d3.selectAll('.circle-overlay').classed('hidden', true);
                    d3.selectAll('.node-icon').classed('node-icon--faded', false);
                }
            });
                function ticked() {
                    node
                        .attr('transform', d => `translate(${d.x},${d.y})`)
                .select('circle')
                        .attr('r', d => d.r);
                }
            };

        })





        // updata function credit by https://naustud.io/tech-stack


    }
    $scope.getMatches = function() {
        $scope.games = $http({
            url: 'http://127.0.0.1:5000/games',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            data: {username:$scope.user}
        })
        $scope.winLost = $http({
            url: 'http://127.0.0.1:5000/winLoss',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            data: {username:$scope.user}
        })
        $q.all([$scope.games,$scope.winLost]).then(function (response) {

                $scope.matches = response[0].data.matches;
                $scope.win = response[1].data.wins;
                $scope.loss = response[1].data.loss;

            });
    }
    $scope.calculate = function() {
        $scope.wp = 0.5;
        $http({
            url: 'http://127.0.0.1:5000/calculate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            data: {username:$scope.user}
        }).then(function (response) {
            console.log(response.data);
            $scope.wp = Math.round(response.data * 100);

        })
    }

});

app.service('userInfo', function () {
    var name;
    var level;
    var id;

    this.getName= function () {

        return name;
    };

    this.getID = function () {
        return id;
    };

    this.getLevel = function () {
        return level;
    };

    this.saveData = function(data) {
        name = data.name;
        id = data.accountId;
        level = data.summonerLevel;
        localStorage.setItem('userData', JSON.stringify({
            username: name,
            id: id,
            level: level
        }));
    };


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

