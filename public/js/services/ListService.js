myApp.factory('ListService', function($http) {
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
        }
    }
});