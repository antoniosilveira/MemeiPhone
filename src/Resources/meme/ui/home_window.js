meme.ui.createHomeWindow = function() {
	var homeWindow = Titanium.UI.createWindow({
	    backgroundImage: 'images/home.png',
		orientationModes: [Ti.UI.PORTRAIT]
	});
	
	var tryNowButton = Titanium.UI.createButton({
		backgroundImage: 'images/home_button.png',
		top: 			200,
		width: 			400, 
		height: 		100,  
		title: 			'try it now',
		color: 			'white',
		textAlign: 		'center',
		font: 			{ fontSize: 34, fontFamily: 'Gotham Rounded', fontWeight: 'Bold' },
		opacity: 		1,
		visible: 		true
	});
	homeWindow.add(tryNowButton);
	
	return homeWindow;
};