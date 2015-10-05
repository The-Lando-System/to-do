myApp.controller('userController', function($scope,$http,$cookies,$location,$stateParams,jwtHelper,UserFactory) {

	var userId = $stateParams.userId || false;
	$scope.editedUser = {}; 

	var getUser = function() {
		UserFactory.get($scope.userToken)
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
		UserFactory.edit($scope.userToken,$scope.editedUser._id,$scope.editedUser)
		.success(function(data){
			alert(data.message);
		})
		.error(function(data){
			console.log('Error: ' + data);
		});
	};

	$scope.createUser = function(){
		UserFactory.create($scope.userToken,$scope.editedUser)
		.success(function(data){
			alert(data.message);
			$location.path('user-management');
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
			getUser();
		}
	};

	angular.element(document).ready(function () {
		startUserSession();
		$scope.isCreate = userId ? false : true;
	});
});