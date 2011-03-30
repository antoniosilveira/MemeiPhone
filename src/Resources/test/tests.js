(function(){
	if (meme.config.tests_enabled) {
		Ti.include('/test/lib/jsunity-0.6.js');
		
		var testWindow = Titanium.UI.createWindow({
			title:'Application Tests',
			backgroundColor: 'white',
			navBarHidden: true,
			zIndex: 999
		});
		testWindow.open();
		
		var testsWebView = Ti.UI.createWebView({
			html: 	'',
			top: 	5,
		    left: 	5,
			width: 	310,
			height: 470
		});
		testWindow.add(testsWebView);
		
		var testResults = '';
		var testResultsBegin = '<html><head><style type="text/css">body{font-family:helvetica;}</style></head><body>';
		var testResultsEnd = '</body></html>';
		var updateTestResults = function(message) {
			if (message.indexOf('Running') == 0) {
				testResults += '<strong>' + message + '</strong><br>';
			} else if (message.indexOf('[FAILED]') == 0) {
				testResults += '<font color="#FF0000">' + message + '</font><br>';
			} else if (message.indexOf('[PASSED]') == 0) {
				testResults += '<font color="#009900">' + message + '</font><br>';
			} else {
				testResults += message + '<br>';
			}
			testsWebView.html = testResultsBegin + testResults + testResultsEnd;
		};

		jsUnity.log = function(message) {
			updateTestResults(message);
		};

		jsUnity.error = function(message) {
			Ti.API.error(message);
		};

		// Add all test suites...
		Ti.include('/test/test_util.js');

		// And run...
		jsUnity.run(UtilTestSuite);
	}
})();