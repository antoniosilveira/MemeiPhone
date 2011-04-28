(function(){

	meme.ui.flashlight.rows = function() {
		
		var createFlickrPhotoRows = function(data) {
			Ti.API.debug('data from flickr: [' + JSON.stringify(data) + ']');
			if (data) {
				var row = Ti.UI.createTableViewRow({
					height: 106,
					selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
				});
				row.addEventListener('click', handleRowClick);
				
				var imageContainerView = Ti.UI.createView({
					top: 0,
					left: 0,
					width: 320,
					height: 106
				});
				row.add(imageContainerView);
				
				for (var i=0; i<data.length; i++) {
					if (data[i]) {
						var thumbUrl = 'http://farm' + data[i].farm + '.static.flickr.com/' + data[i].server + '/' + data[i].id + '_' + data[i].secret + '_t_d.jpg';
						var photoUrl = 'http://farm' + data[i].farm + '.static.flickr.com/' + data[i].server + '/' + data[i].id + '_' + data[i].secret + '.jpg';

						imageContainerView.add(Ti.UI.createImageView({
							image: thumbUrl,
							borderColor: '#C9C9CA',
							backgroundColor: 'black',
							top: 6,
							left: (i == 0) ? 7 : 163,
							width: 150,
							height: 100,
							defaultImage: 'images/old/default_img.png'
						}));

						row.add(Ti.UI.createView({
							top: 0,
							left: 160 * (i),
							height: 106,
							width: 160,
							zIndex: 2,
							title: data[i].title,
							photoUrl: photoUrl,
							subType: 'flickr',
							type: 'photo'
						}));
					}
				}

				return row;
			}
		};

		var createWebPhotoRows = function(data) {
			if (data) {
				var row = Ti.UI.createTableViewRow({
					height: 106,
					selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
				});
				row.addEventListener('click', handleRowClick);
				
				var imageContainerView = Ti.UI.createView({
					top: 0,
					left: 0,
					width: 320,
					height: 106
				});
				row.add(imageContainerView);
				
				for (var i=0; i<data.length; i++) {
					if (data[i]) {
						imageContainerView.add(Ti.UI.createImageView({
							image: data[i].thumbnail_url,
							borderColor: '#C9C9CA',
							backgroundColor: 'black',
							top: 6,
							left: (i == 0) ? 7 : 163,
							width: 150,
							height: 100,
							defaultImage: 'images/old/default_img.png'
						}));

						row.add(Ti.UI.createView({
							top: 0,
							left: 160 * (i),
							height: 106,
							width: 160,
							zIndex: 2,
							title: meme.util.stripHtmlEntities(data[i].abstract),
							photoUrl: data[i].url,
							subType: 'web',
							type: 'photo'
						}));
					}
				}

				return row;
			}
		};

		var createVideoRows = function(data) {
			if (data) {
				var thumb = data.thumbnails.thumbnail[0].content;
				var thumbFull = data.thumbnails.thumbnail[4].content;

				var row = Ti.UI.createTableViewRow({
					height: 78
				});
				row.addEventListener('click', handleRowClick);

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

		var createWebRows = function(data) {
			if (data) {
				var row = Ti.UI.createTableViewRow({
					height: 78
				});
				row.addEventListener('click', handleRowClick);

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

		var createTwitterRows = function(data) {
			if (data) {
				var screenName = data.from_user;
				var avatarUrl = data.profile_image_url;
				var statusId = data.id_str;

				var row = Ti.UI.createTableViewRow({
					height: 78
				});
				row.addEventListener('click', handleRowClick);

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
		
		var handleRowClick = function(e) {
			Ti.API.debug('Flashlight item clicked [' + e.source.type + '][' + e.source.subType + ']');
			
			if (e.source.type == 'photo') {
				Ti.API.debug('Photo item clicked [' + e.source.title + '][' + e.source.photoUrl + ']');
				meme.ui.post.window.setMedia({
					type: 'photo',
					url: e.source.photoUrl,
					title: e.source.title
				});
			} else {
				meme.ui.alert({
					title: 'To Do',
					message: 'Under construction :)\n(This is a development version and Flashlight is working only for photos)'
				});
			}
			
			meme.ui.flashlight.window.close();
		};
		
		return {
			createFlickrPhotoRows: createFlickrPhotoRows,
			createWebPhotoRows: createWebPhotoRows,
			createVideoRows: createVideoRows,
			createWebRows: createWebRows,
			createTwitterRows: createTwitterRows
		};
		
	}();
	
})();