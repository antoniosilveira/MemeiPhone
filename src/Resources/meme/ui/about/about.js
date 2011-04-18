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
			createFooter();
			
			aboutWindow.open({
				transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT,
				duration: 300
			});
		};
		
		var createButtons = function() {
			var buttons = {
				tos: {
					text: 'Yahoo! Terms of Service',
					url: 'http://meme.yahoo.com/help/utos/?.lang=' + meme.app.lang()
				},
				atos: {
					text: 'Additional Terms of Service',
					url: 'http://meme.yahoo.com/help/atos/?.lang=' + meme.app.lang()
				},
				privacy: {
					text: 'Privacy Policy',
					url: 'http://meme.yahoo.com/help/privacy/?.lang=' + meme.app.lang()
				},
				guidelines: {
					text: 'Community Guidelines',
					url: 'http://meme.yahoo.com/help/guidelines/?.lang=' + meme.app.lang()
				},
				feedback: {
					text: 'Send us feedback',
					url: 'http://meme.yahoo.com/help/feedback/?.lang=' + meme.app.lang()
				}
			};			
			
			var count = 0
			for (key in buttons) {
				var aboutButton = Ti.UI.createButton({
					top: 160 + (count * 52),
					width: 320,
					height: 52,
					backgroundImage: 'images/about_btn.png'
				});
				aboutButton.addEventListener('click', function() {
					meme.ui.openLinkOnSafari({
						url: buttons[key].url
					});
				})
				var aboutLabel = Ti.UI.createLabel({
					text: buttons[key].text,
					color: '#D9D9D9',
					top: 16,
					left: 26,
					height: 20,
					width: 260,
					font: { fontSize: 19, fontFamily: 'Helvetica' }
				});
				aboutButton.add(aboutLabel);
				aboutWindow.add(aboutButton);
				count++;
			}
		};
		
		var createFooter = function() {
			
		};
		
		return {
			open: open
		};
	}();
	
})();