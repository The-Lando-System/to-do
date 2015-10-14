myApp.factory('AuthService', function($http,$cookies,$location,jwtHelper) {

	var authService = {};

	authService.startUserSession = function() {
		var token = $cookies.get('token') ? $cookies.get('token') : false;
		var user = token ? jwtHelper.decodeToken(token) : false;
		var isAdmin = false;
		if (user.role){
			isAdmin = user.role === 'admin' ? true : false;
		}
		return session = {
			token    : token,
			user     : user,
			isAdmin  : isAdmin
		};
	};

	authService.logout = function(){
		var confirmLogout = confirm('Are you sure you want to logout?');
		if (confirmLogout){
			$cookies.remove('token');
			$location.path('login');
		}
	};

	authService.login = function(creds){
		$http.post('/authenticate',creds)
		.success(function(data){
			if (data.success){
				$cookies.put('token',data.token);
				$location.path('user-lists');
				return true;
			} else {
				return false;
			}
		})
		.error(function(data){
			console.log('Error: ' + data);
		});
	};

	return authService;

});