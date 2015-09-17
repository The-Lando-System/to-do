myApp.factory('ToDoService', function($http) {
	return {
        get : function(username,token) {
            return $http.get('/user/todos/' + username, {
            	headers: { 'x-access-token': token }
            });
        },
        create : function(username,token,newTodo) {
            return $http.post('/user/todos/' + username, newTodo, {
    			headers: { 'x-access-token': token }
    		});
        },
        delete : function(username,token,id) {
            return $http.delete('/user/todos/' + username + '/' + id, {
            	headers: { 'x-access-token': token }
            });
        }
    }
});