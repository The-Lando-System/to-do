myApp.factory('ToDoService', function($http) {
	return {
        get : function() {
            return $http.get('/api/todos');
        },
        create : function(newTodo) {
            return $http.post('/api/todos', newTodo);
        },
        delete : function(id) {
            return $http.delete('/api/todos/' + id);
        }
    }
});