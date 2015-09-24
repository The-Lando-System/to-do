myApp.controller('mainController', function($scope,$http,$cookies,$location,jwtHelper,ToDoService) {
	$scope.formData = {};

	$scope.createTodo = function(){
		ToDoService.create($scope.user.username,$scope.userToken,{
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
		ToDoService.delete($scope.user.username,$scope.userToken,id)
		.success(function(data){
			$scope.todos = data;
			console.log(data);
			getToDos();
		})
		.error(function(data){
			console.log('Error: ' + data);
		});
	};

	$scope.login = function(){
		$http.post('/authenticate',$scope.creds)
		.success(function(data){
			$cookies.put('token',data.token);
			startUserSession();
			$location.path('to-do-list');
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

	var startUserSession = function() {
		$scope.userToken = $cookies.get('token');

		if ($scope.userToken) {
			$scope.user = jwtHelper.decodeToken($scope.userToken);
			$scope.userLoggedIn = $scope.userToken ? true : false;
			getToDos();
		}
	};

	var getToDos = function(){
		ToDoService.get($scope.user.username,$scope.userToken)
		.success(function(data){
			$scope.todos = data;
		})
		.error(function(data){
			console.log('Error: ' + data);
		});
	};

	angular.element(document).ready(function () {
		startUserSession();
	});

});