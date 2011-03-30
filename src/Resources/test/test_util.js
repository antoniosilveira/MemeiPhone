jsUnity.attachAssertions();

var UtilTestSuite = {
	suiteName: 'Util Test Suite',
	
	testStripHtmlEntities: function() {
		var html = '<p>this is my <span class="bold">html</span> awesome\ntext!';
		var result = meme.util.stripHtmlEntities(html);
		assertEqual(result, 'this is my html awesome text!');
	}
};