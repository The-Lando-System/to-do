myApp.controller('userListsController', function($scope,$http,$cookies,$location,jwtHelper,ListFactory,ListToDoFactory,ToDoFactory) {
	
	$scope.user = {};

	var getLists = function(){
		ListFactory.get($scope.user.username,$scope.userToken)
		.success(function(data){
			$scope.lists = data;
		})
		.error(function(data){
			console.log('Error: ' + data);
		});
	};

	$scope.createList = function(){
		ListFactory.create($scope.user.username,$scope.userToken,{
			name: $scope.newList.name,
			username: $scope.user.username
		})
		.success(function(data){
			$scope.newList = {};
			getLists();
			angular.element('#listInput').focus();
		})
		.error(function(data){
			console.log('Error: ' + data);
		});
	};

	$scope.deleteList = function(id){
		var wantToDelete = confirm('This will also delete all items in the list...\nAre you sure?');
		if (wantToDelete) {
			ListFactory.delete($scope.user.username,$scope.userToken,id)
			.success(function(data){

				// Delete all the to-do's in this list
				ListToDoFactory.get($scope.user.username,$scope.userToken,id)
				.success(function(todos){
					for (var i=0;i<todos.length;i++){
						ToDoFactory.delete($scope.user.username,$scope.userToken,todos[i]._id)
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
			getLists();
		}
	};

	angular.element(document).ready(function () {
		startUserSession();
	});
});