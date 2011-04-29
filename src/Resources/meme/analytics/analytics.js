(function(){
	
	meme.analytics = {
		APP_STARTED: 2,
		NEW_POST_OPEN: 3,
		NEW_POST_PUBLISHED: 4,
		REPOST: 5,
		ADD_REPOST_COMMENT: 6,
		OPEN_SAFARI_CREATE_ACCOUNT: 7,
		OPEN_SAFARI: 8,
		PERMALINK_VIEW: 9,
		FLASHLIGHT_SEARCH: 10,
		PHOTO_POST: 11,
		TEXT_POST: 12,
		VIDEO_POST: 13,
		SHARE_TWITTER_IPAD: 14,
		SHARE_MAIL: 15,
		COPY_LINK: 16,
		DELETE_POST: 17,
		REPORT_ABUSE: 18,
		SIGN_IN: 19,
		YQL_ERROR: 20,
		EMAIL_OPEN: 21,
		FEEDBACK_MAIL_SENT: 22,
		BROWSER_VIEW: 23,
		ADD_COMMENT: 24,
		COMMENTS_PERMALINK_OPEN: 25
	};
	
	var getRequestUrl = function(actionId) {
		var params = {
			a: '1000671789962',
			cf8: Ti.Platform.osname, // ipad, iphone, android
			cf9: Ti.Platform.version, // 4.2, 4.3
			cf10: Ti.Platform.model, // Simulator, etc (?)
			cf11: Ti.App.version,
			x: actionId
		};
		
		var url = 'http://a.analytics.yahoo.com/p.pl?';
		
		for (key in params) {
			url += key + '=' + params[key] + '&';
		}
		
		return url;
	};

	meme.analytics.record = function(actionId) {
		// do not count request when in development mode
		if (Ti.Platform.model == 'Simulator') {
			return;
		}
		
		var url = getRequestUrl(actionId);
		var xhr = Titanium.Network.createHTTPClient();
		
		xhr.setTimeout(15000); // timeout is 15 seconds

	    xhr.onerror = function(e) {
	        Ti.API.error('YWA error: ' + e.error);
	    };

	    xhr.onload = function(e) {
			Ti.API.debug('YWA request, action [' + actionId + '], url [' + url + ']');
	    };

	    xhr.open('GET', url);
		xhr.send();
	};

})();