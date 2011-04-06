var meme = {};

(function(){
	
	// application-global variables
	meme.app = {};
	
	meme.app.userInfo = function() {
		if (meme.auth.oadapter && meme.auth.oadapter.isLoggedIn()) {
			return meme.api.userInfo('me');
		}
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