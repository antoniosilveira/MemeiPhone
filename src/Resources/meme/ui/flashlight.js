(function(){
	
	var flashlightWindow;
	
	meme.ui.openFlashlightWindow = function() {
		flashlightWindow = Ti.UI.createWindow({
			backgroundColor: 'white',
			left: 0,
			top: 480,
			height: 480,
			width: 320
		});
		
		createFlashlightWindowHeader();
		//createFlashlightWindowResults();
		createFlashlightWindowFooter();
		
		flashlightWindow.open(Ti.UI.createAnimation({
			duration: 250,
			top: 0 
		}));
	};
	
	var createFlashlightWindowHeader = function() {
		var flashlightButton = Titanium.UI.createButton({
			image: 'images/flashlight_button.png',
			width: 114,
			height: 43,
			top: 0,
			left: 0,
			visible: true
		});
		flashlightButton.addEventListener('click', function(e) {
			flashlightWindow.close(Ti.UI.createAnimation({
				duration: 250,
				top: 480 
			}));
		});
		flashlightWindow.add(flashlightButton);
		
		var flashlightField = Titanium.UI.createView({
			backgroundImage: 'images/flashlight_field.png',
			width: 206,
			height: 43,
			top: 0,
			left: 114,
			visible: true
		});
		flashlightWindow.add(flashlightField);
		
		var searchField = Ti.UI.createTextField({
			hintText: 'search',
			textAlign: 'left',
			verticalAlign: 'center',
			font: { fontSize: 16, fontFamily: 'Helvetica' },
			width: 184,
			height: 33,
			top: 5,
			left: 14,
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
			keyboardType: Ti.UI.KEYBOARD_DEFAULT,
			returnKeyType: Titanium.UI.RETURNKEY_SEARCH,
			clearButtonMode: Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
		});
		flashlightField.add(searchField);
	};
	
	var createFlashlightWindowFooter = function() {
		var tabbedBar = Ti.UI.createTabbedBar({
			bottom: 0,
			height: 60,
			width: 320,
			style: Titanium.UI.iPhone.SystemButtonStyle.BAR
		});
		flashlightWindow.add(tabbedBar);
		
		var barButtonPhoto = Titanium.UI.createButton({
			image: 'images/flashlight_tab1.png',
			width: 80,
			height: 60,
			top: 0,
			left: 0,
			visible: true
		});
		tabbedBar.add(barButtonPhoto);
		
		var barButtonVideo = Titanium.UI.createButton({
			image: 'images/flashlight_tab2.png',
			width: 80,
			height: 60,
			top: 0,
			left: 80,
			visible: true
		});
		tabbedBar.add(barButtonVideo);
		
		var barButtonText = Titanium.UI.createButton({
			image: 'images/flashlight_tab3.png',
			width: 80,
			height: 60,
			top: 0,
			left: 160,
			visible: true
		});
		tabbedBar.add(barButtonText);
		
		var barButtonTweet = Titanium.UI.createButton({
			image: 'images/flashlight_tab4.png',
			width: 80,
			height: 60,
			top: 0,
			left: 240,
			visible: true
		});
		tabbedBar.add(barButtonTweet);
	};
	
})();