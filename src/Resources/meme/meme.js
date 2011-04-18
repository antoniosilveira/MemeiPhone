var meme = {};

(function(){
	
	// application-global variables
	meme.app = {};
	
	meme.app.lang = function() {
		return Ti.Locale.currentLanguage;
	};
	
	meme.app.userInfo = function() {
		if (meme.auth.oadapter && meme.auth.oadapter.isLoggedIn()) {
			return meme.api.userInfo(meme.auth.oadapter.getUserGuid());
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