var myApp = angular.module('myApp', [
	'ngCookies',
	'angular-jwt',
	'ngRoute',
	'ui.router'
])

.config(['$urlRouterProvider','$stateProvider', function($urlRouterProvider,$stateProvider) {
	$urlRouterProvider
	.otherwise('/login');

	$stateProvider
	.state('login', {
		url: '/login',
		templateUrl: '/login',
		controller: 'loginController'
	})
	.state('lists', {
		url: '/user-lists',
		templateUrl: '/user-lists',
		controller: 'userListsController'
	})
	.state('to-do-list', {
		url: '/to-do-list/:listId',
		templateUrl: '/to-do-list',
		controller: 'listController'
	})
	.state('users', {
		url: '/user-management',
		templateUrl: '/user-management',
		controller: 'userMgmtController'
	})
	.state('user-page', {
		url: '/user-management/:userId',
		templateUrl: '/user-page',
		controller: 'userController'
	});

}]);