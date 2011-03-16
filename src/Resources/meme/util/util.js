(function(){
	meme.util = {};
	
	meme.util.stripHtmlEntities = function(string) {
		var new_string = string.replace(/(<([^>]+)>)/ig, ' ');
		new_string = new_string.replace(/&[\w\#]+;/g, ' ');
		new_string = new_string.replace(/\n/g, ' ');
		new_string = new_string.replace(/\s+/g, ' ');
		new_string = new_string.trim();
		return new_string;
	};
})();