(function(){
	
	var flashlightWindow, flashlightButtons;
	
	meme.ui.openFlashlightWindow = function() {
		flashlightWindow = Ti.UI.createWindow({
			backgroundColor: 'white',
			left: 0,
			top: 480,
			height: 480,
			width: 320
		});
		
		createFlashlightWindowHeader();
		createFlashlightWindowFooter();
		
		flashlightWindow.open(Ti.UI.createAnimation({
			duration: 250,
			top: 0 
		}));
	};
	
	var getSearchText;
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
		
		getSearchText = function() {
			return searchField.value;
		};
	};
	
	var createFlashlightWindowResults = function(rows) {
		var flashlightTableView = Ti.UI.createTableView({
			top: 43, 
			height: 377,
			width: 320, 
			separatorColor: 'gray'
		});
		flashlightWindow.add(flashlightTableView);
		flashlightTableView.setData(rows);
	};
	
	var createFlashlightWindowFooter = function() {
		var footerView = Ti.UI.createView({
			bottom: 0,
			height: 60,
			width: 320
		});
		flashlightWindow.add(footerView);
		
		flashlightButtons = { photo: null, video: null, web: null, twitter: null };
		var i = 0;
		for (key in flashlightButtons) {
			flashlightButtons[key] = Titanium.UI.createButton({
				tabIndex: i,
				tabType: key,
				image: 'images/flashlight_tab' + (i + 1) + '.png',
				width: 80,
				height: 60,
				top: 0,
				left: 0 + (80 * i),
				visible: true
			});
			flashlightButtons[key].addEventListener('click', onFlashlightTabClick);
			footerView.add(flashlightButtons[key]);
			i++;
		}
	};
	
	var createFlashlightWindowResultRowWeb = function(data) {
		if (data) {
			var row = Ti.UI.createTableViewRow({
				height: 78
			});
			
			var title = Ti.UI.createLabel({
				text: data.title,
				width: 310,
				height:15,
				top: 10,
				left:10,
				color: '#863486',
				textAlign: 'left',
				font: { fontSize: 12, fontFamily: 'Helvetica', fontWeight: 'bold' }
			});
			row.add(title);
			
			if (data.abstract != null) {
				var abstract = Ti.UI.createLabel({
					text: data.abstract,
					color: '#333',
					height: 50,
					width: 310,
					top: 25,
					left: 10,
					textAlign: 'left',
					font: { fontSize: 12, fontFamily: 'Helvetica', fontWeight: 'regular' }
				});
				row.add(abstract);
			}

			row.add(Ti.UI.createView({
				height: 78,
				width: 320,
				zIndex: 2,
				title: data.title,
				abstract: data.abstract,
				url: data.url,
				type: 'text'
			}));

			return row;
		}
	};
	
	var onFlashlightTabClick = function(e) {
		Ti.API.debug('clicked: ' + JSON.stringify(e.source.tabIndex));
		Ti.API.debug('clicked type: ' + JSON.stringify(e.source.tabType));

		if (getSearchText()) {
			var results = meme.api.flashlightWeb(getSearchText());

			var rows = [];
			for (var i=0; i<results.length; i++) {
				rows.push(createFlashlightWindowResultRowWeb(results[i]));
			}

			createFlashlightWindowResults(rows);
		}
	};
	
})();