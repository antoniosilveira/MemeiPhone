(function(){
	
	meme.ui = {};
	
	meme.ui.alert = function(data) {
		var buttonNames = ['Ok', 'Cancel'];
		if (data.buttonNames) {
			buttonNames = data.buttonNames;
		}
		var alert = Titanium.UI.createAlertDialog({
			title: data.title,
			message: data.message,
			buttonNames: buttonNames
		});
		if (data.onClick) {
			alert.addEventListener('click', data.onClick);	
		}
		alert.show();
	};
	
	// must pass at least data.url, other parameters are optional
	meme.ui.openLinkOnSafari = function(data) {
		if (!data.title) {
			data.title = 'Open link';
		}
		if (!data.message) {
			data.message = 'We will open a page on Safari';
		}
		data.onClick = function(e) {
			if (e.index == 0){
				Ti.Platform.openURL(data.url);
			}
		};
		meme.ui.alert(data);
	};
	
	meme.ui.createAccount = function() {
		meme.ui.openLinkOnSafari({
			title: 'Create your account',
			message: 'We will now open the Sign Up page on Safari',
			url: 'http://meme.yahoo.com/confirm'
		});
	};
	
})();

Ti.include(
	'/meme/ui/flashlight.js',
	'/meme/ui/home.js',
	'/meme/ui/post.js'
);