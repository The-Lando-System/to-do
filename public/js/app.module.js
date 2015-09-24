var myApp = angular.module('myApp', [
	'ngCookies',
	'angular-jwt',
	'ngRoute',
	'ui.router'
])

.config(['$urlRouterProvider','$stateProvider', function($urlRouterProvider,$stateProvider) {
	$urlRouterProvider
	.otherwise('/');

	$stateProvider
	.state('login', {
		url: '/login',
		templateUrl: '/login',
		controller: 'mainController'
	})
	.state('to-do-list', {
		url: '/to-do-list',
		templateUrl: '/to-do-list',
		controller: 'mainController'
	});

}]);