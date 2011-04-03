(function(){
	
	var postWindow, postMedia;
	
	meme.ui.openPostWindow = function() {
		postWindow = Ti.UI.createWindow({
			backgroundColor: 'white',
			left: 320,
			top: 0,
			height: 460,
			width: 320
		});
		
		createPostWindowFields();
		createPostWindowButtons();
		createPostWindowAttachmentsView();
		createPostWindowActivityIndicator();
		
		postWindow.addEventListener('close', function() {
			postMedia = null;
		});
		
		postWindow.open(Ti.UI.createAnimation({
			duration: 250,
			left: 0 
		}));
	};
	
	// Paremeters
	// type: [image|video]
	// url: 'url of the video/image'
	// media: 'the actual media (photo only)'
	meme.ui.setPostMedia = function(data) {
		postMedia = data;
		setAttachmentButtonOn();
		addAttachmentPreview(data);
	};
	
	meme.ui.removePostMedia = function() {
		postMedia = null;
		setAttachmentButtonOff();
	};
	
	var getTitle, getText, setTextFieldHeight, closeKeyboard;
	var createPostWindowFields = function() {
		var topRoundedBackground = Titanium.UI.createView({
			backgroundImage: 'images/postarea_topbg.png',
			top: 0,
			left: 0,
			width: 320,
			height: 45
		});
		postWindow.add(topRoundedBackground);
		
		var titleField = Ti.UI.createTextField({
			hintText: 'add title',
			textAlign: 'left',
			verticalAlign: 'center',
			font: { fontSize: 20, fontFamily: 'Helvetica', fontWeight: 'bold' },
			width: 300,
			height: 45,
			top: 2,
			left: 16,
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
			keyboardType: Ti.UI.KEYBOARD_DEFAULT,
			returnKeyType: Titanium.UI.RETURNKEY_DONE,
			autocapitalization: false
		});
		titleField.addEventListener('focus', function(e) {
			moveButtonBarUp();
		});
		titleField.addEventListener('blur', function(e) {
			moveButtonBarDown();
			hideAttachments();
		});
		postWindow.add(titleField);
		
		var dottedLineView = Titanium.UI.createView({
			backgroundImage: 'images/postarea_line.png',
			top: 46,
			left: 0,
			width: 320,
			height: 1
		});
		postWindow.add(dottedLineView);
		
		var textField = Ti.UI.createTextArea({
			height: 368,
			width: 304,
			left: 8,
			top: 47,
			font: { fontSize: 16, fontFamily: 'Helvetica', fontWeight: 'regular' },
			textAlign: 'left',
			keyboardType: Ti.UI.KEYBOARD_DEFAULT,
			clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ONFOCUS,
			suppressReturn: false,
			autocapitalization: false
		});
		textField.addEventListener('focus', function(e) {
			moveButtonBarUp();
		});
		textField.addEventListener('blur', function(e) {
			moveButtonBarDown();
			hideAttachments();
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
			titleField.blur();
			textField.blur();
		};
	};
	
	var showAttachments, hideAttachments, addAttachmentPreview, attachmentsOn = false;
	var createPostWindowAttachmentsView = function() {
		var attachmentsView = Ti.UI.createView({
			backgroundImage: 'images/below_keyboard_bg.png',
			width: 320,
			height: 216,
			bottom: -216
		});
		postWindow.add(attachmentsView);
		
		var newPictureButton = Titanium.UI.createButton({
			backgroundImage: 'images/btn_another_image.png',
			width: 118,
			height: 105,
			top: 57,
			left: 185
		});
		newPictureButton.addEventListener('click', function() {
			choosePhotoFromCameraOrGallery();
		});
		attachmentsView.add(newPictureButton);
		
		var attachmentContainerView = Ti.UI.createView({
			backgroundColor: 'white',
			width: 137,
			height: 92,
			top: 63,
			left: 23
		});
		attachmentsView.add(attachmentContainerView);
		
		var attachmentContainerSubView = Ti.UI.createView({
			backgroundColor: 'transparent',
			width: 129,
			height: 84,
			top: 4,
			left: 4
		});
		attachmentContainerView.add(attachmentContainerSubView);
		
		var removeAttachmentButton = Titanium.UI.createButton({
			backgroundImage: 'images/remove_image_x.png',
			width: 31,
			height: 31,
			top: 49,
			left: 142,
			zIndex: 2
		});
		removeAttachmentButton.addEventListener('click', function(e) {
			moveButtonBarDown();
			hideAttachments();
			meme.ui.removePostMedia();
		});
		attachmentsView.add(removeAttachmentButton);
		
		var imagePreview;
		addAttachmentPreview = function(data) {
			if (imagePreview) {
				attachmentContainerSubView.remove(imagePreview);
				imagePreview = null;
			}
			
			imagePreview = Ti.UI.createImageView({
				image: data.media
			});
			attachmentContainerSubView.add(imagePreview);
		};
		
		showAttachments = function() {
			closeKeyboard();
			attachmentsView.animate({
				bottom: 0, 
				duration: 300, 
				curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
			});
			attachmentsOn = true;
		};
		
		hideAttachments = function() {
			closeKeyboard();
			attachmentsView.animate({
				bottom: -216, 
				duration: 300, 
				curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
			});
			attachmentsOn = false;
		};
	};
	
	var showOrHideAttachments = function() {
		if (attachmentsOn) {
			moveButtonBarDown();
			hideAttachments();
		} else {
			showAttachments();
			moveButtonBarUp();
		}
	};
	
	var choosePhotoFromCameraOrGallery = function() {
		var dialog = Titanium.UI.createOptionDialog({
	        options: ['Take photo with camera','Choose existing', 'Cancel'],
	        cancel: 2
	    });
		
	    dialog.addEventListener('click', function(e) {
	        if (e.index == 0) {
	            Ti.Media.showCamera({
					saveToPhotoGallery: true,
					showControls: true,
					mediaTypes: [ Ti.Media.MEDIA_TYPE_PHOTO ],
					success: function(e) {
						Ti.API.debug('image selected from camera [' + JSON.stringify(e) + ']');
						meme.ui.setPostMedia({
							type: 'photo',
							media: e.media
						});
					},
					error: function(e) {
						var message = 'Unexpected error: ' + e.code;
						if (e.code == Ti.Media.NO_CAMERA) {
							message = 'Device does not have camera.';
						}
						meme.ui.alert({
							title: 'Error',
							message: message,
							buttonNames: ['Ok']
						});
					}
				});
	        } else if (e.index == 1) {
	            Ti.Media.openPhotoGallery({
					showControls: true, 
					mediaTypes: [ Ti.Media.MEDIA_TYPE_PHOTO ],
					success: function(e) {
						Ti.API.debug('image selected from gallery [' + JSON.stringify(e) + ']');
						meme.ui.setPostMedia({
							type: 'photo',
							media: e.media
						});
					}
				});
	        }
	    });
		
	    dialog.show();	
	};
	
	var moveButtonBarUp, moveButtonBarDown, setAttachmentButtonOn, setAttachmentButtonOff;
	var createPostWindowButtons = function() {
		var closeButton = Titanium.UI.createButton({
			backgroundImage: 'images/closeBtn.png',
			width: 20,
			height: 20,
			top: 13,
			right: 13,
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
			height: 43
		});
		postWindow.add(buttonBar);
		
		var flashlightButton = Ti.UI.createButton({
			image: 'images/postbar_flashlight.png',
			top: 0,
			left: 0,
			width: 146, 
			height: 43
		});
		flashlightButton.addEventListener('click', meme.ui.openFlashlightWindow);
		buttonBar.add(flashlightButton);
	
		var pictureButton = Ti.UI.createButton({
			image: 'images/postbar_camera.png',
			top: 0,
			left: 146,
			width: 68, 
			height: 43
		});
		pictureButton.addEventListener('click', function(e) {
			if (postMedia) {
				showOrHideAttachments();
			} else {
				choosePhotoFromCameraOrGallery();
			}
		});
		buttonBar.add(pictureButton);
		
		var postButton = Ti.UI.createButton({
			image: 'images/en/postbar_post.png',
			top: 0,
			left: 214,
			width: 106, 
			height: 43
		});
		postButton.addEventListener('click', function(e) {
			createPost();
		});
		buttonBar.add(postButton);
		
		setAttachmentButtonOn = function() {
			pictureButton.image = 'images/postbar_camera_item.png';
		};
		
		setAttachmentButtonOff = function() {
			pictureButton.image = 'images/postbar_camera.png';
		};
		
		moveButtonBarUp = function() {
			buttonBar.animate({
				bottom: 216, 
				duration: 300, 
				curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
			});
			setTextFieldHeight(152);
		};
		
		moveButtonBarDown = function() {
			buttonBar.animate({
				bottom: 0, 
				duration: 300,
				curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
			});
			setTextFieldHeight(368);
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
			//will be 150px when cancel button is there
			//width: 150,
			width: 200,
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
			backgroundImage: 'images/old/btn_back.png',
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
		//temporarily removed - will be used only when we implement photo upload
		//progressView.add(cancelPostButton);
		
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
		
		// Message is optional
		updateProgress = function(value, message) {
			if (message) {
				progressBar.message = message;
			}
			progressBar.value = value;
		};
	};
	
	var createPost = function() {
		closeKeyboard();
		hideAttachments();
		moveButtonBarDown();
		
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
			
			Ti.API.debug('is there media to post? [' + JSON.stringify(postMedia) + ']');
			var response = null;
			if (postMedia) {
				if (postMedia.type == 'photo') {
					meme.api.uploadImage({
						image: postMedia.media,
						updateProgressCallback: updateProgress,
						successCallback: function(url) {
							updateProgress(1, 'Posting on Meme');
							response = meme.api.createPhotoPost(url, content);
							hideProgress();
							displayPostSuccess(response);
						},
						errorCallback: function() {
							hideProgress();
							meme.ui.alert({
								title: 'Error',
								message: 'Error uploading image. Please try again in a few seconds.',
								buttonNames: ['Ok'],
								onClick: function() {
									postWindow.close();
								}
							});
						}
					});
				}
			} else {
				updateProgress(0.5);
				response = meme.api.createTextPost(content);
				updateProgress(1);
				hideProgress();
				displayPostSuccess(response);
			}
		}
	};
	
	var displayPostSuccess = function() {
		meme.ui.alert({
			title: 'Success',
			message: 'Posted on Meme successfully!',
			buttonNames: ['View Post', 'Copy URL', 'Ok'],
			onClick: function(e) {
				if (e.index == 0) {
					meme.ui.openLinkOnSafari({
						url: response.status.post.url
					});
				} else if (e.index == 1) {
					Ti.UI.Clipboard.setText(response.status.post.url);
					meme.ui.alert({
						title: 'Success',
						message: 'The URL was copied to your clipboard',
						buttonNames: ['Ok']
					});
				}
				postWindow.close();
			}
		});	
	};
	
})();