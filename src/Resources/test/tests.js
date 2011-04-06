(function(){
	if (meme.config.tests_enabled) {
		Ti.include('/test/lib/jasmine-1.0.2.js');
		Ti.include('/test/lib/jasmine-titanium.js');
		
		// Include all the test files
		Ti.include(
			'/test/tests/api/test_cache.js',
			'/test/tests/ui/test_inactivity_observer.js',
			'/test/tests/util/test_util.js'
		);
		
		jasmine.getEnv().addReporter(new jasmine.TitaniumReporter());
		jasmine.getEnv().execute();
	}
})();