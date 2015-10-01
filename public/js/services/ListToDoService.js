myApp.factory('ListToDoService', function($http) {
	return {
        get : function(username,token,id) {
            return $http.get('/user/' + username + '/list/' + id + '/todos', {
            	headers: { 'x-access-token': token }
            });
        },
        create : function(username,token,id,newTodo) {
            return $http.post('/user/' + username + '/list/' + id + '/todos', newTodo, {
    			headers: { 'x-access-token': token }
    		});
        }
    }
});