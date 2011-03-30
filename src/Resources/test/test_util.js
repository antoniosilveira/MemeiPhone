jsUnity.attachAssertions();

var UtilTestSuite = {
	suiteName: 'Util Test Suite',
	
	testStripHtmlEntities: function() {
		var html = '<p>this is my <span class="bold">html</span> awesome\ntext!';
		var result = meme.util.stripHtmlEntities(html);
		assertEqual(result, 'this is my html awesome text!');
	},
	
	testStripHtmlEntitiesWithNullHtml: function() {
		var result = meme.util.stripHtmlEntities(null);
		assertNull(result);
	},
	
	testSecondsToHmsWithManyHours: function() {
		var hms = meme.util.secondsToHms(51072);
		assertEqual(hms, '14:11:12');
	},
	
	testSecondsToHmsWithFewMinutes: function() {
		var hms = meme.util.secondsToHms(123);
		assertEqual(hms, '2:03');
	},
	
	testSecondsToHmsWithNullSeconds: function() {
		var hms = meme.util.secondsToHms(null);
		assertEqual(hms, '0:00');
	}
};