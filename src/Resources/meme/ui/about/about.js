(function() {
	
	meme.ui.about = {};
	
	meme.ui.about.window = function() {
		
		var aboutWindow;
		
		var open = function() {
			aboutWindow = Ti.UI.createWindow({
				backgroundImage: 'images/bg.png',
				height: 460,
				width: 320
			});
			
			createButtons();
			
			aboutWindow.open({
				transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT,
				duration: 300
			});
		};
		
		var createButtons = function() {
			var buttons = {
				tos: {
					text: 'Yahoo! Terms of Service',
					url: 'http://meme.yahoo.com/help/utos/?.lang=en'
				},
				atos: {
					text: 'Additional Terms of Service',
					url: 'http://meme.yahoo.com/help/atos/?.lang=en'
				},
				privacy: {
					text: 'Privacy Policy',
					url: 'http://meme.yahoo.com/help/privacy/?.lang=en'
				},
				guidelines: {
					text: 'Community Guidelines',
					url: 'http://meme.yahoo.com/help/guidelines/?.lang=en'
				}
			};			
			
			var count = 0
			for (key in buttons) {
				var aboutButton = Ti.UI.createButton({
					top: 191 + (count * 62),
					width: 320,
					height: 62,
					backgroundImage: 'images/about_btn.png'
				});
				aboutButton.addEventListener('click', function() {
					meme.ui.openLinkOnSafari({
						url: buttons[key].url
					});
				})
				var aboutLabel = Ti.UI.createLabel({
					text: buttons[key].text,
					top: 20,
					left: 26,
					height: 20,
					width: 260,
					color: 'white',
					font: { fontSize: 19, fontFamily: 'Helvetica' }
				});
				aboutButton.add(aboutLabel);
				aboutWindow.add(aboutButton);
				count++;
			}
		};
		
		return {
			open: open
		};
	}();
	
})();