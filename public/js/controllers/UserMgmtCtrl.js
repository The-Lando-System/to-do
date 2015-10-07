myApp.controller('userMgmtController', function($scope,$http,$cookies,$location,jwtHelper,UserFactory) {

	var getUsers = function(){
		UserFactory.get($scope.userToken)
		.success(function(data){
			$scope.users = data;
		})
		.error(function(data){
			console.log('Error: ' + data);
		});
	};

	$scope.deleteUser = function(user){
		var confirmDelete = confirm('Are you sure you want to delete \'' + user.username + '\'?');

		if (confirmDelete){
			UserFactory.delete($scope.userToken,user._id)
			.success(function(data){
				console.log(data);
				getUsers();
			})
			.error(function(data){
				console.log('Error: ' + data);
			});
		}
	};

	// TO-DO: Make this a service or something
	var startUserSession = function() {
		$scope.userToken = $cookies.get('token');

		if ($scope.userToken) {
			$scope.user = jwtHelper.decodeToken($scope.userToken);
			$scope.userLoggedIn = $scope.userToken ? true : false;
			getUsers();
		} else {
			$location.path('login');
		}
	};

	angular.element(document).ready(function () {
		startUserSession();
	});

});	