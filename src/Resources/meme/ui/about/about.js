(function() {
	
	meme.ui.about = {};
	
	meme.ui.about.window = function() {
		
		var aboutWindow;
		
		var open = function() {
			aboutWindow = Ti.UI.createWindow({
				backgroundColor: 'white',
				left: 0,
				top: 0,
				height: 460,
				width: 320
			});
			aboutWindow.open({
				transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT,
				duration: 300
			});
			aboutWindow.addEventListener('click', function() {
				aboutWindow.close({
					transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT,
					duration: 300
				});
			});
		};
		
		return {
			open: open
		};
	}();
		
	//http://meme.yahoo.com/help/atos/?.lang=%s
	//http://meme.yahoo.com/help/utos/?.lang=%s
	//http://meme.yahoo.com/help/privacy/?.lang=%s
	//http://meme.yahoo.com/help/guidelines/?.lang=%s
})();