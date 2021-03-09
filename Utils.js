
/*
window.location.host : you'll get sub.domain.com:8080 or sub.domain.com:80
window.location.hostname : you'll get sub.domain.com
window.location.protocol : you'll get http:
window.location.port : you'll get 8080 or 80
window.location.pathname : you'll get /virtualPath
window.location.origin : you'll get http://sub.domain.com *****
*/



var Utils = function() {
	this.getHostname = function(){
		return window.location.host+"/";
	}
	this.isArray = function(a){
		return (!!a) && (a.constructor === Array);
	}
	this.isObject = function(a){
		return (!!a) && (a.constructor === Object);
	}
	this.deepCopy = function(oldObj) {
		var newObj = oldObj;
		if (oldObj && typeof oldObj === 'object') {
			newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
			for (var i in oldObj) {
				newObj[i] = this.deepCopy(oldObj[i]);
			}
		}
		return newObj;
	}
	this.getLocation = function(){
		return window.document.baseURI;
		var pathLocation = window.location.href;
		pathLocation = pathLocation.replace(/\\/gi, "\/");
		pathLocation = pathLocation.substr(0,pathLocation.lastIndexOf("/"));
		return pathLocation;
	}
	this.getFilename = function(extension){
		extension = extension || false;
		var filename = window.location.href;
		filename = filename.replace(/\\/gi, "\/");
		var begin = filename.lastIndexOf("/");
		var end = filename.lastIndexOf(".")
		if(extension = true) end = filename.length-1;
		filename = filename.substr(begin+1,end);
		return filename;
	},
	// query string: ?foo=lorem&bar=&baz -> var foo = getParamFromUrl('foo'); // "lorem"
	this.getParamFromUrl = function(name, url){
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}	
	
};
Utils = new Utils();