(function(){

	meme.ui.flashlight.rows = function() {
		
		var createFlickrPhotoRows = function(data) {
			if (data) {
				var row = Ti.UI.createTableViewRow({
					height: 78
				});
				row.addEventListener('click', handleRowClick);

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

		var createWebPhotoRows = function(data) {
			if (data) {
				var row = Ti.UI.createTableViewRow({
					height: 78
				});
				row.addEventListener('click', handleRowClick);

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
			Ti.API.debug('Flashlight item clicked [' + e.source.type + ']');
			meme.ui.alert({
				title: 'To Do',
				message: 'Not implemented yet :('
			});
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