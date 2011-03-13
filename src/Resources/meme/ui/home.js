(function(){
	
	var homeWindow = null,
		homeWindowElements = [];
	
	meme.ui.openHomeWindow = function() {
		homeWindow = Titanium.UI.createWindow({
		    backgroundImage: 'images/home.png',
			orientationModes: [Ti.UI.PORTRAIT]
		});
		
		homeWindowElements = createHomeWindowElements();
		homeWindow.open();
		
		meme.ui.refreshHomeWindow();
	};
	
	meme.ui.refreshHomeWindow = function() {
		// TODO: add ajax :)
		setTimeout(function() {
			// remove elements
			for (index in homeWindowElements) {
				homeWindow.remove(homeWindowElements[index]);
			}
			// create new ones
			homeWindowElements = createHomeWindowElements();
			for (index in homeWindowElements) {
				homeWindow.add(homeWindowElements[index]);
			}
		}, 250);
	};
	
	var createHomeWindowElements = function() {
		// TODO: store loggedin and loggedout buttons
		// so we don't have to re-create them all the time
		var elements = [];
		if (meme.auth.oadapter && meme.auth.oadapter.isLoggedIn()) {
			var newPostButton = Titanium.UI.createButton({
				image: 'images/home_button_newpost.png',
				top: 260,
				width: 320, 
				height: 110
			});
			newPostButton.addEventListener('click', meme.ui.openPostView);
			elements.push(newPostButton);
			
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
			elements.push(logoutButton);
			
		} else {
			var tryNowButton = Titanium.UI.createButton({
				image: 'images/home_button_tryitnow.png',
				top: 260,
				width: 320, 
				height: 110
			});
			tryNowButton.addEventListener('click', meme.ui.createAccount);
			elements.push(tryNowButton);

			var signInButton = Titanium.UI.createButton({
				image: 'images/home_button_signin.png',
				top: 370,
				width: 320, 
				height: 110
			});
			elements.push(signInButton);

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
		return elements;
	};
	
})();