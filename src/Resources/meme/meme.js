var meme = {};

(function(){
	
	// application-global variables
	meme.app = {};
	
	var userInfo = null;
	
	meme.app.userInfo = function() {
		if (!userInfo && meme.auth.oadapter && meme.auth.oadapter.isLoggedIn()) {
			userInfo = meme.api.userInfo('me', 35, 35);
		}
		return userInfo;
	};
	
})();

Ti.include(
	'/meme/config/config.js',
	'/meme/api/api.js',
	'/meme/auth/auth.js',
	'/meme/util/util.js',
	'/meme/ui/ui.js',
	'/test/enabled.js',
	'/test/tests.js'
);