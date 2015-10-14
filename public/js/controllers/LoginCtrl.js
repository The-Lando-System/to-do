myApp.controller('loginController', function($scope,$location,jwtHelper,AuthService) {
	$scope.authFail = false;

	$scope.login = function(formIsValid){
		if (formIsValid){
			if (AuthService.login($scope.creds)){
				$scope.userSession = AuthService.startUserSession();
			} else {
				$scope.authFail = true;
				$scope.errorMessage = data.message;
			}
		}
	};

	angular.element(document).ready(function () {
		$scope.userSession = AuthService.startUserSession();
		if ($scope.userSession.user) {
			$location.path('user-lists');
		}
	});
});