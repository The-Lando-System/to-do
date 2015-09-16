myApp.controller('mainController', function($scope,$http,ToDoService) {
	$scope.formData = {};

	ToDoService.get()
	.success(function(data){
		$scope.todos = data;
		console.log(data);
	})
	.error(function(data){
		console.log('Error: ' + data);
	});

	$scope.createTodo = function(){
		ToDoService.create($scope.formData)
		.success(function(data){
			$scope.formData = {};
			$scope.todos = data;
			console.log(data);
		})
		.error(function(data){
			console.log('Error: ' + data);
		});
	};

	$scope.deleteToDo = function(id){
		ToDoService.delete(id)
		.success(function(data){
			$scope.todos = data;
			console.log(data);
		})
		.error(function(data){
			console.log('Error: ' + data);
		});
	};

});