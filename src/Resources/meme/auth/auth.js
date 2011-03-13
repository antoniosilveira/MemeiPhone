(function(){
	
	meme.auth = {};
	
	meme.auth.attachLogin = function(buttonClick, callback) {
		meme.auth.oadapter.attachLogin(buttonClick, callback);
	};

})();

Ti.include(
	'/meme/auth/sha1.js',
	'/meme/auth/oauth.js',
	'/meme/auth/oadapter.js'
);