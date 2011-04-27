(function(){
	
	meme.ui.flashlight = {};
	
	meme.ui.flashlight.window = function() {
		
		var flashlightWindow;

		var open = function() {
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
			
			meme.analytics.record(meme.analytics.FLASHLIGHT_SEARCH);
		};
		
		var close = function() {
			flashlightWindow.close(Ti.UI.createAnimation({
				duration: 250,
				top: 460 
			}));
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

			var loadingView = Titanium.UI.createView({
				backgroundImage: 'images/bg_radial.png',
				left: 0,
				top: 43,
				width: 320,
				height: 420,
				zIndex: 4,
				opacity: 0.0
			});
            flashlightWindow.add(loadingView);
			
			var activityIndicator = Ti.UI.createActivityIndicator({
				top: 135, 
				left: 110,
				width: 100,
				height: 100,
				color: 'black',
				zIndex: 5,
				style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG
			});
			loadingView.add(activityIndicator);
			
			var loadingLabel = Ti.UI.createLabel({
			    width: 320,
			    height: 22,
			    top: 210,
			    left: 0,
			    textAlign: 'center',
                text: L('flashlight_loading_results'),
				font: { fontSize: 14, fontFamily: 'Helvetica', fontStyle: 'bold' }
			});
			loadingView.add(loadingLabel);
            activityIndicator.show();
            
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
				hintText: L('flashlight_search'),
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
				loadingView.animate(Ti.UI.createAnimation({
				    opacity: 1.0,
				    duration: 1
				}));
			};

			stopLoading = function() {
				lampBright.hide();
				loadingView.animate(Ti.UI.createAnimation({
				    opacity: 0.0,
				    duration: 300
				}));
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
				top: 98,
				left: 40,
				width: 240, 
				height: 58, 
				text: L('flashlight_search_noresults_title'),
				color: '#923385',
				font: { fontSize: 25, fontFamily: 'Helvetica', fontWeight: 'bold' }
			});
			noResultsView.add(titleLabel);

			var subtitleLabel = Ti.UI.createLabel({
				top: 168,
				left: 40,
				width: 240, 
				height: 16, 
				text: L('flashlight_search_noresults_tips'),
				color: '#222222',
				font: { fontSize: 12, fontFamily: 'Helvetica', fontWeight: 'bold' }
			});
			noResultsView.add(subtitleLabel);

			var tipsLabel = Ti.UI.createLabel({
				top: 188,
				left: 40,
				width: 240, 
				height: 'auto', 
				text: L('flashlight_search_noresults_tip_spelling') + '\n' + L('flashlight_search_noresults_tip_keywords') + '\n' + L('flashlight_search_noresults_tip_specific'),
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
						createRow = meme.ui.flashlight.rows.createFlickrPhotoRows;
					} else if (e.source.tabSubType == 'web') {
						apiQuery = meme.api.flashlightWebPhoto;
						createRow = meme.ui.flashlight.rows.createWebPhotoRows;
					}
					tabBarAnimation = function() {
						setResultsWindowMin();
						hideTabBar();
						showTabBar(e.source.tabType, e.source.tabSubType);
					};
				} else if (e.source.tabType == 'video') {
					apiQuery = meme.api.flashlightVideo;
					createRow = meme.ui.flashlight.rows.createVideoRows;
					tabBarAnimation = function() {
						setResultsWindowMax();
						hideTabBar();
					};
				} else if (e.source.tabType == 'web') {
					apiQuery = meme.api.flashlightWeb;
					createRow = meme.ui.flashlight.rows.createWebRows;
					tabBarAnimation = function() {
						setResultsWindowMax();
						hideTabBar();
					};
				} else if (e.source.tabType == 'twitter') {
					apiQuery = meme.api.flashlightTwitter;
					createRow = meme.ui.flashlight.rows.createTwitterRows;
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
		
		return {
			open: open,
			close: close
		};
		
	}();
	
})();

Ti.include(
	'/meme/ui/flashlight/flashlight_rows.js'
);