myApp.controller('userListsController', function($scope,$location,AuthService,jwtHelper,ListFactory,ListToDoFactory,ToDoFactory) {
	
	var getLists = function(){
		ListFactory.get($scope.userSession.user.username,$scope.userSession.token)
		.success(function(data){
			$scope.lists = data;
		})
		.error(function(data){
			console.log('Error: ' + data);
		});
	};

	$scope.createList = function(){
		if (!$scope.newListName || $scope.newListName.trim() === ''){
			alert('Please name your list!');
		} else {
			ListFactory.create($scope.userSession.user.username,$scope.userSession.token,{
				name: $scope.newListName.trim(),
				username: $scope.userSession.user.username
			})
			.success(function(data){
				$scope.newListName = '';
				getLists();
				angular.element('#listInput').focus();
			})
			.error(function(data){
				console.log('Error: ' + data);
			});
		}
		
	};

	$scope.deleteList = function(id){
		var wantToDelete = confirm('This will also delete all items in the list...\nAre you sure?');
		if (wantToDelete) {
			ListFactory.delete($scope.userSession.user.username,$scope.userSession.token,id)
			.success(function(data){

				// Delete all the to-do's in this list
				ListToDoFactory.get($scope.userSession.user.username,$scope.userSession.token,id)
				.success(function(todos){
					for (var i=0;i<todos.length;i++){
						ToDoFactory.delete($scope.userSession.user.username,$scope.userSession.token,todos[i]._id)
						.success(function(data){
							console.log(data);
						})
						.error(function(data){
							console.log('Error: ' + data);
						})
					}
				})
				.error(function(data){
					console.log('Error: ' + data);
				})

				$scope.lists = data;
				console.log(data);
				getLists();
			})
			.error(function(data){
				console.log('Error: ' + data);
			});
		}
	};

	$scope.logout = function(){
		AuthService.logout();
	};

	angular.element(document).ready(function () {
		$scope.userSession = AuthService.startUserSession();
		if ($scope.userSession.user) {
			getLists();
		} else {
			$location.path('login');
		}
	});
});