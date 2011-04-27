var meme = {};

(function(){
	
	// application-global variables
	meme.app = {};
	
	meme.app.lang = function() {
		var lang = Ti.Locale.currentLanguage;
		if (/(en|es|id|pt|zh-Hant)/.test(lang)) {
			return lang;
		}
		return 'en';
	};
	
	meme.app.userInfo = function() {
		if (meme.auth.oadapter && meme.auth.oadapter.isLoggedIn()) {
			return meme.api.userInfo(meme.auth.oadapter.getUserGuid());
		}
	};
	
})();

Ti.include(
	'/meme/config/config.js',
	'/meme/analytics/analytics.js',
	'/meme/api/api.js',
	'/meme/auth/auth.js',
	'/meme/util/util.js',
	'/meme/ui/ui.js',
	'/test/enabled.js',
	'/test/tests.js'
);