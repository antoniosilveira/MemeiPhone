(function(){
	
	meme.ui.post = {};
	
	meme.ui.post.window = function() {
		
		var postWindow, postMedia;

		var open = function() {
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
				postWindow = null;
				postMedia = null;
				meme.ui.home.window.show();
			});

			postWindow.open(Ti.UI.createAnimation({
				duration: 250,
				left: 0 
			}));
			
			meme.analytics.record(meme.analytics.NEW_POST_OPEN);
		};

		// Paremeters
		// type: [image|video]
		// url: 'url of the video/image'
		// media: 'the actual media (photo only)'
		var setMedia = function(data) {
			removeMedia();
			postMedia = data;
			createAttachmentPreview(data);
			if (getTitle() == '') {
				setTitle(data.title);
			}
			showAttachments();
			moveButtonBarUp();
		};

		var removeMedia = function() {
			postMedia = null;
			setPictureAttachmentButtonOff();
			setFlashlightAttachmentButtonOff();
		};

		var getTitle, setTitle, getText, setTextFieldHeight, closeKeyboard;
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
				hintText: L('post_add_title'),
				textAlign: 'left',
				verticalAlign: 'center',
				font: { fontSize: 20, fontFamily: 'Helvetica', fontWeight: 'bold' },
				width: 265,
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
				hideWriteHere();
			});
			textField.addEventListener('blur', function(e) {
				moveButtonBarDown();
				hideAttachments();
				if (textField.value == undefined || textField.value == '') {
    				showWriteHere();
				}
			});
			postWindow.add(textField);

            var labelWriteHere = Ti.UI.createLabel({
			    width: 300,
			    height: 22,
			    top: 55,
			    left: 19,
			    textAlign: 'left',
                text: L('post_add_text'),
                color: '#CCCCCC',
				font: { fontSize: 16, fontFamily: 'Helvetica', fontStyle: 'regular' }
			});
			postWindow.add(labelWriteHere);
            
            var hideWriteHere = function() {
                labelWriteHere.animate({
					opacity: 0, 
					duration: 300, 
				});
			};
            
            var showWriteHere = function() {
                labelWriteHere.animate({
					opacity: 1, 
					duration: 300, 
				});
            };

			setTitle = function(title) {
				if (title) {
					titleField.value = title;
				}
			};
			
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

		var showAttachments, 
			hideAttachments, 
			createAttachmentPreview, 
			attachmentsOn = false;
		var createPostWindowAttachmentsView = function() {
			var attachmentsView = Ti.UI.createView({
				backgroundImage: 'images/below_keyboard_bg.png',
				width: 320,
				height: 216,
				bottom: -216
			});
			postWindow.add(attachmentsView);

			var newImageButton = Titanium.UI.createImageView({
				backgroundImage: 'images/' + meme.app.lang() + '/btn_new_image.png',
				width: 170,
				height: 37,
				top: 174,
				left: 75,
				visible: false
			});
			newImageButton.addEventListener('click', function() {
				choosePhotoFromCameraOrGallery();
			});
			attachmentsView.add(newImageButton);
			
			var newFlashlightMediaButton = Titanium.UI.createImageView({
				image: 'images/' + meme.app.lang() + '/btn_new_flashlight_media.png',
				width: 170,
				height: 37,
				top: 174,
				left: 75,
				visible: false
			});
			newFlashlightMediaButton.addEventListener('click', function() {
				meme.ui.flashlight.window.open();
			});
			attachmentsView.add(newFlashlightMediaButton);

			var attachmentContainerView = Ti.UI.createView({
				backgroundColor: 'white',
				width: 200,
				height: 150,
				top: 15,
				left: 60
			});
			attachmentsView.add(attachmentContainerView);

			var attachmentContainerSubView = Ti.UI.createView({
				backgroundColor: 'black',
				width: 190,
				height: 140,
				top: 5,
				left: 5
			});
			attachmentContainerView.add(attachmentContainerSubView);

			var removeAttachmentButton = Titanium.UI.createButton({
				backgroundImage: 'images/remove_image_x.png',
				width: 31,
				height: 31,
				top: 2,
				left: 242,
				zIndex: 2
			});
			removeAttachmentButton.addEventListener('click', function(e) {
				moveButtonBarDown();
				hideAttachments();
				removeMedia();
			});
			attachmentsView.add(removeAttachmentButton);

			var imagePreview;
			createAttachmentPreview = function(data) {
				if (imagePreview != null) {
					attachmentContainerSubView.remove(imagePreview);
					imagePreview = null;
				}
				
				if (data.media) {
					setPictureAttachmentButtonOn();
					imagePreview = Ti.UI.createImageView({
						image: meme.util.resizeImage(190, 140, data.media)
					});
					
					newFlashlightMediaButton.hide();
					newImageButton.show();
				} else if (data.url) {
					setFlashlightAttachmentButtonOn();
					imagePreview = Ti.UI.createImageView({
						image: data.url
					});
					
					newImageButton.hide();
					newFlashlightMediaButton.show();
				}
				
				attachmentContainerSubView.add(imagePreview);
			};

			showAttachments = function() {
				attachmentsView.animate({
					bottom: 0, 
					duration: 300, 
					curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
				});
				attachmentsOn = true;
			};

			hideAttachments = function() {
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
				closeKeyboard();
				moveButtonBarDown();
				hideAttachments();
			} else {
				closeKeyboard();
				showAttachments();
				moveButtonBarUp();
			}
		};

		var choosePhotoFromCameraOrGallery = function() {
			var dialog = Titanium.UI.createOptionDialog({
		        options: [L('post_btn_take_photo'), L('post_btn_choose_existing'), L('alert_btn_cancel')],
		        cancel: 2
		    });

		    dialog.addEventListener('click', function(e) {
		        if (e.index == 0) {
		            Ti.Media.showCamera({
						allowEditing: true,
						saveToPhotoGallery: true,
						showControls: true,
						mediaTypes: [ Ti.Media.MEDIA_TYPE_PHOTO ],
						success: function(e) {
							Ti.API.debug('image selected from camera [' + JSON.stringify(e) + ']');
							setMedia({
								type: 'photo',
								media: e.media
							});
						},
						error: function(e) {
							var message = String.format(L('post_alert_unexpected_error'), e.code);
							if (e.code == Ti.Media.NO_CAMERA) {
								message = L('post_alert_camera_error');
							}
							meme.ui.alert({
								title: L('alert_error_title'),
								message: message,
								buttonNames: [L('alert_btn_ok')]
							});
						}
					});
		        } else if (e.index == 1) {
		            Ti.Media.openPhotoGallery({
						showControls: true, 
						mediaTypes: [ Ti.Media.MEDIA_TYPE_PHOTO ],
						success: function(e) {
							Ti.API.debug('image selected from gallery [' + JSON.stringify(e) + ']');
							setMedia({
								type: 'photo',
								media: e.media
							});
						}
					});
		        }
		    });

		    dialog.show();	
		};

		var moveButtonBarUp, 
			moveButtonBarDown, 
			setPictureAttachmentButtonOn, 
			setPictureAttachmentButtonOff,
			setFlashlightAttachmentButtonOn, 
			setFlashlightAttachmentButtonOff;
		var createPostWindowButtons = function() {
			var closeButton = Titanium.UI.createButton({
				backgroundImage: 'images/close_post.png',
				width: 27,
				height: 46,
				top: 1,
				right: 0,
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
			flashlightButton.addEventListener('click', function(e) {
				if (postMedia && postMedia.url) {
					showOrHideAttachments();
				} else {
					meme.ui.flashlight.window.open();
				}
			});
			buttonBar.add(flashlightButton);

			var pictureButton = Ti.UI.createButton({
				image: 'images/postbar_image.png',
				top: 0,
				left: 146,
				width: 68, 
				height: 43
			});
			pictureButton.addEventListener('click', function(e) {
				if (postMedia && postMedia.media) {
					showOrHideAttachments();
				} else {
					choosePhotoFromCameraOrGallery();
				}
			});
			buttonBar.add(pictureButton);

			var postButton = Ti.UI.createButton({
				image: 'images/' + meme.app.lang() + '/postbar_post.png',
				top: 0,
				left: 214,
				width: 106, 
				height: 43
			});
			postButton.addEventListener('click', function(e) {
				createPost();
			});
			buttonBar.add(postButton);

			setFlashlightAttachmentButtonOn = function() {
				flashlightButton.image = 'images/postbar_flashlight_item.png';
			};
			
			setFlashlightAttachmentButtonOff = function() {
				flashlightButton.image = 'images/postbar_flashlight.png';
			};
			
			setPictureAttachmentButtonOn = function() {
				pictureButton.image = 'images/postbar_image_item.png';
			};

			setPictureAttachmentButtonOff = function() {
				pictureButton.image = 'images/postbar_image.png';
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
				message: L('post_posting_on_meme'),
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
			    title: L('alert_btn_cancel'),
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
					title: L('alert_oops_title'),
					message: L('post_alert_empty_error'),
					buttonNames: [L('alert_btn_ok')]
				});
			} else {
				var blackScreen = Ti.UI.createView({
					backgroundColor: 'black',
					opacity: 0.3,
					height: 460,
					width: 320,
					zIndex: 50
				});
				postWindow.add(blackScreen);

				showProgress(L('post_posting_on_meme'));

				var content = '';
				if (getTitle() != '') {
					content += '<strong>' + getTitle() + '</strong><p>\n</p>';
				}
				content += getText();

				Ti.API.debug('is there media to post? [' + JSON.stringify(postMedia) + ']');
				var response = null;
				if (postMedia) {
					if (postMedia.type == 'photo') {
						if (postMedia.media) {
							meme.api.uploadImage({
								image: postMedia.media,
								updateProgressCallback: updateProgress,
								successCallback: function(url) {
									updateProgress(1, L('post_posting_on_meme'));
									response = meme.api.createPhotoPost(url, content);
									hideProgress();
									meme.analytics.record(meme.analytics.NEW_POST_PUBLISHED);
									displayPostSuccess(response);
								},
								errorCallback: function() {
									hideProgress();
									meme.ui.alert({
										title: L('alert_error_title'),
										message: L('post_alert_image_upload_error'),
										buttonNames: [L('alert_btn_ok')],
										onClick: function() {
											postWindow.close();
										}
									});
								}
							});
						} else {
							updateProgress(0.5);
							response = meme.api.createPhotoPost(postMedia.url, content);
							updateProgress(1);
							hideProgress();
							meme.analytics.record(meme.analytics.NEW_POST_PUBLISHED);
							displayPostSuccess(response);
						}
					}
				} else {
					updateProgress(0.5);
					response = meme.api.createTextPost(content);
					updateProgress(1);
					hideProgress();
					meme.analytics.record(meme.analytics.NEW_POST_PUBLISHED);
					displayPostSuccess(response);
				}
			}
		};

		var displayPostSuccess = function(response) {
			meme.ui.alert({
				title: L('alert_success_title'),
				message: L('post_alert_success_message'),
				buttonNames: [L('post_alert_btn_view_post'), L('post_alert_btn_copy_url'), L('alert_btn_ok')],
				onClick: function(e) {
					if (e.index == 0) {
						meme.analytics.record(meme.analytics.OPEN_SAFARI);
						Ti.Platform.openURL(response.status.post.url);
					} else if (e.index == 1) {
						meme.analytics.record(meme.analytics.COPY_LINK);
						Ti.UI.Clipboard.setText(response.status.post.url);
						meme.ui.alert({
							title: L('alert_success_title'),
							message: L('post_alert_clipboard_message'),
							buttonNames: [L('alert_btn_ok')]
						});
					}
					postWindow.close();
				}
			});	
		};
		
		return {
			open: open,
			setMedia: setMedia, 
			removeMedia: removeMedia
		};
		
	}();
	
})();