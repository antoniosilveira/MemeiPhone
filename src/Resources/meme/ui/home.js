(function(){
	
	var homeWindow, loggedOutView, loggedInView;
	
	meme.ui.openHomeWindow = function() {
		homeWindow = Titanium.UI.createWindow({
		    backgroundImage: 'images/home.png',
			orientationModes: [Ti.UI.PORTRAIT]
		});
		
		createLoggedInButtons();
		createloggedOutButtons();
		
		homeWindow.open();
		
		meme.ui.refreshHomeWindow();
	};
	
	meme.ui.refreshHomeWindow = function() {
		// TODO: add ajax :)
		setTimeout(function() {
			var showView = loggedOutView, hideView = loggedInView;
			if (meme.auth.oadapter && meme.auth.oadapter.isLoggedIn()) {
				showView = loggedInView, hideView = loggedOutView;
			}
			
			var animation = Ti.UI.createAnimation({
				duration: 125,
				left: -320
			});
			animation.addEventListener('complete', function() {
				showView.animate({
					duration: 125,
					left: 0
				});
			});
			hideView.animate(animation);
		}, 250);
	};
	
	var createLoggedInButtons = function() {
		loggedInView = Ti.UI.createView({
			top: 260,
			left: -320,
			width: 320, 
			height: 220
		});
		homeWindow.add(loggedInView);
		
		var newPostButton = Titanium.UI.createButton({
			image: 'images/home_button_newpost.png',
			left: 0,
			top: 0,
			width: 320, 
			height: 110
		});
		newPostButton.addEventListener('click', meme.ui.openPostWindow);
		loggedInView.add(newPostButton);
		
		var logoutButton = Titanium.UI.createButton({
			image: 'images/home_button_logout.png',
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
	
	var createloggedOutButtons = function() {
		loggedOutView = Ti.UI.createView({
			top: 260,
			left: -320,
			width: 320, 
			height: 220
		});
		homeWindow.add(loggedOutView);
		
		var tryNowButton = Titanium.UI.createButton({
			image: 'images/home_button_tryitnow.png',
			left: 0,
			top: 0,
			width: 320, 
			height: 110
		});
		tryNowButton.addEventListener('click', meme.ui.createAccount);
		loggedOutView.add(tryNowButton);

		var signInButton = Titanium.UI.createButton({
			image: 'images/home_button_signin.png',
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