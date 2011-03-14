(function(){
	
	var postWindow = null;
	
	meme.ui.openPostWindow = function() {
		postWindow = Ti.UI.createWindow({
			backgroundColor: 'white',
			left: 0,
			top: 0,
			height: 480,
			width: 320
		});
		
		createPostWindowFields();
		createPostWindowButtons();
		createPostWindowActivityIndicator();
		
		postWindow.open();
	}
	
	var getTitle, getText;
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
			clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ONFOCUS
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
			//suppressReturn: false
		});
		postWindow.add(textField);
		
		getTitle = function() {
			return titleField.value;
		};
		
		getText = function() {
			return textField.value;
		};
	};
	
	var createPostWindowButtons = function() {
		var flashlightButton = Ti.UI.createButton({
			image: 'images/post_button_flashlight.png',
			top: 436,
			left: 0,
			width: 145, 
			height: 44
		});
		postWindow.add(flashlightButton);
	
		var pictureButton = Ti.UI.createButton({
			image: 'images/post_button_picture.png',
			top: 436,
			left: 145,
			width: 69, 
			height: 44
		});
		postWindow.add(pictureButton);
		
		var postButton = Ti.UI.createButton({
			image: 'images/post_button_submit.png',
			top: 436,
			left: 214,
			width: 106, 
			height: 44
		});
		postButton.addEventListener('click', function(e) {
			showProgress('Posting on Meme');
			var content = '';
			if (getTitle() != ''){
				content += '<strong>' + getTitle() + '</strong><p>\n</p>';
			}
			content += getText();
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
		});
		postWindow.add(postButton);
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
	
})();