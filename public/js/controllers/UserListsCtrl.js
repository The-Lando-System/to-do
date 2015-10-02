myApp.controller('userListsController', function($scope,$http,$cookies,$location,jwtHelper,ListFactory) {
	
	$scope.user = {};

	var getLists = function(){
		ListFactory.get($scope.user.username,$scope.userToken)
		.success(function(data){
			$scope.lists = data;
		})
		.error(function(data){
			console.log('Error: ' + data);
		});
	};

	$scope.logout = function(){
		$cookies.remove('token');
		$scope.userLoggedIn = false;
		$scope.creds = {};
		$location.path('login');
	};

	// TO-DO: Make this a service or something
	var startUserSession = function() {
		$scope.userToken = $cookies.get('token');

		if ($scope.userToken) {
			$scope.user = jwtHelper.decodeToken($scope.userToken);
			$scope.userLoggedIn = $scope.userToken ? true : false;
			getLists();
		}
	};

	angular.element(document).ready(function () {
		startUserSession();
	});
});