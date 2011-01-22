// =====================================
// = INTEGRATION WITH Y! WEB ANALYTICS =
// =====================================
var analytics = {
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
	BROWSER_VIEW: 23
};

var doYwaRequest = function(pAction) {
	
	var request_url = 'http://a.analytics.yahoo.com/p.pl?a=1000671789962&x=' + pAction;

	var xhr = Titanium.Network.createHTTPClient();

    xhr.onerror = function(e) {
        Ti.API.error("ERROR YWA: " + e.error);
    };

    xhr.onload = function(e) {
		Ti.API.debug('Request YWA done for Action: ' + pAction);
    };

	//eContent = encodeURIComponent(pContent);
    xhr.open('GET', request_url);
	// xhr.setRequestHeader('User-Agent', Ti.App.getName() + ':' + Ti.App.getVersion() + " | Titanium v:" + Ti.version + " | hash:" + Ti.buildHash + "(" + Titanium.buildDate + ")");
	// xhr.setRequestHeader('User-Agent', 'Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10');
	
	// if (!Ti.App.development) {
		xhr.send();
	// }
};
