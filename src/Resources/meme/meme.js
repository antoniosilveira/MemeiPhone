var meme = {};

(function(){
	
	// application-global variables
	meme.app = {};
	
})();

Ti.include(
	'/meme/config/config.js',
	'/meme/api/api.js',
	'/meme/auth/auth.js',
	'/meme/util/util.js',
	'/meme/ui/ui.js'
);