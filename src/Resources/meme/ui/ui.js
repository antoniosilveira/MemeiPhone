(function(){
	
	meme.ui = {};
	
	meme.ui.alert = function(data) {
		var alert = Titanium.UI.createAlertDialog({
			title: data.title,
			message: data.message,
			buttonNames: [ 'Ok', 'Cancel' ],
			cancel: 1
		});
		alert.addEventListener('click', data.onClick);
		alert.show();
	}
	
	meme.ui.openLinkOnSafari = function(data) {
		data.onClick = function(e) {
			if (e.index == 0){
				Ti.Platform.openURL(data.url);
			}
		}
		meme.ui.alert(data);
	}
	
	meme.ui.createAccount = function() {
		meme.ui.openLinkOnSafari({
			title: 'Create your account',
			message: 'We will now open the Sign Up page on Safari',
			url: 'http://meme.yahoo.com/confirm'
		});
	};
	
})();

Ti.include(
	'/meme/ui/home.js',
	'/meme/ui/post.js'
);