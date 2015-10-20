myApp.factory('ToDoFactory', function($http) {
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
        },
        edit : function(username,token,editedTodo) {
            return $http.put('/user/' + username + '/todos/' + editedTodo._id, editedTodo, {
                headers: { 'x-access-token': token }
            });
        }
    }
});
myApp.factory('ListFactory', function($http) {
    return {
        get : function(username,token) {
            return $http.get('/user/' + username + '/lists/', {
                headers: { 'x-access-token': token }
            });
        },
        create : function(username,token,newList) {
            return $http.post('/user/' + username + '/lists/', newList, {
                headers: { 'x-access-token': token }
            });
        },
        delete : function(username,token,id) {
            return $http.delete('/user/' + username + '/lists/' + id, {
                headers: { 'x-access-token': token }
            });
        },
        edit : function(username,token,id,newList) {
            return $http.put('/user/' + username + '/lists/' + id, newList, {
                headers: { 'x-access-token': token }
            });
        }
    }
});
myApp.factory('ListToDoFactory', function($http) {
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