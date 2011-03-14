(function(){
	
	meme.ui.openPostWindow = function() {
		var postWindow = Ti.UI.createWindow({
			backgroundColor: 'white',
			left: 0,
			top: 0,
			height: 480,
			width: 320
		});
		
		var titleField = Ti.UI.createTextField({
			hintText: 'add title',
			textAlign: 'left',
			verticalAlign: 'center',
			font: { fontSize: 20, fontFamily: 'Helvetica', fontWeight: 'bold' },
			width: 300,
			height: 45,
			top: 10,
			left: 10,
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
			keyboardType: Ti.UI.KEYBOARD_DEFAULT,
			clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ONFOCUS
		});
		postWindow.add(titleField);
		
		var dottedLineView = Titanium.UI.createView({
			backgroundImage: 'images/dotted_line.png',
			top: 55,
			left: 0,
			width: 320,
			height: 2
		});
		postWindow.add(dottedLineView);
		
		var textField = Ti.UI.createTextArea({
			hintText: 'write your post here',
			height: 378,
			width: 320,
			left: 0,
			top: 57,
			font: { fontSize: 16, fontFamily: 'Helvetica', fontWeight: 'regular' },
			textAlign: 'left',
			appearance: Ti.UI.KEYBOARD_APPEARANCE_ALERT,	
			keyboardType: Ti.UI.KEYBOARD_DEFAULT,
			clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ONFOCUS,
			//suppressReturn: false
		});
		postWindow.add(textField);
		
		var flashlightButton = Ti.UI.createButton({
			image: 'images/post_button_flashlight.png',
			top: 436,
			left: 0,
			width: 145, 
			height: 44
		});
		postWindow.add(flashlightButton);
	
		var pictureButton = Ti.UI.createButton({
			image: 'images/post_button_picture.png',
			top: 436,
			left: 145,
			width: 69, 
			height: 44
		});
		postWindow.add(pictureButton);
		
		var postButton = Ti.UI.createButton({
			image: 'images/post_button_submit.png',
			top: 436,
			left: 214,
			width: 106, 
			height: 44
		});
		postButton.addEventListener('click', function(e) {
			postWindow.close();	
		});
		postWindow.add(postButton);
		
		postWindow.open();
	}
	
})();