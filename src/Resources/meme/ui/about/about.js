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
			
			createHeader();
			createButtons();
			createFooter();
			
			aboutWindow.open({
				transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT,
				duration: 500
			});
		};
		
		var createHeader = function() {
			var aboutBar = Ti.UI.createView({
				top: 0,
				width: 320,
				height: 40,
				backgroundImage: 'images/about_navbar_bg.png'
			});
			aboutWindow.add(aboutBar);
			
			var aboutLabel = Ti.UI.createLabel({
				text: L('about_title'),
				color: 'white',
				height: 22,
				left: 60,
				width: 200,
				textAlign: 'center',
				font: { fontSize: 20, fontFamily: 'Helvetica', fontWeight: 'Bold' }
			});
			aboutBar.add(aboutLabel);
			
			var doneButton = Ti.UI.createButton({
				top: 5,
				right: 5,
				height: 30,
				width: 60,
				backgroundImage: 'images/btn_done.png',
				title: L('about_btn_done'),
				font: { fontSize: 12, fontFamily: 'Helvetica Neue', fontWeight: 'Bold' }
			});
			doneButton.addEventListener('click', function() {
				aboutWindow.close({
					transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT,
					duration: 500
				});
			});
			aboutBar.add(doneButton);
			
			var logoView = Ti.UI.createView({
				top: 40,
				width: 320,
				height: 119,
				backgroundImage: 'images/' + meme.app.lang() + '/about_memeforiphone.png'
			});
			aboutWindow.add(logoView);
			
			var versionLabel = Ti.UI.createLabel({
				text: String.format(L('about_version'), Ti.App.version),
				color: 'white',
				top: 59,
				left: 100,
				height: 15,
				font: { fontSize: 11, fontFamily: 'Helvetica', fontWeight: 'Light' }
			});
			logoView.add(versionLabel);
		};
		
		var createButtons = function() {
			var buttons = {
				tos: {
					text: L('about_utos'),
					url: 'http://meme.yahoo.com/help/utos/?.lang=%s'
				},
				atos: {
					text: L('about_atos'),
					url: 'http://meme.yahoo.com/help/atos/?.lang=%s'
				},
				privacy: {
					text: L('about_privacy'),
					url: 'http://meme.yahoo.com/help/privacy/?.lang=%s'
				},
				guidelines: {
					text: L('about_community'),
					url: 'http://meme.yahoo.com/help/guidelines/?.lang=%s'
				},
				feedback: {
					text: L('about_feedback'),
					url: 'http://meme.yahoo.com/help/feedback/?.lang=%s'
				}
			};
			
			var count = 0
			for (var key in buttons) {
				var aboutButton = Ti.UI.createButton({
					buttonKey: key,
					top: 159 + (count * 52),
					width: 320,
					height: 52,
					backgroundImage: 'images/about_btn.png'
				});
				
				aboutButton.add(Ti.UI.createLabel({
					buttonKey: key,
					text: buttons[key].text,
					color: '#D9D9D9',
					top: 16,
					left: 26,
					height: 20,
					width: 260,
					font: { fontSize: 19, fontFamily: 'Helvetica' }
				}));
				
				aboutButton.addEventListener('click', function(e) {
					meme.ui.openLinkOnSafari({
						url: String.format(buttons[e.source.buttonKey].url, meme.app.lang())
					});
				});
				
				aboutWindow.add(aboutButton);
				
				count++;
			}
		};
		
		var createFooter = function() {
			var footerView = Ti.UI.createView({
				height: 41,
				width: 320,
				backgroundColor: 'black',
				bottom: 0
			});
			aboutWindow.add(footerView);
			
			var copyrightLabel = Ti.UI.createLabel({
				text: L('about_copyright'),
				color: '#4E4E4E',
				font: { fontSize: 11, fontFamily: 'Helvetica' },
				width: 320,
				textAlign: 'center'
			});
			footerView.add(copyrightLabel);
		};
		
		return {
			open: open
		};
	}();
	
})();