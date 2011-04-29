(function(){
	
	meme.ui.home = {};
	
	meme.ui.home.window = function() {
		
		var homeWindow, loggedOutView, loggedInView;

		var open = function() {
			if (!meme.config.tests_enabled) {
				Ti.API.info('Home window opened, starting application...');

				homeWindow = Titanium.UI.createWindow({
				    backgroundImage: 'images/bg.png',
					orientationModes: [Ti.UI.PORTRAIT],
					height: 460,
					width: 320
				});

				createHeader();
				createLoggedInView();
				createloggedOutView();

				homeWindow.open();

				Ti.API.debug('About to refresh home window');
				refresh();
				
				meme.analytics.record(meme.analytics.APP_STARTED);
			}
		};
		
		var show = function() {
			homeWindow.animate({
				duration: 250,
				left: 0
			});
		};

		var refresh = function() {
			setTimeout(function() {
				var showView = loggedOutView, hideView = loggedInView;
				var showOrHideLogoutBar = hideLogoutBar;
				if (meme.auth.oadapter && meme.auth.oadapter.isLoggedIn()) {
					showView = loggedInView; hideView = loggedOutView;
					showOrHideLogoutBar = showLogoutBar;
					configureLogoutBar();
					configureLoggedInView();
					Ti.API.info('hi, welcome to meme! user is [' + meme.app.userInfo().name + ']');
				}

				var animation = Ti.UI.createAnimation({
					duration: 250,
					top: 460
				});
				animation.addEventListener('complete', function() {
					showView.animate({ duration: 250, top: 240 });
				});
				hideView.animate(animation);
				showOrHideLogoutBar();
			}, 125);
		};

		var configureLogoutBar, showLogoutBar, hideLogoutBar;
		var createHeader = function() {
			var logoView = Ti.UI.createView({
				backgroundImage: 'images/' + meme.app.lang() + '/logo_big.png',
				top: 57,
				left: 28,
				width: 263,
				height: 146,
				visible: true
			});
			homeWindow.add(logoView);

			var logoutBarView = Ti.UI.createView({
				backgroundImage: 'images/home_signed_bg.png',
				top: -33,
				left: 0,
				width: 320,
				height: 33
			});
			homeWindow.add(logoutBarView);
			
			// left
			var iButton = Ti.UI.createButton({
				top: 6,
				left: 9,
				style: Titanium.UI.iPhone.SystemButton.INFO_LIGHT
			});
			iButton.addEventListener('click', meme.ui.about.window.open);
			logoutBarView.add(iButton);
			
			// right
			var signOutLabel = Ti.UI.createLabel({
				top: 0,
				right: 9,
				height: 31,
				width: 'auto',
				color: '#9F1392',
				textAlign: 'right',
				font: { fontSize: 11, fontFamily: 'Helvetica' },
				text: L('home_sign_out')
			});
			signOutLabel.addEventListener('click', function(e) {
				meme.auth.oadapter.logout('meme', function() {
					refresh();
				});
			});
			logoutBarView.add(signOutLabel);
			
			// middle
			var middleContainerView = Ti.UI.createView({
				top: 0,
				left: iButton.left + iButton.width,
				width: 320 - (iButton.left + iButton.width + signOutLabel.width + signOutLabel.right),
				height: 33
			});
			logoutBarView.add(middleContainerView);
			
			var textBarView = Ti.UI.createView({
				width: 'auto',
				height: 33
			});
			middleContainerView.add(textBarView);

			var signedInAsLabel = Ti.UI.createLabel({
				top: 8,
				left: 0,
				height: 14,
				width: 'auto',
				color: '#999',
				font: { fontSize: 10, fontFamily: 'Helvetica' },
				text: L('home_signed_in_as')
			});
			textBarView.add(signedInAsLabel);

			var usernameLabel = Ti.UI.createLabel({
				top: 9,
				left: signedInAsLabel.width + 4,
				height: 14,
				width: 'auto',
				color: 'white',
				font: { fontSize: 12, fontFamily: 'Helvetica', fontWeight: 'Bold' }
			});
			textBarView.add(usernameLabel);

			showLogoutBar = function() {
				logoutBarView.animate({ top: 0 });
				logoView.animate({ top: 75 });
			};

			hideLogoutBar = function() {
				logoutBarView.animate({ top: -33 });
				logoView.animate({ top: 57 });
			};

			configureLogoutBar = function() {
				usernameLabel.text = meme.app.userInfo().name;
			};
		};

		var configureLoggedInView;
		var createLoggedInView = function() {
			loggedInView = Ti.UI.createView({
				top: 460,
				left: 0,
				width: 320, 
				height: 220
			});
			homeWindow.add(loggedInView);

			var createPostButton = Titanium.UI.createButton({
				image: 'images/' + meme.app.lang() + '/home_button_create_post.png',
				left: 0,
				top: 0,
				width: 320, 
				height: 110
			});
			createPostButton.addEventListener('click', function() {
				meme.ui.post.window.open();
				homeWindow.animate({
					duration: 250,
					left: -320
				});
			});
			
			loggedInView.add(createPostButton);

			var yourBlogButton = Titanium.UI.createButton({
				image: 'images/' + meme.app.lang() + '/home_button_your_blog.png',
				left: 0,
				top: 110,
				width: 320, 
				height: 110
			});

			var blogUrlLabel = Ti.UI.createLabel({
				top: 36,
				left: 26,
				color: 'white',
				font: { fontSize: 14, fontFamily:'Gotham Rounded', fontWeight: 'Light' }
			});
			yourBlogButton.add(blogUrlLabel);
			yourBlogButton.addEventListener('click', function() {
				meme.ui.openLinkOnSafari({
					url: 'http://' + blogUrlLabel.text
				});
			});
			loggedInView.add(yourBlogButton);

			configureLoggedInView = function() {
				blogUrlLabel.text = 'me.me/' + meme.app.userInfo().name;
			};
		};

		var createloggedOutView = function() {
			loggedOutView = Ti.UI.createView({
				top: 460,
				left: 0,
				width: 320, 
				height: 220
			});
			homeWindow.add(loggedOutView);

			var tryNowButton = Titanium.UI.createButton({
				image: 'images/' + meme.app.lang() + '/home_button_tryitnow.png',
				left: 0,
				top: 0,
				width: 320, 
				height: 110
			});
			tryNowButton.addEventListener('click', function() {
				meme.analytics.record(meme.analytics.OPEN_SAFARI_CREATE_ACCOUNT);
				
				meme.ui.openLinkOnSafari({
					title: L('home_try_it_now_alert_title'),
					message: L('home_try_it_now_alert_message'),
					url: 'http://meme.yahoo.com/confirm'
				});
			});
			loggedOutView.add(tryNowButton);

			var signInButton = Titanium.UI.createButton({
				image: 'images/' + meme.app.lang() + '/home_button_signin.png',
				left: 0,
				top: 110,
				width: 320, 
				height: 110
			});
			loggedOutView.add(signInButton);

			var signInButtonClick = function(continuation) {
				meme.analytics.record(meme.analytics.SIGN_IN);
				var clickTimeoutSignIn = 0;
				signInButton.addEventListener('click', function() {
					clearTimeout(clickTimeoutSignIn);
					clickTimeoutSignIn = setTimeout(function() {
						continuation();
					}, 100);
				});
			};
			meme.auth.attachLogin(signInButtonClick, refresh);
		};
		
		return {
			open: open,
			show: show,
			refresh: refresh
		};
		
	}();
	
})();