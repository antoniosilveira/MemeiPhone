(function(){
	
	var homeWindow, loggedOutView, loggedInView;
	
	meme.ui.openHomeWindow = function() {
		if (!meme.config.tests_enabled) {
			homeWindow = Titanium.UI.createWindow({
			    backgroundImage: 'images/bg.png',
				orientationModes: [Ti.UI.PORTRAIT],
				height: 480,
				width: 320
			});
			
			createHeader();
			createLoggedInView();
			createloggedOutView();
		
			homeWindow.open();
		
			meme.ui.refreshHomeWindow();
		}
	};
	
	meme.ui.refreshHomeWindow = function() {
		setTimeout(function() {
			var showView = loggedOutView, hideView = loggedInView;
			if (meme.auth.oadapter && meme.auth.oadapter.isLoggedIn()) {
				showView = loggedInView, hideView = loggedOutView;
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
		var headerView =  Ti.UI.createView({
			top: 0,
			height: 460,
			width: 320,
			backgroundColor: 'transparent'
		});
		homeWindow.add(headerView);
		
		var logoView = Ti.UI.createView({
			backgroundImage: 'images/en/logo_big.png',
			top: 90,
			left: 32,
			width: 263,
			height: 146,
			visible: true
		});
		headerView.add(logoView);
		
		headerView.animate({
			duration: 500,
			backgroundColor: '#191919'
		});
		
		logoView.animate({
			duration: 500,
			top: 60
		});
	};
	
	var createLoggedInView = function() {
		loggedInView = Ti.UI.createView({
			top: 460,
			left: 0,
			width: 320, 
			height: 220
		});
		homeWindow.add(loggedInView);
		
		var newPostButton = Titanium.UI.createButton({
			image: 'images/old/home_button_newpost.png',
			left: 0,
			top: 0,
			width: 320, 
			height: 110
		});
		newPostButton.addEventListener('click', meme.ui.openPostWindow);
		loggedInView.add(newPostButton);
		
		var logoutButton = Titanium.UI.createButton({
			image: 'images/old/home_button_logout.png',
			left: 0,
			top: 110,
			width: 320, 
			height: 110
		});
		logoutButton.addEventListener('click', function() {
			meme.auth.oadapter.logout('meme', function() {
				meme.ui.refreshHomeWindow();
			});
		});
		loggedInView.add(logoutButton);
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
				}, 500);
			});
		};
		meme.auth.attachLogin(signInButtonClick, meme.ui.refreshHomeWindow);
	};
	
})();