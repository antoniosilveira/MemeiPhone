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
	};
	
	meme.util.secondsToHms = function(seconds) {
		var d = Number(seconds);
		var h = Math.floor(d / 3600);
		var m = Math.floor(d % 3600 / 60);
		var s = Math.floor(d % 3600 % 60);
		return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
	};
	
})();