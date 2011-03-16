(function(){
	
	meme.api = {};

	meme.api.createTextPost = function(content) {
		return createPost('text', content);
	};
	
	meme.api.flashlightWeb = function(query) {
		var params = {
			//cacheKey: 'flashlight:web:' + query,
			yqlQuery: 'SELECT title, abstract, url FROM search.web WHERE query="' + query + '"'
		};
		var items;
		var successCallback = function(results) {
			items = results.result;
		};
		var errorCallback = function() {
			items = null;
		};
		cachedYqlQuery(params, successCallback, errorCallback);
		return items;
	};
	
	var cachedYqlQuery = function(params, successCallback, errorCallback) {
		// default cache time is 15 minutes
		var cacheSeconds = 900;
		if (params.cacheSeconds) {
			cacheSeconds = params.cacheSeconds;
		}
		
		// -- cache not implemented yet
		//var items = cacheGet(params.cacheKey);
		var items;
		
		// if didn't find items in cache, go fetch them on YQL
		if (!items) {
			var yqlResponse = getYql().query(params.yqlQuery);
			
			if (!yqlResponse.query.results) {
				if (errorCallback) {
					errorCallback();
				} else {
					// -- not implemented yet
					//throwYqlError();
					meme.ui.alert({ title: 'Oops...', message: 'Error in YQL query :(' });
				}
			}

			items = yqlResponse.query.results;

			// -- not implemented yet
			// cache valid results only
			//if (items) {
			//	cachePut(params.cacheKey, items, cacheSeconds);
			//}
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
	
	// Executes an API query that does not expect response (insert, update, delete)
	var execute = function(yqlQuery) {
		var yqlResponse = getYql().query(yqlQuery);
		var results = yqlResponse.query.results;
		
		Ti.API.info("Results: ["+ JSON.stringify(results) +"]");
		
		if (!results) {
			// TODO: throw yql error
		}
		
		if (results.status && results.status.message == 'ok') { 
			return true;
		}
		return false;
	};
	
})();