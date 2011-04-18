(function(){
	
	meme.ui = {};
	
	// Options are:
	// {
	// 	title: 'Title',
	// 	message: 'Alert message',
	// 	buttonNames: ['There', 'Are', 'Optional']
	// }
	meme.ui.alert = function(options) {
		var buttonNames = [L('alert_btn_ok'), L('alert_btn_cancel')];
		if (options.buttonNames) {
			buttonNames = options.buttonNames;
		}
		var alert = Titanium.UI.createAlertDialog({
			title: options.title,
			message: options.message,
			buttonNames: buttonNames
		});
		if (options.onClick) {
			alert.addEventListener('click', options.onClick);	
		}
		alert.show();
	};
	
	// Must pass at least options.url, other parameters are optional
	meme.ui.openLinkOnSafari = function(options) {
		if (!options.title) {
			options.title = L('alert_openlink_title');
		}
		if (!options.message) {
			options.message = L('alert_openlink_message');
		}
		options.onClick = function(e) {
			if (e.index == 0){
				Ti.Platform.openURL(options.url);
			}
		};
		meme.ui.alert(options);
	};
	
	meme.ui.createAccount = function() {
		meme.ui.openLinkOnSafari({
			title: L('home_try_it_now_alert_title'),
			message: L('home_try_it_now_alert_message'),
			url: 'http://meme.yahoo.com/confirm'
		});
	};
	
})();

Ti.include(
	'/meme/ui/inactivity_observer.js',
	'/meme/ui/about/about.js',
	'/meme/ui/flashlight/flashlight.js',
	'/meme/ui/home/home.js',
	'/meme/ui/post/post.js'
);