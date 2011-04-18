(function(){
	
	meme.api = {};

	meme.api.createTextPost = function(content) {
		return createPost('text', content);
	};
	
	meme.api.createPhotoPost = function(content, caption) {
		return createPost('photo', content, caption);
	};
	
	meme.api.userInfo = function(guid, thumbWidth, thumbHeight) {
		var queryGuid, where;
		
		if (typeof guid == 'string') {
			queryGuid = '"' + guid + '"';
			where = 'where owner_guid=' + queryGuid;
		} else {
			queryGuid = '"' + guid.join('","') + '"';
			where = 'where owner_guid IN (' + queryGuid + ')';
		}
		
		var query = 'SELECT * FROM meme.info ' + where;
		if (thumbWidth && thumbHeight) {
			 query += ' | meme.functions.thumbs(width=' + thumbWidth + ',height=' + thumbHeight + ')';
		}
		
		var params = {
			cacheKey: 'userInfo:' + queryGuid + ':' + thumbWidth + ':' + thumbHeight,
			cacheSeconds: 86400, // 24 hours
			yqlQuery: query
		};
		
		var userInfo = null;
		yqlQuery(params, function(results) {
			userInfo = results.meme;
		});
		
		return userInfo;
	};
	
	meme.api.flashlightFlickrPhoto = function(query, start, count) {
		var limiting = '(0,24)';
		if (start && count) {
			limiting = '(' + start + ',' + count + ')';
		}
		var params = {
			cacheKey: 'flashlight:flickrPhoto:' + limiting + ':' + query,
			yqlQuery: 'SELECT * FROM flickr.photos.search' + limiting + ' WHERE text="' + query + '" AND license="4"'
		};
		var photos;
		var successCallback = function(results) {
			photos = results.photo;
		};
		var errorCallback = function() {
			photos = null;
		};
		yqlQuery(params, successCallback, errorCallback);
		return photos;
	};
	
	meme.api.flashlightWebPhoto = function(query, start, count) {
		var limiting = '(0,24)';
		if (start && count) {
			limiting = '(' + start + ',' + count + ')';
		}
		var params = {
			cacheKey: 'flashlight:webPhoto:' + limiting + ':' + query,
			yqlQuery: 'SELECT * FROM search.images' + limiting + ' WHERE query="' + query + ' -url:flickr.com" and filter="yes"'
		};
		var photos;
		var successCallback = function(results) {
			photos = results.result;
		};
		var errorCallback = function() {
			photos = null;
		};
		yqlQuery(params, successCallback, errorCallback);
		return photos;
	};
	
	meme.api.flashlightVideo = function(query, start, count) {
		var limiting = '';
		if (start && count) {
			limiting = ' AND start_index="' + (start + 1) + '" AND max_results="' + count + '" ';
		}
		var params = {
			cacheKey: 'flashlight:video:' + limiting + ':' + query,
			yqlQuery: 'SELECT * FROM youtube.search WHERE query="' + query + '"' + limiting
		};
		var videos;
		var successCallback = function(results) {
			videos = results.video;
		};
		var errorCallback = function() {
			videos = null;
		};
		yqlQuery(params, successCallback, errorCallback);
		return videos;
	};
	
	meme.api.flashlightWeb = function(query, start, count) {
		var limiting = '(0,24)';
		if (start && count) {
			limiting = '(' + start + ',' + count + ')';
		}
		var params = {
			cacheKey: 'flashlight:web:' + limiting + ':' + query,
			yqlQuery: 'SELECT title, abstract, url FROM search.web' + limiting + ' WHERE query="' + query + '"'
		};
		var items;
		var successCallback = function(results) {
			items = results.result;
		};
		var errorCallback = function() {
			items = null;
		};
		yqlQuery(params, successCallback, errorCallback);
		return items;
	};
	
	meme.api.flashlightTwitter = function(query, start, count) {
		var limiting = '';
		if (start && count) {
			limiting = ' AND page="' + ((start / count) + 1) + '" and rpp="' + count + '" ';
		}
		var params = {
			cacheKey: 'flashlight:twitter:' + limiting + ':' + query,
			yqlQuery: 'SELECT * FROM twitter.search WHERE q="' + query + '"' + limiting
		};
		var items;
		var successCallback = function(results) {
			items = results.results;
		};
		var errorCallback = function() {
			items = null;
		};
		yqlQuery(params, successCallback, errorCallback);
		return items;
	};
	
	// Executes an API read query (select)
	var yqlQuery = function(params, successCallback, errorCallback) {
		// default cache time is 15 minutes
		var cacheSeconds = 900;
		if (params.cacheSeconds) {
			cacheSeconds = params.cacheSeconds;
		}
		
		var items;
		if (params.cacheKey) {
			items = meme.api.cache.get(params.cacheKey);
		}
		
		// if didn't find items in cache, go fetch them on YQL
		if (!items) {
			var yqlResponse = getYql().query(params.yqlQuery);
			
			if (!yqlResponse.query.results) {
				if (errorCallback) {
					errorCallback();
				} else {
					meme.ui.alert({
						title: L('alert_oops_title'),
						message: L('alert_yql_error')
					});
				}
			}

			items = yqlResponse.query.results;

			// cache valid results only
			if (params.cacheKey && items) {
				meme.api.cache.put(params.cacheKey, items, cacheSeconds);
			}
		}
		
		// if there are results (cached or not), execute successCallback
		if (items) {
			successCallback(items);
		}
	};
	
	var getYql = function() {
		return meme.auth.oadapter.getYql();
	};
	
	var createPost = function(type, content, caption) {
		var columns = 'type';
		var values = '\'' + type + '\'';
		if (content) {
			columns += ', content';
			values += ', \'' + content + '\'';
		}
		if (caption) {
			columns += ', caption';
			values += ', \'' + caption + '\'';
		}
		var yqlQuery = 'INSERT INTO meme.user.posts (' + columns + ') VALUES (' + values + ')';
		return execute(yqlQuery);
	};
	
	// Executes an API write query (insert, update, delete)
	var execute = function(yqlQuery) {
		var yqlResponse = getYql().query(yqlQuery);
		var results = yqlResponse.query.results;
		
		Ti.API.info("Results: ["+ JSON.stringify(results) +"]");
		
		if (results.status && results.status.message == 'ok') { 
			return results;
		}
		return false;
	};
	
	// Options are:
	// {
	// 	image: theActualMediaToUpload,
	// 	updateProgressCallback: updateProgressFunction,
	// 	successCallback: function() {},
	// 	errorCallback: function() {},
	// 	cancelCallback: function() {}, // -- optional
	// 	cancelButton: buttonToCancelImageUpload // -- optional
	// }
	meme.api.uploadImage = function(options) {
		var xhr = Titanium.Network.createHTTPClient();
		xhr.setTimeout(300000); // timeout to upload is 5 minutes

		if (options.cancelButton) {
			cancelButton.addEventListener('click', function() {
				xhr.abort();
				cancelCallback();
			});
		}

		xhr.onerror = function(e) {
			options.errorCallback(e);
		};

		xhr.onload = function(e) {
			Ti.API.info('Upload complete!');
			Ti.API.info('api response was (http status ' + this.status + '): ' + this.responseText);

			try {
				var uploadResult = JSON.parse(this.responseText);

				if (uploadResult.status == 200) {
					options.successCallback(uploadResult.imgurl);
				} else {
					throw 'Upload error: ' + uploadResult.message;
				}
			} catch(exception) {
				Ti.API.error(exception);
				options.errorCallback(exception);
			}
		};

		xhr.onsendstream = function(e) {
			options.updateProgressCallback(e.progress, L('post_uploading_image'));
			Ti.API.debug('upload progress: ' + e.progress);
		};

		// Resizes image before uploading
		// Max size accepted by Meme is 780x2500 px
		var image = meme.util.resizeImage(780, 2500, options.image);

		// Create upload signture
		var time = parseInt(meme.util.timestamp()/1000);
		var signature = hex_hmac_sha1(meme.config.secrets.upload_key, meme.app.userInfo().name + ':' + time);
		
		// Upload it!
		xhr.open('POST', meme.config.upload_url);
		xhr.send({
			t: time,
			file: image,
			m: meme.app.userInfo().name,
			s: signature
		});
	};
	
})();

Ti.include(
	'/meme/api/cache.js'
);