
var DataManager = function() 
{
	this.elements = [];
	this.LoadedFiles = [];
	this.LoadedFilesTotal = 0;
	this.LoadedBytes = 0;
	this.LoadedBytesTotal = 0;
	this.onLoadImageCount = 0;
	this.onLoadedCallback = null;
	this.onStartCallback = null;
	this.preloaderCount = 0;
	this.preloaderList = [];
};
DataManager.prototype = {
	loadPage: function(src, data, callback) {

		var t = this;
		
		var xhr = new XMLHttpRequest();
		
		
		xhr.open('GET', src, true);//xhr.open('GET', data.src, true);
		//xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
		
		xhr.responseType = 'document';

		

		xhr.onload = function(e) {
			Main.display(this.responseXML, e.srcElement.responseURL);
		};
		
		xhr.onprogress = function(e) {
			if (e.lengthComputable)
			{
				/*
				t.elements[key].LoadedBytes = e.loaded;
				t.elements[key].LoadedBytesTotal = e.total;
				////debugger;
				t.LoadedBytes += t.elements[key].LoadedBytes - t.elements[key].LoadedBytesOld;
				t.LoadedBytesTotal += t.elements[key].LoadedBytesTotal - t.elements[key].LoadedBytesTotalOld;
				
				t.elements[key].LoadedBytesOld = t.elements[key].LoadedBytes ;
				t.elements[key].LoadedBytesTotalOld = t.elements[key].LoadedBytesTotal ;
				//if(t.elements[key].LoadedBytes == t.elements[key].LoadedBytesTotal)
				//	t.LoadedFiles.push(key);
				t.preloader && t.preloader(key);
				*/
			}
		};
		
		xhr.onerror = function(e) {
			alert("Error " + e.target.status + " occurred while receiving the document.");
		};
		
		xhr.send();
	}
};

