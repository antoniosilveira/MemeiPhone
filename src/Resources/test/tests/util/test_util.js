(function(){
	
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
		
		describe('meme.util.getImageDownsizedSizes', function() {
			it('should get new sizes for wide images', function() {
				var newSizes = meme.util.getImageDownsizedSizes(500, 500, {
					width: 1000, 
					height: 500
				});
				expect(newSizes.width).toBe(500);
				expect(newSizes.height).toBe(250);
			});
			
			it('should get new sizes restricted by 4:3 format', function() {
				var newSizes = meme.util.getImageDownsizedSizes(100, 75, {
					width: 800, 
					height: 2400
				});
				expect(newSizes.width).toBe(25);
				expect(newSizes.height).toBe(75);
			});
			
			it('should get new sizes for tall images', function() {
				var newSizes = meme.util.getImageDownsizedSizes(500, 500, {
					width: 200, 
					height: 2000
				});
				expect(newSizes.width).toBe(50);
				expect(newSizes.height).toBe(500);
			});
		});
		
		describe('meme.util.resizeImage', function() {
			it('should resize images respecting max_size constraints', function() {
				var image = {
					width: 1000,
					height: 500,
					imageAsResized: null
				};
				
				spyOn(image, 'imageAsResized').andReturn({
					width: 500,
					height: 250
				});
				
				var newImage = meme.util.resizeImage(500, 500, image);
				
				expect(image.imageAsResized).toHaveBeenCalledWith(500, 250)
				expect(newImage.width).toBe(500);
				expect(newImage.height).toBe(250);
			});
		});

	});
	
})();