describe('meme.util', function() {
	
	describe('meme.util.stripHtmlEntities', function() {
		it('should strip html entities', function() {
			var html = '<p>this is my <span class="bold">html</span> awesome\ntext!';
			var result = meme.util.stripHtmlEntities(html);
			expect(result).toBe('this is my html awesome text!');
		});

		it('should return null when strip html entities with null html', function() {
			expect(meme.util.stripHtmlEntities(null)).toBeNull();
		});	
	});
		
	describe('meme.util.secondsToHms', function() {
		it('should transform seconds to M:SS format when less than 9:59 minutes', function() {
			expect(meme.util.secondsToHms(123)).toBe('2:03');
		});

		it('should transform seconds to 0:00 format when zero seconds', function() {
			expect(meme.util.secondsToHms(0)).toBe('0:00');
		});

		it('should transform seconds to 0:00 format when null seconds', function() {
			expect(meme.util.secondsToHms(null)).toBe('0:00');
		});

		it('should transform seconds to HH:MM:SS format when seconds represent many hours', function() {
			expect(meme.util.secondsToHms(51072)).toBe('14:11:12');
		});
	});
	
});