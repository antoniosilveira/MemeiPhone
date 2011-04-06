(function(){
	
	meme.config = {
		// Endpoints for Yahoo! Oauth Process
		get_request_token_url: 'https://api.login.yahoo.com/oauth/v2/get_request_token',
		get_token_url: 'https://api.login.yahoo.com/oauth/v2/get_token',
		request_auth_url: 'https://api.login.yahoo.com/oauth/v2/request_auth',
		
		// Endpoint for Yahoo! YQL usage
		yql_base_url: 'http://yql.yahooapis.com/v1/yql',
		
		// Endpoint for upload
		upload_url: 'http://meme.yahoo.com/api/image/',
		
		// OAuth
		oauth_signature_method: 'HMAC-SHA1',
		
		// Tests are disabled by default
		tests_enabled: false,
		
		// Cache configurations
		cache: {
			disable: false,
			cache_expiration_interval: 60
		}
	};
	
})();

Ti.include(
	'/meme/config/secrets.js'
);