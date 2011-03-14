(function(){
	
	meme.ui.openPostWindow = function() {
		var postWindow = Ti.UI.createWindow({
			backgroundColor: 'white',
			left: 0,
			top: 0,
			height: 480,
			width: 320
		});
			
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