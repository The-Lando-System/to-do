myApp.factory('ToDoService', function($http) {
	return {
        get : function(username,token) {
            return $http.get('/user/' + username + '/todos/', {
            	headers: { 'x-access-token': token }
            });
        },
        create : function(username,token,newTodo) {
            return $http.post('/user/' + username + '/todos/', newTodo, {
    			headers: { 'x-access-token': token }
    		});
        },
        delete : function(username,token,id) {
            return $http.delete('/user/' + username + '/todos/' + id, {
            	headers: { 'x-access-token': token }
            });
        }
    }
});