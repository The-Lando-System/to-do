myApp.controller('listController', function($scope,$http,$cookies,$location,jwtHelper,ToDoFactory) {
	$scope.formData = {};

	var getToDos = function(){
		ToDoFactory.get($scope.user.username,$scope.userToken)
		.success(function(data){
			$scope.todos = data;
		})
		.error(function(data){
			console.log('Error: ' + data);
		});
	};

	$scope.createTodo = function(){
		ToDoFactory.create($scope.user.username,$scope.userToken,{
			text: $scope.formData.text,
			username: $scope.user.username
		})
		.success(function(data){
			$scope.formData = {};
			getToDos();
		})
		.error(function(data){
			console.log('Error: ' + data);
		});
	};

	$scope.deleteToDo = function(id){
		ToDoFactory.delete($scope.user.username,$scope.userToken,id)
		.success(function(data){
			$scope.todos = data;
			console.log(data);
			getToDos();
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
			getToDos();
		}
	};

	angular.element(document).ready(function () {
		startUserSession();
	});
});