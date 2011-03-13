(function(){
	
	meme.ui.openPostWindow = function() {
		var postWindow = Ti.UI.createWindow({
			backgroundColor: 'white',
			left: 0,
			top: 0,
			height: 480,
			width: 320
		});
		postWindow.addEventListener('click', function(e) {
			postWindow.close();	
		});
		postWindow.open();
	}
	
})();