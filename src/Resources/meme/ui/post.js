(function(){
	
	var postWindow = null;
	
	meme.ui.openPostWindow = function() {
		postWindow = Ti.UI.createWindow({
			backgroundColor: 'white',
			left: 320,
			top: 0,
			height: 480,
			width: 320
		});
		
		createPostWindowFields();
		createPostWindowButtons();
		createPostWindowActivityIndicator();
		
		postWindow.open(Ti.UI.createAnimation({
			duration: 250,
			left: 0 
		}));
	};
	
	var getTitle, getText, setTextFieldHeight, closeKeyboard;
	var createPostWindowFields = function() {
		var titleField = Ti.UI.createTextField({
			hintText: 'add title',
			textAlign: 'left',
			verticalAlign: 'center',
			font: { fontSize: 20, fontFamily: 'Helvetica', fontWeight: 'bold' },
			width: 300,
			height: 45,
			top: 10,
			left: 10,
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
			keyboardType: Ti.UI.KEYBOARD_DEFAULT,
			returnKeyType: Titanium.UI.RETURNKEY_DONE
		});
		titleField.addEventListener('focus', function(e) {
			moveButtonBarUp();
		});
		titleField.addEventListener('blur', function(e) {
			moveButtonBarDown();
		});
		postWindow.add(titleField);
		
		var dottedLineView = Titanium.UI.createView({
			backgroundImage: 'images/dotted_line.png',
			top: 55,
			left: 0,
			width: 320,
			height: 2
		});
		postWindow.add(dottedLineView);
		
		var textField = Ti.UI.createTextArea({
			hintText: 'write your post here',
			height: 378,
			width: 320,
			left: 0,
			top: 57,
			font: { fontSize: 16, fontFamily: 'Helvetica', fontWeight: 'regular' },
			textAlign: 'left',
			keyboardType: Ti.UI.KEYBOARD_DEFAULT,
			clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ONFOCUS,
			suppressReturn: false
		});
		textField.addEventListener('focus', function(e) {
			moveButtonBarUp();
		});
		textField.addEventListener('blur', function(e) {
			moveButtonBarDown();
		});
		postWindow.add(textField);
		
		getTitle = function() {
			return titleField.value;
		};
		
		getText = function() {
			if (textField.value == undefined) {
				return '';
			}
			return textField.value;
		};
		
		setTextFieldHeight = function(height) {
			textField.height = height;
		};
		
		closeKeyboard = function() {
			textField.blur();
		};
	};
	
	var moveButtonBarUp, moveButtonBarDown;
	var createPostWindowButtons = function() {
		var closeButton = Titanium.UI.createButton({
			backgroundImage: 'images/btn_close_gray.png',
			width: 29,
			height: 29,
			top: 5,
			right: 5,
			zIndex: 10,
			visible: true
		});
		closeButton.addEventListener('click', function(e) {
			postWindow.close(Ti.UI.createAnimation({
				duration: 250,
				left: 320 
			}));
		});
		postWindow.add(closeButton);
		
		var buttonBar = Ti.UI.createView({
			bottom: 0,
			left: 0,
			width: 320,
			height: 44
		});
		postWindow.add(buttonBar);
		
		var flashlightButton = Ti.UI.createButton({
			image: 'images/post_button_flashlight.png',
			top: 0,
			left: 0,
			width: 145, 
			height: 44
		});
		flashlightButton.addEventListener('click', function(e) {
			meme.ui.alert({ title: 'TODO', message: 'Not implemented' });
		});
		buttonBar.add(flashlightButton);
	
		var pictureButton = Ti.UI.createButton({
			image: 'images/post_button_picture.png',
			top: 0,
			left: 145,
			width: 69, 
			height: 44
		});
		pictureButton.addEventListener('click', function(e) {
			Ti.Media.openPhotoGallery({
				saveToPhotoGallery: true, 
				showControls: true, 
				mediaTypes: [ Ti.Media.MEDIA_TYPE_PHOTO ]
			});
		});
		buttonBar.add(pictureButton);
		
		var postButton = Ti.UI.createButton({
			image: 'images/post_button_submit.png',
			top: 0,
			left: 214,
			width: 106, 
			height: 44
		});
		postButton.addEventListener('click', function(e) {
			createPost();
		});
		buttonBar.add(postButton);
		
		moveButtonBarUp = function() {
			buttonBar.animate({ bottom: 216, duration: 250 });
			setTextFieldHeight(162);
		};
		
		moveButtonBarDown = function() {
			buttonBar.animate({ bottom: 0, duration: 250 });
			setTextFieldHeight(378);
		};
	};
	
	var showProgress, hideProgress, updateProgress;
	var createPostWindowActivityIndicator = function() {
		var progressView = Ti.UI.createView({
			top: 180,
			width: 300,
			height: 80,
			borderRadius: 5,
			backgroundColor: 'black',
			visible: false,
			zIndex: 99
		});
		postWindow.add(progressView);
		
		var activityIndicator = Ti.UI.createActivityIndicator({
			top: 15, 
			left: 25, 
			height: 50, 
			width: 10, 
			style: Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN
		});
		progressView.add(activityIndicator);

		var progressBar = Ti.UI.createProgressBar({
			width: 150,
			height: 60,
			left: 55,
			top: 5,
			min: 0,
			max: 1,
			value: 0,
			style: Titanium.UI.iPhone.ProgressBarStyle.BAR,
			message: 'Posting on Meme',
			font: { fontSize: 16, fontWeight: 'bold' },
			color: 'white'
		});
		progressView.add(progressBar);
		
		var cancelPostButton = Ti.UI.createButton({
			backgroundImage: 'images/btn_back.png',
			backgroundLeftCap: 20,
			backgroundRightCap: 20,
			left: 210,
			top: 13,
			height: 52,
			width: 90,
		    title: 'Cancel',
			color: 'white',
			textAlign: 'center',
			font: { fontSize: 12, fontFamily: 'Helvetica', fontWeight: 'bold' },
			style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
		});
		progressView.add(cancelPostButton);
		
		showProgress = function(message) {
			progressView.show();
			activityIndicator.show();
			progressBar.show();
			progressBar.message = message;	
		};

		hideProgress = function(message) {
			progressView.hide();
			activityIndicator.hide();
			progressBar.hide();
			progressBar.message = '';
		};
		
		updateProgress = function(value) {
			progressBar.value = value;
		};
	};
	
	var createPost = function() {
		closeKeyboard();
		moveButtonBarDown();
		
		Ti.API.info('title is [' + getTitle() + '] and text is [' + getText() + ']');
		
		if ((getTitle() == '') && (getText() == '')) {
			meme.ui.alert({
				title: 'Oops...',
				message: 'What about writing something before posting?',
				buttonNames: [ 'Ok' ]
			});
		} else {
			showProgress('Posting on Meme');
			var content = '';
			if (getTitle() != '') {
				content += '<strong>' + getTitle() + '</strong><p>\n</p>';
			}
			content += getText();
			updateProgress(0.5);
			meme.api.createTextPost(content);
			updateProgress(1);
			hideProgress();

			meme.ui.alert({
				title: 'Success',
				message: 'Posted on Meme successfully!',
				buttonNames: [ 'Ok' ],
				onClick: function() {
					postWindow.close();
				}
			});
		}
	};
	
})();