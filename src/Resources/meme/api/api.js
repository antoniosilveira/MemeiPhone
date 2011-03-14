(function(){
	
	meme.api = {};

	meme.api.createTextPost = function(content) {
		return createPost('text', content);
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