myApp.controller('userMgmtController', function($scope,$location,jwtHelper,AuthService,UserFactory) {

	var getUsers = function(){
		UserFactory.get($scope.userSession.token)
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
			UserFactory.delete($scope.userSession.token,user._id)
			.success(function(data){
				console.log(data);
				getUsers();
			})
			.error(function(data){
				console.log('Error: ' + data);
			});
		}
	};

	angular.element(document).ready(function () {
		$scope.userSession = AuthService.startUserSession();
		if ($scope.userSession.user) {
			getUsers();
		} else {
			$location.path('login');
		}
	});

});	