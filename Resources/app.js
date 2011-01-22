// create a new OAuthAdapter instance by passing by your consumer data and signature method
Ti.include('oadapter.js');
Ti.include('lib/cache.js');
Ti.include('lib/meme.js');
Ti.include('lib/analytics.js');

Ti.API.info("Current Language: " + Ti.Locale.currentLanguage);
Ti.API.info("App Name: " + Ti.App.getName() + " and App Version: " + Ti.App.getVersion());

// ==================
// = Global objects =
// ==================

// indicates if app is in development or production
// used to disable cache, analytics, etc
Ti.App.development = true; // WARNING: remove this before put in production :)

Ti.App.myMemeInfo = null;

Ti.App.oAuthAdapter = OAuthAdapter('meme', authorizationUI());

Ti.App.cache = Cache({ 
	cache_expiration_interval: 60, 
	disable: Ti.App.development
});

Ti.App.meme = Meme();

// =======================
// = Global control vars =
// =======================
var clickTimeoutStartPosting 	= 	0; 	// Sets the initial ClickTimeout for startPOsting Button
var clickTimeoutSignIn 	= 	0; 	// Sets the initial ClickTimeout for SignIn Button
Ti.App.newpostIsOpen = false; // controls for multiple clicks on Start new post btn
Ti.App.permalinkIsOpened = false; // control of Permalink Open
Ti.App.browserIsOpened = false; // control of Browser Open

// ===============
// = Application =
// ===============
//base Window
var win = Titanium.UI.createWindow({  
    title: 				'Meme for iPhone',
    backgroundImage: 	'images/bg.png',
	orientationModes : [
		Titanium.UI.LANDSCAPE_LEFT,
		Titanium.UI.LANDSCAPE_RIGHT
	]
});

//Analytics Request
doYwaRequest(analytics.APP_STARTED);

var logoHeader = Titanium.UI.createImageView({
       	image: 			L('path_logo_header'),
       	top:            9,
       	left:           15,
       	width:          163,
       	height:         33,
		zIndex: 		2
});
win.add(logoHeader);

var btn_signin = Titanium.UI.createButton({
	backgroundImage: L('path_btn_signin_background_image'),
	top: 			-6,
	left: 			936,
	width: 			100, 
	height: 		66,  
	title: 			L('path_btn_signin_title'),
	color: 			'white',
	textAlign: 		'center',
	font: 			{fontSize:13, fontFamily:'Helvetica Neue', fontWeight:'regular'},
	opacity: 		1,
	visible: 		false,
	zIndex: 		3
});
win.add(btn_signin);

var btn_signup = Titanium.UI.createButton({
	backgroundImage: 	L('path_btn_signup_background_image'),
	top: 				-6,
	left: 				632,
	width: 				315, //actual: 303	
	height: 			66, //actual: 54
	opacity: 			1,
	visible: 			false,
	zIndex: 			3
});
win.add(btn_signup);

btn_signup.addEventListener("click", function(e) {
	//Analytics Request
	doYwaRequest(analytics.OPEN_SAFARI_CREATE_ACCOUNT);
	
	Ti.App.fireEvent('openBrowser', {
		url: L("btn_signup_url")
	});
	
});

Ti.App.activitySmall = Ti.UI.createActivityIndicator({
	style: 				Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN,
	color: 				'white',
	backgroundColor: 	'black',
	width: 				35,
	height: 			35,
	borderRadius: 		5,
	opacity: 			0.8,
	zIndex: 			2
});

// ==========================
// = CREATE THE POST WINDOW =
// ==========================

var a = Titanium.UI.createAnimation();
a.duration = 300;
a.top = 0;

var newPost = function(link) {
	Ti.UI.createWindow({
		url: 'newpost.js',
		title: 'New Post',
		backgroundColor: 'white',
		left: 0,
		top: -749,
		height: 748,
		width: 1024,
		zIndex: 3,
		link: link,
		navBarHidden: true
	}).open(a);
};

// ====================
// = LOGGED IN HEADER =
// ====================

var showHeader = function (successCallback) {
	
	var headerView = Ti.UI.createView({
		backgroundColor:'transparent',
		left:0,
		top:0,
		height:54,
		width:1024,
		zIndex: 4,
		visible: true
	});
	win.add(headerView);

	if (Ti.App.oAuthAdapter.isLoggedIn()) {
		Ti.App.myMemeInfo = Ti.App.meme.userInfo('me', 35, 35, true);
		
		var btn_Username = Ti.UI.createView({
			backgroundImage: 			'images/btn_username.png',	
			backgroundLeftCap: 			2,
			backgroundRightCap: 		33,
			height: 					49,
			width: 						250, // original: 243
			left: 						207,
			top: 						0,
			opacity: 					1,
			zIndex:  					1,
			style: 						Titanium.UI.iPhone.SystemButtonStyle.PLAIN
		});
		headerView.add(btn_Username);
	
		var memeTitleLabel = Ti.UI.createLabel({
				color: 		'#ffffff',
				text:  		Ti.App.myMemeInfo.title,
				font: 		{fontSize:14, fontFamily:'Helvetica Neue', fontWeight:'bold'},
				textAlign: 	'left',		
				top: 		14,
				left:  		12,
				height: 	20,
				width: 		204,
				opacity: 	1,
				zIndex: 	99	
			});
		btn_Username.add(memeTitleLabel);


		// ===============
		// = post button =
		// ===============
		
		var btn_create_post = Ti.UI.createButton({
			backgroundImage: 	L('path_create_post_background_image'), 
			height: 			79,
			width: 				419, 
			left: 				617,
			top: 				-12,
			zIndex: 			5
		});
		headerView.add(btn_create_post);
		
		// Opens the New Post Window
		btn_create_post.addEventListener('click', function()
		{
			
			clearTimeout(clickTimeoutStartPosting);

			clickTimeoutStartPosting = setTimeout(function() {	
				if (Ti.App.newpostIsOpen == false) {
					newPost();
				}
			},500);
			
		});

	} else {
		
		// NOT LOGGED IN
		btn_signin.visible = true;
		btn_signup.visible = true;
		headerView.hide();
	}
	
	successCallback();
};

var signInButtonClick = function(continuation) {
	// Sign In Button Listener
	btn_signin.addEventListener("click", function() {
		
		clearTimeout(clickTimeoutSignIn);

		clickTimeoutSignIn = setTimeout(function() {	
			continuation();
		},500);		
		
	});
};

var startApplication = function() {
	showHeader(function() {
		showDashboard();
	});
	
	if (! Ti.App.oAuthAdapter.isLoggedIn()) {  
		
		// Resets the Draft when logging in first time. 
		if (Ti.App.Properties.hasProperty('draft_post')) {
			Ti.App.Properties.removeProperty('draft_post');	
		}
		
		//Start the oAuth Process
		Ti.App.oAuthAdapter.attachLogin(signInButtonClick, startApplication);
	}
};
	
//  CREATE CUSTOM LOADING INDICATOR
//
var indWin = null;
var actInd = null;

function showIndicator(pMessage, pColor, pSize, pTop, pLeft) {
	
	// window container
	indWin = Titanium.UI.createWindow({
		height: 		pSize,
		width: 			pSize,
		opacity: 		1,
		zIndex: 		99
	});
	
	//IF POSITION IS DEFINED
	if (pTop){
		indWin.top = pTop;
		indWin.left = pLeft;
	}

	// black view
	var indView = Titanium.UI.createView({
		height: 			pSize,
		width: 				pSize,
		backgroundColor: 	pColor,
		borderRadius: 		10,
		opacity: 			0.8
	});
	indWin.add(indView);

	// loading indicator
	actInd = Titanium.UI.createActivityIndicator({
		style: 			Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
		top: 			pSize/3,
		height: 		30,
		width: 			30,
		opacity: 		1,
		zIndex: 		5
	});
	indWin.add(actInd);

	// message
	var message = Titanium.UI.createLabel({
		text: 			pMessage,
		color: 			'#fff',
		width: 			'auto',
		height: 		'auto',
		font: 			{fontSize:18,fontWeight:'bold'},
		bottom: 		pSize/4,
		opacity: 		1,
		zIndex: 		5
	});
	indWin.add(message);
	indWin.open();
	actInd.show();	

};

function hideIndicator() {
	if (actInd && indWin) {
		actInd.hide();
		indWin.close({opacity:0,duration:500});
	}
};

//
// Add global event handlers to hide/show custom indicator
//
Ti.App.addEventListener('show_indicator', function(e)
{
	Ti.API.info("SHOW INDICATOR");
	showIndicator(e.message, e.color, e.size, e.top, e.left);
});

Ti.App.addEventListener('hide_indicator', function(e)
{
	Ti.API.info("HIDE INDICATOR");
	hideIndicator();
});

//
// Opens a link on Safari
//
Ti.App.addEventListener('openLinkOnSafari', function(data) {
	var title = L('open_link_title'),
		message = L('open_link_message');
	
	if (data.title) {
		title = data.title;
	}
	if (data.message) {
		message = data.message;
	}
	
	var alert = Titanium.UI.createAlertDialog({
		title: title,
		message: message,
		buttonNames: [L('btn_alert_OK'),L('btn_alert_CANCEL')],
		cancel: 1
	});
	
	alert.addEventListener('click', function(e) {
		if (e.index == 0){
			Ti.Platform.openURL(data.url);
			//Analytics Request
			doYwaRequest(analytics.OPEN_SAFARI);
		}
	});
	
	alert.show();
});

// ============================
// = Fullscreen error message =
// ============================
var displayErrorMessage = function(title, message, relativeTop, pFontSize) {
	//Closes the Keyboard if open
	Ti.App.fireEvent('hide_keyboard');
	
	var errorWin = Ti.UI.createWindow({
		title: title,
		backgroundColor: 'transparent',
		left: 0,
		top: 0,
		height: '100%',
		width: '100%',
		zIndex: 999,
		navBarHidden: true
	});
	
	var errorView = Ti.UI.createView({
	 backgroundColor: 	'transparent',
		backgroundImage: 	'images/bg_error_msg.png',
		width: 				'100%',
		height: 			'100%',
		zIndex: 			999
	});
	errorWin.add(errorView);
	
	var icon_exclamation = Ti.UI.createImageView({
		image: 'images/icon_exclamation.png',
		top: 310,
		left: 50,
		width: 100,
		height: 86,
		opacity: 0.3
	});
	errorView.add(icon_exclamation);
	
	var errorLabel = Ti.UI.createLabel({
		text: 				message,
		font: 				{fontSize: pFontSize, fontFamily:'Helvetica', fontWeight:'bold'},
		textAlign: 			'left',
		top: 				250 + relativeTop,
		left: 				177,	
		width: 				600,
		height: 			'auto',
		backgroundColor: 	'transparent',
		color: 				'#666'
	});
	errorView.add(errorLabel);
	
	var btn_error_refresh = Ti.UI.createButton({
		title: 				L('btn_error_refresh_title'),
		color: 				'#7D0670',
		font: 				{fontSize:22, fontFamily:'Helvetica', fontWeight:'regular'},
		backgroundImage: 	'images/btn_error_refresh.png',
		backgroundColor: 	'transparent',
		selectedColor: 		'gray',
		height: 			53,
		width: 				160,
		left: 				794,
		top: 				330,
		style: 				Ti.UI.iPhone.SystemButtonStyle.PLAIN
	});
	errorView.add(btn_error_refresh);
	
	errorWin.open();
	
	// Opens the New Post Window
	btn_error_refresh.addEventListener('click', function() {
		//Closes NewPost if Open
		Ti.App.fireEvent('close_newpost');
		
		//Closes Permalink if Open
		Ti.App.fireEvent('close_permalink');
		
		//Closes DASHBOARD
		Ti.App.fireEvent('close_dashboard');
		
		errorWin.close({opacity:0,duration:200});
		
		startApplication();
	});
};

// =====================
// = YQL ERROR MESSAGE =
// =====================
Ti.App.addEventListener('yqlerror', function(e) {
	//Analytics Request
	doYwaRequest(analytics.YQL_ERROR);
	
	//Closes the Keyboard if open
	Ti.App.fireEvent('hide_keyboard');
	
	Ti.API.error('App crashed (cannot connect to YQL). Error info: ' + JSON.stringify(e));
	
	//Alert to Error
	var alertError = Titanium.UI.createAlertDialog({
		title: L('yql_error'),
		message: L('error_message_problem'),
		buttonNames: [L('btn_alert_CANCEL'),L('btn_error_refresh_title')],
		cancel: 0
	});	
	alertError.show();
	
	alertError.addEventListener('click',function(e)	{
		if (e.index == 1){
			//Closes NewPost if Open
			Ti.App.fireEvent('close_newpost');

			//Closes Permalink if Open
			Ti.App.fireEvent('close_permalink');

			//Closes DASHBOARD
			Ti.App.fireEvent('close_dashboard');

			startApplication();
				
		}	
	});
	
	// displayErrorMessage(L('yql_error'), L('error_message_problem'), 80, 36);
});

// ==================================
// = Checks if the Device is Online =
// ==================================
if (!Titanium.Network.online) {
	displayErrorMessage(L('network_error'), L('network_error_message'), 45, 30);
} else {
		startApplication();
};

// =====================
// = Permalink opening =
// =====================

Ti.App.addEventListener('openPermalink', function(e) {
	// permalink should open only when click was on the blackBox
	// otherwise there will be no guid and pubid data and the app will crash
	if (e.guid && e.pubId) {
		
		// Sets the Permalink Animation startup settings
		var t = Ti.UI.create2DMatrix();
		t = t.scale(0);

		var winPermalink = Ti.UI.createWindow({
		    url: 'permalink.js',
		    name: 'Permalink Window',
		    backgroundColor:'transparent',
			left:0,
			top:0,
			height:'100%',
			width:'100%',
			navBarHidden: true,
			zIndex: 6,
			transform: t,
			pGuid: e.guid,
			pPubId: e.pubId
		});

		// Creating the Open Permalink Transition
		// create first transform to go beyond normal size
		var t1 = Titanium.UI.create2DMatrix();
		t1 = t1.scale(1.0);

		var a = Titanium.UI.createAnimation();
		a.transform = t1;
		a.duration = 200;

		if (Ti.App.permalinkIsOpened == false){
			
			Ti.App.permalinkIsOpened = true;
			winPermalink.open(a);
		}

	}
});


// =========================
// = OPEN INTERNAL BROWSER =
// =========================

Ti.App.addEventListener('openBrowser', function(e) {

	var winBrowser = Ti.UI.createWindow({
	    url: 				'browser.js',
	    name: 				'Internal Browser',
	    backgroundImage: 	'images/bg_black_transparent.png',
		backgroundLeftCap: 	10,
		backgroundTopCap: 	10,
		left: 				0,
		top: 				0,
		height: 			'100%',
		width: 				'100%',
		navBarHidden: 		true,
		zIndex: 			7,
		opacity: 			0,
		pUrl: 				e.url
	});


	var a = Titanium.UI.createAnimation();
	a.duration = 300;
	a.opacity = 1;

	if (Ti.App.browserIsOpened == false){
		Ti.App.browserIsOpened = true;
		winBrowser.open(a);
	}

});

// =================================
// = LISTENERS FOR THE BOOKMARKLET =
// =================================

// Listeners to retrieve Data from the Custom Handler (memeipad)
var book_previous; 

Ti.App.addEventListener('resumed', function (e){
	//Analytics Request
	doYwaRequest(analytics.APP_STARTED);
	
	if (Ti.App.oAuthAdapter.isLoggedIn()) {
	
		if (Ti.App.getArguments().url) {
			// Retrieves the data from the Bookmarklet
			var bookmarkletLink = Ti.App.getArguments().url.split("memeapp:")[1];
			Ti.API.info("Arguments URL: BookmarkletLink [" + bookmarkletLink + "], Previous [" + book_previous + "]");
			if (bookmarkletLink != book_previous) {
			
				if (Ti.App.newpostIsOpen == false) {
					newPost(bookmarkletLink);
					book_previous = bookmarkletLink;
				
				} else {
					//Alert if the NewPost Screen is open
					var alertPaste = Titanium.UI.createAlertDialog({
						title: L('meme_paste_alert_title'),
						message: String.format(L("meme_paste_alert_message"), bookmarkletLink),
						buttonNames: [L('btn_alert_CANCEL'),L('btn_alert_YES')],
						cancel: 0
					});	
					alertPaste.show();

					alertPaste.addEventListener('click',function(e)	{
						if (e.index == 1){
							Ti.App.fireEvent("bookmarklet_link", {link: bookmarkletLink});
							book_previous = bookmarkletLink;
						}	
					});
				}
			}
		}
	} else {
		// Not Logged In
		Ti.API.debug("Not LoggedIn, not going to paste this Link on New Post");
	}
});

Ti.App.addEventListener('pause', function (e){
	// Ti.API.info("App Arguments on Pause: " + JSON.stringify(Ti.App.getArguments()));
});


// ==========================
// = SHAKE TO CLEAN GESTURE =
// ==========================

// THIS ALLOWS USERS TO CLEAN UP THE NEW POST SCREEN SHAKING THE DEVICE
Ti.Gesture.addEventListener('shake',function(e)
{
	Ti.API.debug("Shake Gesture captured, cleaning up the New Post Forms");
	Ti.App.fireEvent('shake_clean');
	
});