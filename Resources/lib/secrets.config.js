// This file keeps the information about your App Oauth Keys
// after insertng your oAuth Keys here, save and rename it to 'secrets.js'

// Go get your App Oauth Keys, login into your Project's page at Yahoo! Developer Network: https://developer.apps.yahoo.com/projects

// Endpoints
// These are the Default Endpoints for Yahoo! Oauth Process and YQL usage
var get_request_token_url = "https://api.login.yahoo.com/oauth/v2/get_request_token";
var get_token_url = "https://api.login.yahoo.com/oauth/v2/get_token";
var request_auth_url = "https://api.login.yahoo.com/oauth/v2/request_auth";
var yql_base_url = "http://query.yahooapis.com/v1/yql";
// var yql_base_url = "http://bitforest.org/oauth-test.php";

// Parameters for the YQL call
var yql_params = [];
yql_params.push(["format", "json"]);
yql_params.push(["diagnostics", "false"]);
yql_params.push(["env", "http://datatables.org/alltables.env"]);

//Oauth Keys from your Project Account on Yahoo! Developer Network (YDN)
var consumerKey = "YOUR-CONSUMER-KEY-HERE";
var consumerSecret = "YOUR-CONSUMER-SECRET-HERE";
var signatureMethod = "HMAC-SHA1";

Ti.API.info("secrets.js Included");

// Backend key
var meme_be_secret = "INTERNAL-KEY-FOR-UPLOAD";
