(function(){
	
	meme.ui = {};
	
	meme.ui.openLinkOnSafari = function(data) {
		var alert = Titanium.UI.createAlertDialog({
			title: data.title,
			message: data.message,
			buttonNames: [ 'Ok', 'Cancel' ],
			cancel: 1
		});
		alert.addEventListener('click', function(e) {
			if (e.index == 0){
				Ti.Platform.openURL(data.url);
			}
		});
		alert.show();
	}
	
	meme.ui.createAccount = function() {
		meme.ui.openLinkOnSafari({
			title: 'Create your account',
			message: 'We will now open the Sign Up page on Safari',
			url: 'http://meme.yahoo.com/confirm'
		});
	};
	
	meme.ui.attachLogin = function(buttonClick, callback) {
		meme.auth.attachLogin(buttonClick, callback);
	};
	
})();

Ti.include(
	'/meme/ui/home.js',
	'/meme/ui/post.js'
);