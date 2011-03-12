(function(){
	
	meme.ui.createHomeWindow = function() {
		var homeWindow = Titanium.UI.createWindow({
		    backgroundImage: 'images/home.png',
			orientationModes: [Ti.UI.PORTRAIT]
		});
	
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
		meme.ui.attachLogin(signInButtonClick, meme.ui.refreshHomeWindow)
		
		return homeWindow;
	};
	
	meme.ui.refreshHomeWindow = function() {
		Ti.API.info('refresh home window?');
	};
	
})();