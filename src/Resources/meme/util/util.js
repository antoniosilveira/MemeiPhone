(function(){
	meme.util = {};
	
	meme.util.stripHtmlEntities = function(string) {
		if (string) {
			var new_string = string.replace(/(<([^>]+)>)/ig, ' ');
			new_string = new_string.replace(/&[\w\#]+;/g, ' ');
			new_string = new_string.replace(/\n/g, ' ');
			new_string = new_string.replace(/\s+/g, ' ');
			new_string = new_string.trim();
			return new_string;
		}
		return null;
	};
	
	meme.util.secondsToHms = function(seconds) {
		var d = Number(seconds);
		var h = Math.floor(d / 3600);
		var m = Math.floor(d % 3600 / 60);
		var s = Math.floor(d % 3600 % 60);
		return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
	};
	
	meme.util.timestamp = function() {
		return((new Date()).getTime());
	};
	
	// Get smaller sizes to downsize images
	meme.util.getImageDownsizedSizes = function(max_width, max_height, original_img) {
	    var w = original_img.width, h = original_img.height;
	    if (w > max_width) {
	        w = max_width;
	        h = (max_width * original_img.height) / original_img.width;
	    }
	    if (h > max_height) {
	        h = max_height;
	        w = (max_height * original_img.width) / original_img.height;
	    }
	    return { width: w, height: h };
	};
	
})();