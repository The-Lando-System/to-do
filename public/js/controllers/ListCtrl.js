myApp.controller('listController', function($scope,$http,$cookies,$location,$stateParams,jwtHelper,ToDoFactory,ListToDoFactory,ListFactory) {
	$scope.formData = {};
	$scope.listId = $stateParams.listId;

	var getToDos = function(){
		ListToDoFactory.get($scope.user.username,$scope.userToken,$scope.listId)
		.success(function(data){
			$scope.todos = data;
		})
		.error(function(data){
			console.log('Error: ' + data);
		});
	};

	var getListData = function(){
		ListFactory.get($scope.user.username,$scope.userToken)
		.success(function(data){
			for (var i=0;i<data.length;i++){
				if (data[i]._id === $scope.listId) {
					$scope.list = data[i];
					break;
				}
			}
		});
	};

	$scope.createTodo = function(){
		ListToDoFactory.create($scope.user.username,$scope.userToken,$scope.listId,{
			text: $scope.formData.text,
			username: $scope.user.username
		})
		.success(function(data){
			$scope.formData = {};
			getToDos();
			angular.element('#toDoInput').focus();
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

	// TO-DO: Make this a service or something
	var startUserSession = function() {
		$scope.userToken = $cookies.get('token');

		if ($scope.userToken) {
			$scope.user = jwtHelper.decodeToken($scope.userToken);
			$scope.userLoggedIn = $scope.userToken ? true : false;
			getToDos();
			getListData();
		}
	};

	angular.element(document).ready(function () {
		startUserSession();
	});
});