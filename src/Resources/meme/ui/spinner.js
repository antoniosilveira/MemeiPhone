/***************************************************
Image Spinner, by Guilherme Chapiewski - http://guilherme.it

Titanium does not allow you to rotate images 360 degrees. The maximum value 
is 180, thus not allowing you to create a custom loader, for instance.

This simple spinner allow you to rotate images to both directions in a
very easy way.

Usage:
	// create your image
	var image = Ti.UI.createImageView({ your: params });
	
	// attach the spinner methods to the image
	meme.ui.spinner.attachTo(image);
	
	// spin!
	image.startSpinning();
	
	// the default side is right, but you can rotate to left:
	image.startSpinning('right');
	
	// stop it:
	image.stopSpinning();
***************************************************/

(function(){
	
	meme.ui.spinner = function() {
		
		var attachTo = function(image) {
			
			var animation = null;
			var duration = 50;
			
			// 15 is slow
			// 30 is medium
			// 45 is fastest :)
			var originalDegrees = 30;
			
			var currentDegrees = originalDegrees;
			var direction = 1;
			
			// direction can be 'right' (default) or 'left'
			image.startSpinning = function(direction) {
				if (direction && (direction == 'left')) {
					direction = -1;
				} else {
					direction = 1;
				}
				
				Ti.API.debug('[SPINNER] will start spinner, duration [' +  duration + '], degrees [' + originalDegrees + ']');
				
				animation = setInterval(function() {
					Ti.API.debug('[SPINNER] spin!!! image [' + image + '], degrees [' + currentDegrees + '], time [' + meme.util.timestamp() + ']');
					
					image.animate(Ti.UI.createAnimation({
						duration: duration,
						transform: Ti.UI.create2DMatrix({
							rotate: currentDegrees * direction
						})
					}));
					
					currentDegrees += originalDegrees;
					currentDegrees %= 360; // to avoid explode Titanium
				}, duration);
				
				Ti.API.debug('[SPINNER] spinner started');
			};
			
			image.stopSpinning = function() {
				clearInterval(animation);
				currentDegrees = originalDegrees;
				
				Ti.API.debug('[SPINNER] spinner stopped');
			};
			
			Ti.API.debug('[SPINNER] image spinner attached');
		};
		
		return {
			attachTo: attachTo
		};
	}();
	
})();