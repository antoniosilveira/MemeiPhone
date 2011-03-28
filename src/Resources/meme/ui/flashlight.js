(function(){
	
	var flashlightWindow, flashlightTabBar, flashlightButtons, flashlightTableView;
	
	meme.ui.openFlashlightWindow = function() {
		flashlightWindow = Ti.UI.createWindow({
			backgroundColor: 'white',
			left: 0,
			top: 480,
			height: 480,
			width: 320
		});
		
		createFlashlightWindowHeader();
		createFlashlightWindowTabBar();
		createFlashlightWindowResults();
		createFlashlightWindowFooter();
		
		flashlightWindow.open(Ti.UI.createAnimation({
			duration: 250,
			top: 0 
		}));
		
		setTimeout(function() {
			searchFieldFocus();
		}, 250);
	};
	
	var getSearchText, searchFieldFocus;
	var createFlashlightWindowHeader = function() {
		var flashlightButton = Titanium.UI.createButton({
			image: 'images/flashlight_button.png',
			width: 114,
			height: 43,
			top: 0,
			left: 0,
			visible: true,
			zIndex: 1
		});
		flashlightButton.addEventListener('click', function(e) {
			searchField.blur();
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
			visible: true,
			zIndex: 1
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
		
		searchField.addEventListener('return', handleFlashlightSearch);
		
		getSearchText = function() {
			return searchField.value;
		};
		
		searchFieldFocus = function() {
			searchField.focus();
		}
	};
	
	var showTabBar, hideTabBars;
	var createFlashlightWindowTabBar = function() {
		// tabs are currently implemented for photos only
		// but I'm preparing the structure to implement for videos as well
		flashlightTabBar = { photo: null, video: null, web: null, twitter: null };
		
		flashlightTabBar['photo'] = Titanium.UI.createView({
			backgroundColor: '#2A2B34',
			top: 0,
			left: 0,
			width: 320,
			height: 35,
			zIndex: 0
		});
		flashlightWindow.add(flashlightTabBar['photo']);
		
		var flickrPhotoTabButton = Titanium.UI.createButton({
			tabType: 'photo',
			tabSubType: 'flickr',
			image: 'images/flashlight_tabbar_photo_flickr_off@2x.png',
			width: 85,
			height: 28,
			top: 3,
			left: 80
		});
		flickrPhotoTabButton.addEventListener('click', handleFlashlightSearch);
		flashlightTabBar['photo'].add(flickrPhotoTabButton);
		
		var webPhotoTabButton = Titanium.UI.createButton({
			tabType: 'photo',
			tabSubType: 'web',
			image: 'images/flashlight_tabbar_photo_web_off@2x.png',
			width: 77,
			height: 28,
			top: 3,
			left: 165
		});
		webPhotoTabButton.addEventListener('click', handleFlashlightSearch);
		flashlightTabBar['photo'].add(webPhotoTabButton);
		
		showTabBar = function(key) {
			flashlightTabBar[key].animate({ top: 43 });
		};
		
		hideTabBars = function() {
			for (key in flashlightTabBar) {
				if (flashlightTabBar[key]) {
					flashlightTabBar[key].animate({ top: 0 });
				}
			}
		};
	};
	
	var setResultsWindowMax, setResultsWindowMin, setFlashlightRows;
	var createFlashlightWindowResults = function(rows) {
		flashlightTableView = Ti.UI.createTableView({
			top: 43, 
			height: 377,
			width: 320, 
			separatorColor: 'gray',
			visible: false
		});
		flashlightWindow.add(flashlightTableView);
		
		setResultsWindowMax = function() {
			Ti.API.debug('maximized result window');
			flashlightTableView.animate({ top: 43, height: 377 });
		};
		
		setResultsWindowMin = function() {
			Ti.API.debug('minimized result window');
			flashlightTableView.animate({ top: 78, height: 342 });
		};
		
		setFlashlightRows = function(rows) {
			flashlightTableView.setData(rows);
			flashlightTableView.show();
		}
	};
	
	var showArrow;
	var createFlashlightWindowFooter = function() {
		var footerView = Ti.UI.createView({
			bottom: 0,
			height: 60,
			width: 320,
			backgroundImage: 'images/bg_flashlight_bar.png'
		});
		flashlightWindow.add(footerView);
		
		flashlightButtons = { photo: null, video: null, web: null, twitter: null };
		var i = 0;
		for (key in flashlightButtons) {
			flashlightButtons[key] = Titanium.UI.createButton({
				tabType: key,
				backgroundColor: 'transparent',
				backgroundImage: 'images/flashlight_tab_' + key + '_off.png',
				width: 32,
				height: 32,
				top: 14,
				left: 24 + (80 * i),
				visible: true
			});
			flashlightButtons[key].addEventListener('click', handleFlashlightSearch);
			footerView.add(flashlightButtons[key]);
			i++;
		}
		
		var arrow = Ti.UI.createView({
			backgroundImage: 'images/bg_flashlight_bar_arrow.png',
			width: 17,
			height: 10,
			bottom: 56,
			left: -17,
			zIndex: 3,
			visible: false
		});
		flashlightWindow.add(arrow);
		
		showArrow = function(left) {
			arrow.show();
			arrow.animate({ left: left });
		};
	};
	
	var createFlashlightWindowResultRowPhoto = function(data) {
		if (data) {
			var row = Ti.UI.createTableViewRow({
				height:78
			});
			row.addEventListener('click', function(e) {
				flashlightWindow.close(Ti.UI.createAnimation({
					duration: 250,
					top: 480 
				}));
			});
			
			var thumb = 'http://farm' + data.farm + '.static.flickr.com/' + data.server + '/' + data.id + '_' + data.secret + '_t_d.jpg';
			var fullPhoto = 'http://farm' + data.farm + '.static.flickr.com/' + data.server + '/' + data.id + '_' + data.secret + '.jpg';
			var title = Ti.UI.createLabel({
				text: data.title,
				color: '#863486',
				height: 55,
				width: 200,
				left: 110,
				textAlign: 'left',
				font: { fontSize: 12, fontFamily: 'Helvetica', fontWeight: 'regular' }
			});
			row.add(title);
			
			var image = Ti.UI.createImageView({
				image: thumb,
				backgroundColor: 'black',
				height: 75,
				width: 100,
				left: 2,
				defaultImage: 'images/default_img.png'
			});
			row.add(image);

			row.add(Ti.UI.createView({
				height: 78,
				width: 310,
				zIndex: 2,
				title: data.title,
				fullPhoto: fullPhoto,
				type: 'photo'
			}));
			
			return row;
		}
	};
	
	var createFlashlightWindowResultRowVideo = function(data) {
		if (data) {
			var thumb = data.thumbnails.thumbnail[0].content;
			var thumbFull = data.thumbnails.thumbnail[4].content;

			var row = Ti.UI.createTableViewRow({
				height: 78
			});
			row.addEventListener('click', function(e) {
				flashlightWindow.close(Ti.UI.createAnimation({
					duration: 250,
					top: 480 
				}));
			});

			var title = Ti.UI.createLabel({
				text: data.title,
				color: '#863486',
				height:	42,
				width: 192,
				top: 10,
				left: 110,
				textAlign: 'left',
				font: { fontSize: 12, fontFamily: 'Helvetica', fontWeight: 'regular' }
			});
			row.add(title);
			
			var duration = Ti.UI.createLabel({
				text: meme.util.secondsToHms(data.duration),
				color: '#666',
				height: 10,
				width: 50,
				top: 60,
				left: 110,
				textAlign: 'left',
				font: { fontSize: 11, fontFamily: 'Helvetica', fontWeight: 'regular' }
			});
			row.add(duration);

			var image = Ti.UI.createImageView({
				image: thumb,
				backgroundColor: 'black',
				height: 75,
				width: 100,
				left: 2,
				defaultImage: 'images/default_img.png'
			});
			row.add(image);

			var imgPlayButton = Titanium.UI.createImageView({
	            image: 'images/play.png',
	            top: 20,
	            left: 30,
	            width: 37,
	            height: 37
	        });
	        row.add(imgPlayButton);

			row.add(Ti.UI.createView({
				height: 78,
				width: 310,
				zIndex: 2,
				title: data.title,
				content: data.content,
				image: thumbFull,
				videoId: data.id,
				videoLink: data.url,
				type: 'video'
			}));

			return row;
		}
		
	};
	
	var createFlashlightWindowResultRowWeb = function(data) {
		if (data) {
			var row = Ti.UI.createTableViewRow({
				height: 78
			});
			row.addEventListener('click', function(e) {
				flashlightWindow.close(Ti.UI.createAnimation({
					duration: 250,
					top: 480 
				}));
			});
			
			var title = Ti.UI.createLabel({
				text: meme.util.stripHtmlEntities(data.title),
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
					text: meme.util.stripHtmlEntities(data.abstract),
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
				title: meme.util.stripHtmlEntities(data.title),
				abstract: meme.util.stripHtmlEntities(data.abstract),
				url: data.url,
				type: 'text'
			}));

			return row;
		}
	};
	
	var createFlashlightWindowResultRowTwitter = function(data) {
		if (data) {
			var screenName = data.from_user;
			var avatarUrl = data.profile_image_url;
			var statusId = data.id_str;

			var row = Ti.UI.createTableViewRow({
				height: 78
			});
			row.addEventListener('click', function(e) {
				flashlightWindow.close(Ti.UI.createAnimation({
					duration: 250,
					top: 480 
				}));
			});

			var avatar = Ti.UI.createImageView({
				image: avatarUrl,
				backgroundColor: 'black',
				height: 48,
				width: 48,
				top: 10,
				left: 10,
				defaultImage: 'images/default_img_avatar.png'
			});
			row.add(avatar);

			var username = Ti.UI.createLabel({
				text: '@' + screenName,
				color: '#863486',
				width: 250,
				height: 15,
				top: 8,
				left: 67,
				textAlign: 'left',
				font: { fontSize: 12, fontFamily: 'Helvetica', fontWeight: 'bold' }
			});
			row.add(username);

			var tweet = Ti.UI.createLabel({
				text: data.text,
				color: '#333',
				height: 52,
				width: 262,
				top: 23,
				left: 67,
				textAlign: 'left',
				font: { fontSize: 11, fontFamily: 'Helvetica', fontWeight: 'regular' }
			});
			row.add(tweet);
			
			row.add(Ti.UI.createView({
				height: 78,
				width: 310,
				zIndex: 2,
				username: '@' + screenName,
				tweet: data.text,
				timestamp: data.created_at.substr(0,25),
				app: data.source,
				avatar: avatarUrl,
				link: 'http://twitter.com/#!/' + screenName + '/status/' + statusId + '/',
				type: 'twitter'
			}));
			
			return row;
		}
	};
	
	var handleFlashlightSearch = function(e) {
		Ti.API.debug(JSON.stringify(e));
		Ti.API.debug(JSON.stringify(e.source.tabType));
		Ti.API.debug(JSON.stringify(e.source.tabSubType));
		
		if (getSearchText()) {
			var apiQuery, createRow, tabBarAnimation;
			
			if (!e.source.tabType) {
				e.source.tabType = 'photo';
			}
			
			if (e.source.tabType == 'photo') {
				apiQuery = meme.api.flashlightPhoto;
				createRow = createFlashlightWindowResultRowPhoto;
				tabBarAnimation = function() {
					setResultsWindowMin();
					hideTabBars();
					showTabBar(e.source.tabType);
				};
			} else if (e.source.tabType == 'video') {
				apiQuery = meme.api.flashlightVideo;
				createRow = createFlashlightWindowResultRowVideo;
				tabBarAnimation = function() {
					setResultsWindowMax();
					hideTabBars();
				};
			} else if (e.source.tabType == 'web') {
				apiQuery = meme.api.flashlightWeb;
				createRow = createFlashlightWindowResultRowWeb;
				tabBarAnimation = function() {
					setResultsWindowMax();
					hideTabBars();
				};
			} else if (e.source.tabType == 'twitter') {
				apiQuery = meme.api.flashlightTwitter;
				createRow = createFlashlightWindowResultRowTwitter;
				tabBarAnimation = function() {
					setResultsWindowMax();
					hideTabBars();
				};
			}
			
			// enable right button
			for (key in flashlightButtons) {
				flashlightButtons[key].backgroundImage = 'images/flashlight_tab_' + key + '_off.png';
			}
			flashlightButtons[e.source.tabType].backgroundImage = 'images/flashlight_tab_' + e.source.tabType + '_on.png';
			
			// define arrow position
			showArrow(6 + flashlightButtons[e.source.tabType].left);
			
			// go!
			var results = apiQuery(getSearchText());
			var rows = [];
			for (var i=0; i<results.length; i++) {
				rows.push(createRow(results[i]));
			}
			setFlashlightRows(rows);
			tabBarAnimation();
		}
	};
	
})();