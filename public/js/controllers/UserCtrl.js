myApp.controller('userController', function($scope,$location,$stateParams,jwtHelper,AuthService,UserFactory) {

	var userId = $stateParams.userId || false;
	$scope.editedUser = {}; 

	var getUser = function() {
		UserFactory.get($scope.userSession.token)
		.success(function(users){
			for (var i=0;i<users.length;i++){
				if (users[i]._id === userId){
					$scope.editedUser = users[i];
				}
			}
		})
		.error(function(data){
			console.log('Error: ' + data);
		});
	};

	$scope.updateUser = function(){
		UserFactory.edit($scope.userSession.token,$scope.editedUser._id,$scope.editedUser)
		.success(function(data){
			alert(data.message);
		})
		.error(function(data){
			console.log('Error: ' + data);
		});
	};

	$scope.createUser = function(){
		UserFactory.create($scope.userSession.token,$scope.editedUser)
		.success(function(data){
			alert(data.message);
			$location.path('user-management');
		})
		.error(function(data){
			console.log('Error: ' + data);
		});
	};

	angular.element(document).ready(function () {
		$scope.userSession = AuthService.startUserSession();
		if ($scope.userSession.user) {
			getUser();
		} else {
			//$location.path('login');
		}
		$scope.isCreate = userId ? false : true;
	});
});