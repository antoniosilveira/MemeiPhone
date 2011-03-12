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
		homeWindow.add(tryNowButton);
	
		var signInButton = Titanium.UI.createButton({
			image: 'images/home_button_signin.png',
			top: 370,
			width: 320, 
			height: 110
		});
		homeWindow.add(signInButton);
	
		return homeWindow;
	};
	
})();