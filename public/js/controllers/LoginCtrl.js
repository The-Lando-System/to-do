myApp.controller('loginController', function($scope,$http,$cookies,$location,jwtHelper) {
	$scope.login = function(){
		$http.post('/authenticate',$scope.creds)
		.success(function(data){
			$cookies.put('token',data.token);
			startUserSession();
			$location.path('user-lists');
		})
		.error(function(data){
			console.log('Error: ' + data);
		});
	};

	// TO-DO: Make this a service or something
	var startUserSession = function() {
		$scope.userToken = $cookies.get('token');

		if ($scope.userToken) {
			$scope.user = jwtHelper.decodeToken($scope.userToken);
			$scope.userLoggedIn = $scope.userToken ? true : false;
		}
	};

	angular.element(document).ready(function () {
		startUserSession();
	});
});