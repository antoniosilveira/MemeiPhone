(function(){
	var homeWindow = null;
	
	meme.ui.openHomeWindow = function() {
		homeWindow = Titanium.UI.createWindow({
		    backgroundImage: 'images/home.png',
			orientationModes: [Ti.UI.PORTRAIT]
		});
		
		if (meme.auth.oadapter && meme.auth.oadapter.isLoggedIn()) {
			var newPostButton = Titanium.UI.createButton({
				image: 'images/home_button_newpost.png',
				top: 260,
				width: 320, 
				height: 110
			});
			homeWindow.add(newPostButton);
			
			var logoutButton = Titanium.UI.createButton({
				image: 'images/home_button_logout.png',
				top: 370,
				width: 320, 
				height: 110
			});
			logoutButton.addEventListener('click', function() {
				meme.auth.oadapter.logout('meme', function() {
					meme.ui.refreshHomeWindow();
				});
			});
			homeWindow.add(logoutButton);
			
		} else {
			var tryNowButton = Titanium.UI.createButton({
				image: 'images/home_button_tryitnow.png',
				top: 260,
				width: 320, 
				height: 110
			});
			tryNowButton.addEventListener('click', meme.ui.createAccount);
			homeWindow.add(tryNowButton);

			var signInButton = Titanium.UI.createButton({
				image: 'images/home_button_signin.png',
				top: 370,
				width: 320, 
				height: 110
			});
			homeWindow.add(signInButton);

			var signInButtonClick = function(continuation) {
				var clickTimeoutSignIn = 0;
				signInButton.addEventListener('click', function() {
					clearTimeout(clickTimeoutSignIn);
					clickTimeoutSignIn = setTimeout(function() {
						continuation();
					}, 500);
				});
			};
			meme.ui.attachLogin(signInButtonClick, meme.ui.refreshHomeWindow);	
		}
		
		homeWindow.open();
	};
	
	meme.ui.refreshHomeWindow = function() {
		// TODO: add ajax :)
		setTimeout(function() {
			homeWindow.close();
			homeWindow = null;
			meme.ui.openHomeWindow();
		}, 500);
	};
	
})();