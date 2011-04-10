(function(){
	
	var flashlightWindow;
	
	meme.ui.openFlashlightWindow = function() {
		flashlightWindow = Ti.UI.createWindow({
			backgroundColor: 'white',
			left: 0,
			top: 460,
			height: 460,
			width: 320
		});
		
		createFlashlightWindowHeader();
		createFlashlightWindowTabBar();
		createFlashlightWindowResults();
		createFlashlightWindowFooter();
		
		flashlightWindow.addEventListener('close', function() {
			flashlightWindow = null;
		});
		
		flashlightWindow.open(Ti.UI.createAnimation({
			duration: 250,
			top: 0 
		}));
		
		setTimeout(function() {
			searchFieldFocus();
		}, 250);
	};
	
	var getSearchText, searchFieldFocus, startLoading, stopLoading;
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
				top: 460 
			}));
		});
		flashlightWindow.add(flashlightButton);
		
		var lampBright = Titanium.UI.createImageView({
			image: 'images/lamp_bright.png',
			left: 1,
			top: 0,
			width: 37,
			height: 38,
			zIndex: 3,
			visible: false
		});
		lampBright.animate(Titanium.UI.createAnimation({
			transform: Ti.UI.create2DMatrix({
				scale: 0.8
			}),
			duration: 300,
			autoreverse: true,
			repeat: 1000
		}));
		flashlightWindow.add(lampBright);
		
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
			color: '#666666',
			font: { fontSize: 14, fontFamily: 'Georgia', fontStyle: 'italic' },
			width: 184,
			height: 33,
			top: 5,
			left: 14,
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
			keyboardType: Ti.UI.KEYBOARD_DEFAULT,
			returnKeyType: Titanium.UI.RETURNKEY_SEARCH,
			clearButtonMode: Titanium.UI.INPUT_BUTTONMODE_ONFOCUS,
			autocapitalization: false
		});
		
		var observer = meme.ui.inactivityObserver({
			fieldToObserve: searchField,
			inactivityTimeout: 1000,
			inactivityTimeoutAction: function() {
				searchField.blur();
				searchField.fireEvent('return');
			}
		});
		
		searchField.addEventListener('return', function(e) {
			observer.pauseObserver();
			handleFlashlightSearch(e);
		});
		
		flashlightField.add(searchField);
		
		getSearchText = function() {
			return searchField.value;
		};
		
		searchFieldFocus = function() {
			searchField.focus();
		};
		
		startLoading = function() {
			lampBright.show();
		};
		
		stopLoading = function() {
			lampBright.hide();
		};
	};
	
	var showTabBar, hideTabBar;
	var createFlashlightWindowTabBar = function() {
		var flashlightTabBar = Titanium.UI.createView({
			backgroundColor: '#252525',
			top: 0,
			left: 0,
			width: 320,
			height: 35,
			zIndex: 0
		});
		flashlightWindow.add(flashlightTabBar);
		
		// tabs are currently implemented for photos only
		// but I'm preparing the structure to implement for videos as well
		var flashlightTabBarButtonLocations = { 
			photo: { 
				flickr: { width: 85, left: 80 }, 
				web: { width: 77, left: 165 }
			}
		};
		
		var flashlightTabBarButtons = { 
			photo: { flickr: null, web: null }, 
			video: {}, 
			web: {}, 
			twitter: {}
		};
		
		for (var key in flashlightTabBarButtons) {
			for (var subKey in flashlightTabBarButtons[key]) {
				flashlightTabBarButtons[key][subKey] = Titanium.UI.createButton({
					tabType: key,
					tabSubType: subKey,
					image: 'images/flashlight_tabbar_' + key + '_' + subKey + '_off@2x.png',
					width: flashlightTabBarButtonLocations[key][subKey].width,
					height: 28,
					top: 3,
					left: flashlightTabBarButtonLocations[key][subKey].left
				});
				flashlightTabBarButtons[key][subKey].addEventListener('click', handleFlashlightSearch);
			}
		}
		
		showTabBar = function(showKey, enableButton) {
			Ti.API.debug('show tabBar for key [' + showKey + ']');
			
			// remove all buttons first
			for (var key in flashlightTabBarButtons) {
				for (var subKey in flashlightTabBarButtons[key]) {
					Ti.API.debug('remove button [' + key + '][' + subKey + ']');
					
					// turn off before removing
					flashlightTabBarButtons[key][subKey].image = 'images/flashlight_tabbar_' + key + '_' + subKey + '_off@2x.png';
					
					// then remove
					flashlightTabBar.remove(flashlightTabBarButtons[key][subKey]);
				}
			}
			
			// then add the right ones
			for (var button in flashlightTabBarButtons[showKey]) {
				Ti.API.debug('add button [' + showKey + '][' + button + ']');
				
				// turn button on if necessary
				if (button == enableButton) {
					flashlightTabBarButtons[showKey][button].image = 'images/flashlight_tabbar_' + showKey + '_' + button + '_on@2x.png';
				}
				
				// add to tab bar
				flashlightTabBar.add(flashlightTabBarButtons[showKey][button]);
			}
			flashlightTabBar.animate({ top: 43 });
		};
		
		hideTabBar = function() {
			if (flashlightTabBar) {
				flashlightTabBar.animate({ top: 0 });
			}
		};
	};
	
	var setResultsWindowMax, setResultsWindowMin, setFlashlightRows, showNoResultsView;
	var createFlashlightWindowResults = function(rows) {
		var flashlightTableView = Ti.UI.createTableView({
			top: 43, 
			height: 357,
			width: 320, 
			separatorColor: 'gray',
			visible: false
		});
		flashlightWindow.add(flashlightTableView);
		
		var noResultsView = Ti.UI.createView({
			top: 78,
			height: 322,
			width: 320,
			visible: false
		});
		flashlightWindow.add(noResultsView);
		
		var titleLabel = Ti.UI.createLabel({
			top: 108,
			left: 40,
			width: 240, 
			height: 58, 
			text: 'Your terms did not match any results.',
			color: '#923385',
			font: { fontSize: 25, fontFamily: 'Helvetica', fontWeight: 'bold' }
		});
		noResultsView.add(titleLabel);
		
		var subtitleLabel = Ti.UI.createLabel({
			top: 178,
			left: 40,
			width: 240, 
			height: 16, 
			text: 'Tips:',
			color: '#222222',
			font: { fontSize: 12, fontFamily: 'Helvetica', fontWeight: 'bold' }
		});
		noResultsView.add(subtitleLabel);
		
		var tipsLabel = Ti.UI.createLabel({
			top: 198,
			left: 40,
			width: 240, 
			height: 40, 
			text: 'Make sure all words are spelled correctly.\nTry different keywords.\nTry being more specific.',
			color: '#666666',
			font: { fontSize: 11, fontFamily: 'Helvetica' }
		});
		noResultsView.add(tipsLabel);
		
		showNoResultsView = function() {
			flashlightTableView.hide();
			noResultsView.show();
		};
		
		setResultsWindowMax = function() {
			Ti.API.debug('maximized result window');
			flashlightTableView.animate({
				top: 43, 
				height: 357
			});
		};
		
		setResultsWindowMin = function() {
			Ti.API.debug('minimized result window');
			flashlightTableView.animate({
				top: 78,
				height: 322
			});
		};
		
		setFlashlightRows = function(rows) {
			noResultsView.hide();
			flashlightTableView.setData(rows);
			flashlightTableView.show();
			flashlightTableView.scrollToTop(0);
		}
	};
	
	var showArrow, buttonBarAnimation;
	var createFlashlightWindowFooter = function() {
		var footerView = Ti.UI.createView({
			bottom: 0,
			height: 60,
			width: 320,
			backgroundImage: 'images/old/bg_flashlight_bar.png'
		});
		flashlightWindow.add(footerView);
		
		var flashlightButtons = { photo: null, video: null, web: null, twitter: null };
		var i = 0;
		for (var key in flashlightButtons) {
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
			backgroundImage: 'images/old/bg_flashlight_bar_arrow.png',
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
		
		buttonBarAnimation = function(type) {
			// enable right button
			for (var key in flashlightButtons) {
				flashlightButtons[key].backgroundImage = 'images/flashlight_tab_' + key + '_off.png';
			}
			flashlightButtons[type].backgroundImage = 'images/flashlight_tab_' + type + '_on.png';
			
			// define arrow position
			showArrow(6 + flashlightButtons[type].left);
		};
	};
	
	var createFlashlightWindowResultRowFlickrPhoto = function(data) {
		if (data) {
			var row = Ti.UI.createTableViewRow({
				height: 78
			});
			row.addEventListener('click', handleFlashlightItemSelection);
			
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
				defaultImage: 'images/old/default_img.png'
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
	
	var createFlashlightWindowResultRowWebPhoto = function(data) {
		if (data) {
			var row = Ti.UI.createTableViewRow({
				height: 78
			});
			row.addEventListener('click', handleFlashlightItemSelection);
			
			var title = Ti.UI.createLabel({
				text: meme.util.stripHtmlEntities(data.abstract),
				color: '#863486',
				height: 55,
				width: 200,
				left: 110,
				textAlign: 'left',
				font: { fontSize: 12, fontFamily: 'Helvetica', fontWeight: 'regular' }
			});
			row.add(title);
			
			var image = Ti.UI.createImageView({
				image: data.thumbnail_url,
				backgroundColor: 'black',
				height: 75,
				width: 100,
				left: 2,
				defaultImage: 'images/old/default_img.png'
			});
			row.add(image);

			row.add(Ti.UI.createView({
				height: 78,
				width: 310,
				zIndex: 2,
				title: meme.util.stripHtmlEntities(data.abstract),
				fullPhoto: data.url,
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
			row.addEventListener('click', handleFlashlightItemSelection);

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
				defaultImage: 'images/old/default_img.png'
			});
			row.add(image);

			var imgPlayButton = Titanium.UI.createImageView({
	            image: 'images/old/play.png',
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
			row.addEventListener('click', handleFlashlightItemSelection);
			
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
			row.addEventListener('click', handleFlashlightItemSelection);

			var avatar = Ti.UI.createImageView({
				image: avatarUrl,
				backgroundColor: 'black',
				height: 48,
				width: 48,
				top: 10,
				left: 10,
				defaultImage: 'images/old/default_img_avatar.png'
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
			startLoading();
			var apiQuery, createRow, tabBarAnimation;
			
			// settings defaults
			if (!e.source.tabType) {
				e.source.tabType = 'photo';
			}
			
			if (!e.source.tabSubType) {
				e.source.tabSubType = 'flickr';
			}
			
			// check who triggered the event and configure actions
			if (e.source.tabType == 'photo') {
				if (e.source.tabSubType == 'flickr') {
					apiQuery = meme.api.flashlightFlickrPhoto;
					createRow = createFlashlightWindowResultRowFlickrPhoto;
				} else if (e.source.tabSubType == 'web') {
					apiQuery = meme.api.flashlightWebPhoto;
					createRow = createFlashlightWindowResultRowWebPhoto;
				}
				tabBarAnimation = function() {
					setResultsWindowMin();
					hideTabBar();
					showTabBar(e.source.tabType, e.source.tabSubType);
				};
			} else if (e.source.tabType == 'video') {
				apiQuery = meme.api.flashlightVideo;
				createRow = createFlashlightWindowResultRowVideo;
				tabBarAnimation = function() {
					setResultsWindowMax();
					hideTabBar();
				};
			} else if (e.source.tabType == 'web') {
				apiQuery = meme.api.flashlightWeb;
				createRow = createFlashlightWindowResultRowWeb;
				tabBarAnimation = function() {
					setResultsWindowMax();
					hideTabBar();
				};
			} else if (e.source.tabType == 'twitter') {
				apiQuery = meme.api.flashlightTwitter;
				createRow = createFlashlightWindowResultRowTwitter;
				tabBarAnimation = function() {
					setResultsWindowMax();
					hideTabBar();
				};
			}
			
			buttonBarAnimation(e.source.tabType);
			
			// go!
			var results = apiQuery(getSearchText());
			if (results) {
				var rows = [];
				for (var i=0; i<results.length; i++) {
					rows.push(createRow(results[i]));
				}
				setFlashlightRows(rows);
			} else {
				showNoResultsView();
			}
			tabBarAnimation();
			stopLoading();
		}
	};
	
	var handleFlashlightItemSelection = function(e) {
		Ti.API.debug('Flashlight item clicked [' + e.source.type + ']');
		meme.ui.alert({
			title: 'To Do',
			message: 'Not implemented yet :('
		});
		flashlightWindow.close(Ti.UI.createAnimation({
			duration: 250,
			top: 460 
		}));
	};
	
})();