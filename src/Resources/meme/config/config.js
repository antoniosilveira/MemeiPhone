(function(){
	
	meme.config = {
		// Endpoints for Yahoo! Oauth Process
		get_request_token_url: 'https://api.login.yahoo.com/oauth/v2/get_request_token',
		get_token_url: 'https://api.login.yahoo.com/oauth/v2/get_token',
		request_auth_url: 'https://api.login.yahoo.com/oauth/v2/request_auth',
		
		// Endpoint for Yahoo! YQL usage
		yql_base_url: 'http://yql.yahooapis.com/v1/yql',
		
		// OAuth
		oauth_signature_method: 'HMAC-SHA1'
	};
	
})();

Ti.include(
	'/meme/config/secrets.js'
);