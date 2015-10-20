myApp.controller('listController', function($scope,$location,$stateParams,jwtHelper,AuthService,ToDoFactory,ListToDoFactory,ListFactory) {
	$scope.formData = {};
	$scope.listId = $stateParams.listId;
	$scope.editingListName = false;

	var getToDos = function(){
		$scope.errorAttempt = false;
		ListToDoFactory.get($scope.userSession.user.username,$scope.userSession.token,$scope.listId)
		.success(function(data){
			$scope.todos = data;
		})
		.error(function(data){
			console.log('Error: ' + data);
			$location.path('user-lists');
		});
	};

	var getListData = function(){
		$scope.errorAttempt = false;
		ListFactory.get($scope.userSession.user.username,$scope.userSession.token)
		.success(function(data){
			for (var i=0;i<data.length;i++){
				if (data[i]._id === $scope.listId) {
					$scope.list = data[i];
					break;
				}
			}
		});
	};

	$scope.errorAttempt = false;
	$scope.createTodo = function(formIsValid){
		if (formIsValid){
			ListToDoFactory.create($scope.userSession.user.username,$scope.userSession.token,$scope.listId,{
				text: $scope.formData.text.trim(),
				username: $scope.userSession.user.username
			})
			.success(function(data){
				$scope.formData = {};
				getToDos();
				angular.element('#toDoInput').focus();
			})
			.error(function(data){
				console.log('Error: ' + data);
			});
		} else {
			$scope.errorAttempt = true;
		}
	};

	$scope.deleteToDo = function(id){
		$scope.errorAttempt = false;
		ToDoFactory.delete($scope.userSession.user.username,$scope.userSession.token,id)
		.success(function(data){
			$scope.todos = data;
			console.log(data);
			getToDos();
		})
		.error(function(data){
			console.log('Error: ' + data);
		});
	};

	$scope.beginEditToDo = function(id){
		$scope.toDoToEditId = id;
	};

	$scope.isBeingEdited = function(id,callback){
		$scope.editMode = $scope.toDoToEditId === id ? true : false;
		return $scope.editMode;
	};

	$scope.updateToDo = function(editedTodo){
		ToDoFactory.edit($scope.userSession.user.username,$scope.userSession.token,editedTodo)
		.success(function(data){
			console.log(data);
			$scope.toDoToEditId = '';
		})
		.error(function(data){
			console.log('Error: ' + data);
		});
	};

	$scope.beginEditListName = function(){
		$scope.editingListName = true;
	};

	$scope.updateListName = function(){
		ListFactory.edit($scope.userSession.user.username,$scope.userSession.token,$scope.listId,$scope.list)
		.success(function(data){
			console.log(data);
		})

		$scope.editingListName = false;
	};

	angular.element(document).ready(function () {
		$scope.userSession = AuthService.startUserSession();
		if ($scope.userSession.user) {
			getToDos();
			getListData();
		} else {
			$location.path('login');
		}
		$scope.errorAttempt = false;
	});
});