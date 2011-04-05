(function(){
	
	var homeWindow, loggedOutView, loggedInView;
	
	meme.ui.openHomeWindow = function() {
		if (!meme.config.tests_enabled) {
			Ti.API.info('Home window opened, starting application...');
			
			homeWindow = Titanium.UI.createWindow({
			    backgroundImage: 'images/bg.png',
				orientationModes: [Ti.UI.PORTRAIT],
				height: 460,
				width: 320
			});
			
			createHeader();
			createLoggedInView();
			createloggedOutView();
		
			homeWindow.open();
			
			Ti.API.debug('About to refresh home window');
			meme.ui.refreshHomeWindow();
		}
	};
	
	meme.ui.refreshHomeWindow = function() {
		setTimeout(function() {
			var showView = loggedOutView, hideView = loggedInView;
			if (meme.auth.oadapter && meme.auth.oadapter.isLoggedIn()) {
				showView = loggedInView; hideView = loggedOutView;
				Ti.API.info('hi, welcome to meme! user is [' + meme.app.userInfo().name + ']');
			}
			
			var animation = Ti.UI.createAnimation({
				duration: 250,
				top: 460
			});
			animation.addEventListener('complete', function() {
				showView.animate({ duration: 250, top: 240 });
			});
			hideView.animate(animation);
		}, 125);
	};
	
	var createHeader = function() {
		var logoView = Ti.UI.createView({
			backgroundImage: 'images/en/logo_big.png',
			top: 57,
			left: 28,
			width: 263,
			height: 146,
			visible: true
		});
		homeWindow.add(logoView);
	};
	
	var createLoggedInView = function() {
		loggedInView = Ti.UI.createView({
			top: 460,
			left: 0,
			width: 320, 
			height: 220
		});
		homeWindow.add(loggedInView);
		
		var createPostButton = Titanium.UI.createButton({
			image: 'images/en/home_button_create_post.png',
			left: 0,
			top: 0,
			width: 320, 
			height: 110
		});
		createPostButton.addEventListener('click', meme.ui.openPostWindow);
		loggedInView.add(createPostButton);
		
		var yourBlogButton = Titanium.UI.createButton({
			image: 'images/en/home_button_your_blog.png',
			left: 0,
			top: 110,
			width: 320, 
			height: 110
		});
		
		var blogUrlLabel = Ti.UI.createLabel({
			top: 36,
			left: 22,
			color: 'white',
			font: { fontSize: 14, fontFamily:'Gotham Rounded', fontWeight: 'Light' },
			text: 'me.me/' + meme.app.userInfo().name;
		});
		yourBlogButton.add(blogUrlLabel);
		
		yourBlogButton.addEventListener('click', function() {
			meme.ui.openLinkOnSafari({
				url: 'http://me.me/' + meme.app.userInfo().name;
			});
			// meme.auth.oadapter.logout('meme', function() {
			// 				meme.ui.refreshHomeWindow();
			// 			});
		});
		loggedInView.add(yourBlogButton);
	};
	
	var createloggedOutView = function() {
		loggedOutView = Ti.UI.createView({
			top: 460,
			left: 0,
			width: 320, 
			height: 220
		});
		homeWindow.add(loggedOutView);
		
		var tryNowButton = Titanium.UI.createButton({
			image: 'images/en/home_button_tryitnow.png',
			left: 0,
			top: 0,
			width: 320, 
			height: 110
		});
		tryNowButton.addEventListener('click', meme.ui.createAccount);
		loggedOutView.add(tryNowButton);

		var signInButton = Titanium.UI.createButton({
			image: 'images/en/home_button_signin.png',
			left: 0,
			top: 110,
			width: 320, 
			height: 110
		});
		loggedOutView.add(signInButton);

		var signInButtonClick = function(continuation) {
			var clickTimeoutSignIn = 0;
			signInButton.addEventListener('click', function() {
				clearTimeout(clickTimeoutSignIn);
				clickTimeoutSignIn = setTimeout(function() {
					continuation();
				}, 250);
			});
		};
		meme.auth.attachLogin(signInButtonClick, meme.ui.refreshHomeWindow);
	};
	
})();