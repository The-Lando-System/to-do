myApp.controller('loginController', function($scope,$http,$cookies,$location,jwtHelper,AuthService) {
	$scope.authFail = false;

	$scope.login = function(formIsValid){
		if (formIsValid){	
			$http.post('/authenticate',$scope.creds)
			.success(function(data){
				if (data.success){
					$cookies.put('token',data.token);
					$scope.userSession = AuthService.startUserSession();
					$scope.user = $scope.userSession.user;
					$scope.userLoggedIn = $scope.user ? true : false;
					$location.path('user-lists');
				} else {
					$scope.authFail = true;
					$scope.errorMessage = data.message;
				}
			})
			.error(function(data){
				console.log('Error: ' + data);
			});
		}
	};

	// TO-DO: Make this a service or something
	// var startUserSession = function() {
	// 	$scope.userToken = $cookies.get('token');

	// 	if ($scope.userToken) {
	// 		$scope.user = jwtHelper.decodeToken($scope.userToken);
	// 		$scope.userLoggedIn = $scope.userToken ? true : false;
	// 	}
	// };

	angular.element(document).ready(function () {
		$scope.userSession = AuthService.startUserSession();
		$scope.user = $scope.userSession.user;
		$scope.userLoggedIn = $scope.user ? true : false;
	});
});