Ti.include('lib/commons.js');
Ti.include('lib/analytics.js');

//Analytics Request
doYwaRequest(analytics.BROWSER_VIEW);

// Setting local window holder
var win = Ti.UI.currentWindow;

//RETRIEVING PARAMETERS FROM PREVIOUS WINDOW
var pUrl = win.pUrl;
var clickTimeoutSharePopover = 0; // variable to protect against multiple clicks
var currentHref; // holds the Current URL displayed in the Browser
var currentTitle; // holds the Current WebPage Title

// ============================
// = BULDING BROWSER LAYOUT =
// ============================

var browserView = Ti.UI.createView({
	backgroundColor:'white',
	opacity: 		100,
	top: 			768,
	borderRadius: 	3,
	width:  		978,
	height: 		700,
	zIndex: 		1
});
win.add(browserView);

// Flexible Space for the NavBar
var flexSpace = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});

//Creates the top navigation bar of the browser
var browserBar = Titanium.UI.createToolbar({
	// items:[flexSpace,backButton, flexSpace, fwdButton, flexSpace, stopButton, flexSpace, titleLabel, flexSpace, reloadButton, flexSpace, shareButton ],
	top: 			0,
	left: 			0,
	borderTop: 		true,
	borderBottom: 	true,
	translucent: 	false,
	width: 			978,
	height: 		44,
	barColor: 		'black',
	zIndex: 		1
});	
browserView.add(browserBar);


// Button that closes the Browser
var doneButton = Ti.UI.createButton({
	backgroundImage: 			'images/bg_btn_back.png',
	backgroundLeftCap: 			15,
	backgroundRightCap: 		15,
	borderRadius: 				2,
	right: 						5,
	height: 					35, //29
	width: 						80	, // 50
    title: 						' ' + L('btn_done_title'),
	color: 						'white',
	textAlign: 					'center',
	font: 						{fontSize:12, fontFamily:'Helvetica', fontWeight:'bold'},
	style: 						Titanium.UI.iPhone.SystemButtonStyle.PLAIN
});
browserBar.add(doneButton);

doneButton.addEventListener("click", function(e)
{
	var a = Titanium.UI.createAnimation();
	a.duration = 300;
	a.top = 768;
	
	win.close(a);
	Ti.App.browserIsOpened = false;
    // allows for other Browser to Open
	
});


//Title
var titleLabel = Titanium.UI.createLabel({
	color:'#FFF',
	text: '',
	textAlign:'center',
	font: {
		fontSize: 20,
		fontFamily:'Helvetica',
		fontWeight: 'bold'
	},
	// backgroundColor: 'red',
	left: 214,
	width: 550,
	height: 27,
	zIndex: 2
});
browserBar.add(titleLabel);

//Browser Buttons
var backButton = Ti.UI.createButton({
	backgroundImage: 			'images/btn_back_browser.png',
	left: 						30,
	enabled: 					false,
	height: 					28,
	width: 						26,
	style: 						Titanium.UI.iPhone.SystemButtonStyle.PLAIN
});
browserBar.add(backButton);

var fwdButton = Ti.UI.createButton({
	backgroundImage: 			'images/btn_fwd_browser.png',
	left: 						70,
	enabled: 					false,
	height: 					28,
	width: 						26,
	style: 						Titanium.UI.iPhone.SystemButtonStyle.PLAIN
});
browserBar.add(fwdButton);

var stopButton = Ti.UI.createButton({
	backgroundImage: 			'images/btn_stop_browser.png',
	left: 						115,
	height: 					28,
	width: 						28,
	style: 						Titanium.UI.iPhone.SystemButtonStyle.PLAIN
});
browserBar.add(stopButton);

var reloadButton = Ti.UI.createButton({
	backgroundImage: 			'images/btn_reload_browser.png',
	left: 						770,
	height: 					33,
	width: 						30,
	zIndex: 					1,
	style: 						Titanium.UI.iPhone.SystemButtonStyle.PLAIN
});
browserBar.add(reloadButton);

var shareButton = Ti.UI.createButton({
	backgroundImage: 			'images/btn_share_browser.png',
	left: 						830,
	height: 					34,
	width: 						40,
	style: 						Titanium.UI.iPhone.SystemButtonStyle.PLAIN
});
browserBar.add(shareButton);

// Loader
var actAjax = Ti.UI.createActivityIndicator({
	left: 			595,
	message: 		'',
	zIndex: 		2,
	visible: 		false,
	style: 			Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN
});
browserBar.add(actAjax);

// Create our Webview to render the URL's content
var webView = Ti.UI.createWebView({
		backgroundColor: 	'white',
		opacity: 			1,
        url: 				pUrl,
		top: 				44,
		width: 				978,
		height: 			656,
        loading: 			true,
		scalesPageToFit: 	true
});
browserView.add(webView);

// Button Listeners

backButton.addEventListener("click", function(e)
{
	webView.goBack();
});

fwdButton.addEventListener("click", function(e)
{
	webView.goForward();
});

stopButton.addEventListener("click", function(e)
{
	webView.stopLoading();
	actAjax.hide();
	reloadButton.show();
});

reloadButton.addEventListener("click", function(e)
{
	webView.reload();
	actAjax.show();
	reloadButton.hide();
});

// POPOVER WITH DETAILED INFO FROM USER OWNER OF THE POST
shareButton.addEventListener('touchstart', function(e) {
	
	clearTimeout(clickTimeoutSharePopover);
	
	clickTimeoutSharePopover = setTimeout(function() {	

		var popover = Ti.UI.iPad.createPopover({
			width:330,
			height:180,
			backgroundColor: 'white',
			navBarHidden: true,
			arrowDirection:Ti.UI.iPad.POPOVER_ARROW_DIRECTION_UP
		});

		var main = Ti.UI.createWindow({
			top: 0,
			left: 0,
			width: 330,
			height: 180,
			backgroundColor:"#FFF",
			navBarHidden: true
		});

		popover.add(main);

		// BUILDING THE TABLE VIEW
		var data = [];

		// ROW 1 LINK TO MEME AND FOLLOW/UNFOLLOW BUTTON
		var row1 = Ti.UI.createTableViewRow({
			selectionStyle: 2, // GRAY color when clicking in the row
			height: 60
		});
		
		var icon_share_link = Ti.UI.createImageView({
			image: 			'images/icon_share_link.png',
			top: 			18,
			left: 			8,
			width: 			24,
			height: 		24
		});
		row1.add(icon_share_link);
		
		var linkMeme = Ti.UI.createLabel({
		 	color: 			'#7D0670',
			text: 			currentHref,
			textAlign: 		'left',
			font: 			{fontSize:13, fontWeight:'bold'},
			top: 			15,
			left: 			40,
			height: 		30,
			width: 			282
		});	
		row1.add(linkMeme);

		data[0] = row1;

		// ROW 2 COPY CLIPBOARD
		var row2 = Ti.UI.createTableViewRow({
			height: 40,
			selectionStyle: 2 // GRAY color when clicking in the row
		});
		
		var icon_share_copy = Ti.UI.createImageView({
			image: 			'images/icon_share_copy.png',
			top: 			8,
			left: 			8,
			width: 			24,
			height: 		24
		});
		row2.add(icon_share_copy);

		var copyLabel = Ti.UI.createLabel({
			color: 			'#333',
			text: 			L('copy_link_text'),
			textAlign: 		'left',
			font: 			{fontSize:16, fontFamily:'Helvetica', fontWeight:'regular'},
			top: 			7,
			left: 			40,
			height: 		26,
			width: 			260
		});	
		row2.add(copyLabel);

		data[1] = row2;
		
		// ROW 3 MAIL LINK
		var row3 = Ti.UI.createTableViewRow({
			height: 40,
			selectionStyle: 2 // GRAY color when clicking in the row
		});
		
		var icon_share_mail = Ti.UI.createImageView({
			image: 			'images/icon_share_mail.png',
			top: 			8,
			left: 			8,
			width: 			24,
			height: 		24
		});
		row3.add(icon_share_mail);

		var mailLabel = Ti.UI.createLabel({
			color: 			'#333',
			text: 			L('mail_web_link'),
			textAlign: 		'left',
			font: 			{fontSize:16, fontFamily:'Helvetica', fontWeight:'regular'},
			top: 			7,
			left: 			40,
			height: 		26,
			width: 			260
		});	
		row3.add(mailLabel);

		data[2] = row3;
		
		// ROW 4 SHARE WITH TWITTER FOR IPAD
		var row4 = Ti.UI.createTableViewRow({
			height: 40,
			selectionStyle: 2 // GRAY color when clicking in the row
		});
		
		var icon_share_mail = Ti.UI.createImageView({
			image: 			'images/icon_share_twitter.png',
			top: 			8,
			left: 			8,
			width: 			24,
			height: 		24
		});
		row4.add(icon_share_mail);

		var shareLabel = Ti.UI.createLabel({
			color: 			'#333',
			text: 			L('share_with_twitter'), 
			textAlign: 		'left',
			font: 			{fontSize:16, fontFamily:'Helvetica', fontWeight:'regular'},
			top: 			7,
			left: 			40,
			height: 		26,
			width: 			260
		});	
		row4.add(shareLabel);

		data[3] = row4;

		var shareTableView = Ti.UI.createTableView({
			data: 			data,
			scrollable: 	false,
			top: 			0,
			left: 			0,
			width: 			340,
			height: 		180,
			separatorColor: '#CCC',
			style: 			Ti.UI.iPhone.TableViewStyle.PLAIN
		});
		main.add(shareTableView);
		
		// Listeners
		shareTableView.addEventListener('click', function(e)	{
			//If Clicked on Permalink Link, then Open Safari Alert
			if (e.index == 0) {
				Ti.App.fireEvent('openLinkOnSafari', {
					url: 		currentHref,
					title: 		L('open_link_title'),
					message: 	L('open_link_message')
				});			
				popover.hide();
			}
			// If Clicked on Line 2 - Then copy link to Clipboard
			else if (e.index == 1) {
				//Analytics Request
				doYwaRequest(analytics.COPY_LINK);
				
				Ti.UI.Clipboard.setText(currentHref);
				popover.hide();
			}
			
			// If Clicked on Line 3 - Then open Mail Dialog
			else if (e.index == 2) {
				
				var emailDialog = Titanium.UI.createEmailDialog();
				emailDialog.setHtml(true);
	            emailDialog.setBarColor('black');
				
				// Setting the Mail Subject using the Current Title
				emailDialog.setSubject(L('mail_web_link_text') + currentTitle);
				
				//Defines the current Message Body
				var messageBody = L('mail_web_link_text') + '<a href=' + currentHref + '>' + currentHref + '</a><br/><br/><a href="' + L('memeapp_url') + '" style="color: #999; border: 0; text-decoration: underline;">' + L('mail_message_signature') + '</a><!--YWA tracking tag--><img src="http://a.analytics.yahoo.com/p.pl?a=1000671789962&js=no&x=' + analytics.EMAIL_OPEN + '" width="1" height="1" alt="" />';
					
				emailDialog.setMessageBody(messageBody); 
				
		        emailDialog.addEventListener('complete',function(e)
		        {
		            if (e.result == emailDialog.SENT)
		            {
						//Analytics Request
						doYwaRequest(analytics.SHARE_MAIL);

	                    Ti.API.log("Mail message was sent");
		            }
		            else
		            {
		                Ti.API.log("Mail message was not sent. result = " + e.result);
		            }
		        });
		        emailDialog.open();

				popover.hide();

			}
			
			// Share with Twitter for iPad app
			else if (e.index == 3) {
				
				//Analytics Request
				doYwaRequest(analytics.SHARE_TWITTER_IPAD);
				
				Ti.App.fireEvent('openLinkOnSafari', {
					url: 		'tweetie:' + currentHref,
					title: 		L('share_with_twitter'),
					message: 	L('share_with_twitter_message')
				});
				popover.hide();
			}
		}); // end TableView Listener

		popover.show({
			view:     shareButton,
			animated: true
		});

	},500);

});


//WebView Listeners
webView.addEventListener("beforeload", function(e) {
	// displays the ajax in the NavBar while the webview is being loaded
	actAjax.show();
	reloadButton.hide();
});

webView.addEventListener("load", function(e) {
	currentTitle = webView.evalJS("document.title");
	titleLabel.text = webView.evalJS("document.title");
	// hides the ajax in the NavBar after the webview is loaded
	actAjax.hide();
	reloadButton.show();
	
	// enables/disables the back and fwd buttons
	backButton.enabled = webView.canGoBack();
	fwdButton.enabled = webView.canGoForward();
	
	//sets the URL to be shared/displayed
	currentHref = webView.evalJS("location.href");
});

//Window Load Listener
// It activates the View Animation on startup
win.addEventListener("open", function(e) {
	browserView.animate({top: 24, duration: 200});
});