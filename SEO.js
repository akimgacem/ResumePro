
var SEO = function() 
{
	this.folder = [];
	this.page = [];
	this.directory = {folderID:0,pageID:0};
};
SEO.prototype = {
	setURL: function(title, url) 
	{
		title = title || '';
		url = url || '';
		window.history.replaceState('',title,url);
	},
	addURL: function(page) 
	{

		/*
		obj = obj || '';
		title = title || '';
		url = url || '';
		window.history.pushState('',title,url);
		*/
		
	},
	getURL: function(){
		
	}
};
SEO = new SEO();
