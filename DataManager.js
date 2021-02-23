
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
	setElement: function(elemType, options = {isTween:true,isStyle:true,isEvent:true}) 
	{
		var element = {};
		
		element.options = options;
		element.type = elemType;
		if(options.isTween == true){
			element.tween = {};
		}
		if(options.isStyle == true){
			element.style = {};
		}
		if(options.isEvent == true){
			element.event = {};
		}
		element.LoadedBytes = 0;
		element.LoadedBytesTotal = 0;
		element.LoadedBytesOld = 0;
		element.LoadedBytesTotalOld = 0;
		
		return element;
	},
	setClone: function(elemName, copyCount, createDivClone = true){
		//////debugger;
		var t =  this;
		//console.log("copyCount : " + copyCount);
		if(t.elements[elemName] == null)
			return;
		
		var i = 0;
		var newElem;
		
		if(t.elements[elemName].clone == null)
			t.elements[elemName].clone = [];
		if(t.elements[elemName].cloneDiv == null)
			t.elements[elemName].cloneDiv = []
		
		var remove = copyCount < t.elements[elemName].clone.length ? (t.elements[elemName].clone.length - copyCount) : 0;
		var create = copyCount > t.elements[elemName].clone.length ? (copyCount - t.elements[elemName].clone.length) : 0;
		
		//elemName = t.elements["MainTopContainer"].doc.children[0].className;
		if(create > 0){
		
			var iStart = t.elements[elemName].clone.length;
		
			for (i=iStart; i < copyCount; i++){
				newElem = window.document.createElement("img");
				newElem.style.cssText = t.elements[elemName].doc.style.cssText;
				newElem.src = t.elements[elemName].blobUrl[0];//t.elements[elemName].doc.src;
				newElem.className = elemName+i.toString();
				t.elements[elemName].clone.push(newElem);
				
				t.elements[elemName].doc.parentNode.appendChild(t.elements[elemName].clone[i]);
				
				if(createDivClone == true){
					newElem = window.document.createElement("div");
					newElem.style.cssText = "border-style: solid;  border-width: 0px ; border-color: rgb( 0, 255, 0);";
					newElem.style.display = "none";
					newElem.className = elemName+i.toString();
					newElem.classID = i.toString();
					t.elements[elemName].cloneDiv.push(newElem);
					t.elements[elemName].doc.parentNode.appendChild(t.elements[elemName].cloneDiv[i]);
				}
			}
		}else if(remove > 0){
			//////debugger;
			var parentNode = t.elements[elemName].doc.parentNode;
			i = t.elements[elemName].clone.length;
			while (i > copyCount) {
			
				//parentNode.getElementsByClassName("bg_MainTopSelect3")[0]
				//var d_nested = document.getElementById("nested");
				//var throwawayNode = d.removeChild(d_nested);
				
				parentNode.removeChild(t.elements[elemName].clone[i-1]);
				parentNode.removeChild(t.elements[elemName].cloneDiv[i-1]);  
				
				t.elements[elemName].clone.splice(i-1, 1);
				t.elements[elemName].cloneDiv.splice(i-1, 1);
				
				i = t.elements[elemName].clone.length
				
			}
		
		}

		//create div over original
		if(t.elements[elemName].div == null && createDivClone == true){
			i=-1;
			newElem = window.document.createElement("div");
			newElem.style.cssText = "border-style: solid;  border-width: 0px ; border-color: rgb( 0, 255, 0);";
			newElem.style.display = "none";
			newElem.className = elemName;
			newElem.classID = i.toString();
			t.elements[elemName].div = newElem;
			t.elements[elemName].doc.parentNode.appendChild(t.elements[elemName].div);
		}
		
		//console.log(copyCount);
		
	},
	CreateAllElements: function() 
	{
		//////debugger;
		if(this.LoadedBytes == this.LoadedBytesTotal){
			if(this.LoadedFiles.length == this.LoadedFilesTotal && this.onLoadImageCount == 0){
				console.log('CreateAllElements');
				////debugger;
				this.onLoadImageCount = -1;
				////debugger;
				
				if(this.onStartCallback) this.onStartCallback();
				this.onStartCallback = null;
			
				var i = 0, key;
				var _len = this.LoadedFiles.length;
				for(i = 0 ;i < _len; i++){
					key = this.LoadedFiles[i];
					
					//set z-index
					//_DataManager.elements['MainContainer'].doc.childElementCount
					//_DataManager.elements['MainContainer'].doc.parentNode
					//var parentIndex = 0;
					//if(this.elements[key].doc.parentNode.className.length != 0)
					//	parentIndex = 0;
					//else{
						//this.elements[key].doc.style.zIndex = i;
					//}
					if(this.elements[key].callback != null){ 
						this.elements[key].callback();
						this.elements[key].callback = null;
					}
					
					if(this.elements[key].options.isTween == true){
						//this.elements[key].tween = new Tweener(this.elements[key]);
						if(this.elements[key].tween.autoplay != false)
							this.elements[key].tween.play();
					}
					//this.elements[key].isLoaded = true;
				}
			
				this.LoadedFiles = [];
				this.LoadedBytes = 0;
				this.LoadedBytesTotal = 0;
				this.LoadedFilesTotal  = 0;
				this.onLoadImageCount = 0;
				this.preloaderCount = 0;
				this.preloaderList = [];
				if(this.onLoadedCallback) this.onLoadedCallback();
				//this.onLoadedCallback = null;
			}
		}
	},
	CreateElement: function(data, key, blob, order) 
	{
		//if (key == "bg_MainTopSelect")
		//	//debugger;
		
		var t = this;
		//except for image, which loading is confirmed when onload is called
		//if (data.type != 'image/png')
		//if(t.elements[key].isLoaded != true && t.LoadedFiles[key] == null)
		if (data.type != 'image/png')	
			t.LoadedFiles.push(key);
		
		t.elements[key].callback = data.callback;
		
		// if HTML Element doc, dont need load request
		if(t.elements[key].doc == null)
			if(data.type == 'HTMLElement'){
				t.elements[key].doc = window.document.createElement("div");
			}else if (data.type == 'image/png'){
				t.elements[key].doc = window.document.createElement("img");
			}else if (data.type == 'image/svg+xml'){
				var xmlns = "http://www.w3.org/2000/svg";
				var boxWidth = 300;
				var boxHeight = 300;
				t.elements[key].doc = document.createElementNS(xmlns, "svg");
				t.elements[key].doc.setAttributeNS (null, "viewBox", "0 0 " + boxWidth + " " + boxHeight);
				t.elements[key].doc.setAttributeNS (null, "width", boxWidth);
				t.elements[key].doc.setAttributeNS (null, "height", boxHeight);
				t.elements[key].doc.style.display = "block";
			}
			
			
		if(data.type == "image/svg+xml"){
			//////debugger;
			t.elements[key].doc.setAttributeNS (null, "viewBox", blob.blobSVG.getAttribute("viewBox"));
			t.elements[key].doc.setAttributeNS (null, "width", blob.blobSVG.getAttribute("width"));
			t.elements[key].doc.setAttributeNS (null, "height", blob.blobSVG.getAttribute("height"));
			t.elements[key].doc.innerHTML = blob.blobSVG.innerHTML;
		}else if(data.type == "text/plain"){
			//////debugger;
			t.elements[key].innerHTML = blob.innerHTML;//this.responseXML.getElementsByTagName("body")[0].innerHTML;//.firstChild.nodeValue;
			
			
			if(blob.script.length > 0){
				t.elements[key].innerJS = [];
				blob.script.Init && (t.elements[key].innerJS["Init"] = blob.script.Init.innerHTML);
				blob.script.onResize && (t.elements[key].innerJS["onResize"] = blob.script.onResize.innerHTML);
				blob.script.onLoad && (t.elements[key].innerJS["onLoad"] = blob.script.onLoad.innerHTML);
				blob.script.Loaded && (t.elements[key].innerJS["Loaded"] = blob.script.Loaded.innerHTML);
				blob.script.Update && (t.elements[key].innerJS["Update"] = blob.script.Update.innerHTML);
				blob.script.Mousewheel && (t.elements[key].innerJS["Mousewheel"] = blob.script.Mousewheel.innerHTML);
				
			}
			//t.elements[key].innerJS = blob.script;//this.responseXML.getElementsByTagName("script")[0].innerText;    
			
			if(data.classNameParent)
				t.elements[key].classNameParent = data.classNameParent;
			else if(data.tagNameParent)
				t.elements[key].classNameParent = data.tagNameParent;
		}else if (data.type == 'image/png'){
			var blobUrl = blob.blobUrl;//URL.createObjectURL(blob);
			
			if( Utils.isArray(data.src) == true){
				if(t.elements[key].blobUrl == null)
					t.elements[key].blobUrl = [];
				
				if(t.elements[key].blobBase64 ==  true){
					var reader = new FileReader();
					reader.onload = function(){
						////debugger;
						var dataUrl = reader.result;
						var testBase64 = dataUrl.split(',')[1];
						testBase64 = "data:image/jpg;base64,"+testBase64 ;
						t.elements[key].blobUrl[order] = testBase64;//dataUrl;
					};
					reader.readAsDataURL(blob.blobResponse);
					
					if( order != t.elements[key].blobUrlDefault)
						window.URL.revokeObjectURL(blobUrl);
					
				}else
					t.elements[key].blobUrl[order] = blobUrl;
				
				if(order == t.elements[key].blobUrlDefault){
					t.elements[key].doc.src = blobUrl;
				}else
					t.onLoadImageCount--;
			}else
				t.elements[key].doc.src = blobUrl;
		
			t.elements[key].doc.onload = function (e)
			{
				//if(key == "bg_MainTopSelect")
				//	////debugger;
				//console.log("onload2 " + key);

				if(t.elements[key].isLoaded == true)
					return;
				/*
				if(t.elements[key].blobUrl != null){
					if(t.elements[key].blobUrl.length == t.elements[key].blobUrlCount)
						t.elements[key].isLoaded = true;
					//else
					//	t.elements[key].isLoaded = true;
				}else {
					t.elements[key].isLoaded = true;
				}
				*/
				//if(t.elements[key].isLoaded != true){
					t.elements[key].naturalHeight = e.srcElement.naturalHeight;//e.target.clientHeight;
					t.elements[key].naturalWidth = e.srcElement.naturalWidth;//e.target.clientWidth;
					t.elements[key].doc.style.height = e.srcElement.naturalHeight + "px";
					t.elements[key].doc.style.width = e.srcElement.naturalWidth + "px";
					if(data.revokeBlobUrl != false)
						window.URL.revokeObjectURL(blobUrl);
					
					//if(key == "bg_MainTopSelect")
					//	console.log('B. bg_MainTopSelect naturalHeight : ' + t.elements[key].naturalHeight);
					
					if((typeof updateDiv) != "undefined"){
						if(key == "MainContainer")
							updateDiv(t.elements[key],true, true);
						else
							updateDiv(t.elements[key],true);
					}
				//}
				t.LoadedFiles.push(key);
				t.elements[key].isLoaded = true;
				t.onLoadImageCount--;
				t.CreateAllElements();
			
			}
		}
		
		// TODO : prevent to redefine naturalHeight when multiple image is loaded ( better condition ?) 
		if(t.elements[key].isLoaded == true)
			return;
			
		if(t.elements[key].options.isStyle == true){
			//this.elements[key].style = {};
				
			t.elements[key].doc.style.left = data.style.left || '0px';
			t.elements[key].doc.style.top =  data.style.top || '0px';
			t.elements[key].doc.style.opacity =  data.style.opacity || 0;
			t.elements[key].doc.style.display = data.style.display || 'block';//'none';
			t.elements[key].doc.style.position = 'absolute'; 
			t.elements[key].doc.style.overflow = 'auto'; 
			
			if(data.style.cssText)
				if(data.style.cssText.length > 0)
					t.elements[key].doc.style.cssText = data.style.cssText;

		}
		if(t.elements[key].doc != null){
			t.elements[key].doc.className = data.className;
			t.elements[key].doc.style.zIndex = data.zIndex;
			t.elements[key].doc.draggable = false;
		}



		if(t.elements[key].options.isEvent == true){
			//////debugger;
			var eventList = data.event;
			for (eventName in eventList){
				t.elements[key].doc[eventName] = eventList[eventName];
			}
			
		}

		if(data.type != "text/plain"){
			if(data.classNameParent)
				window.document.getElementsByClassName(data.classNameParent)[(data.classNameParentID || 0)].appendChild(t.elements[key].doc);//getElementsByTagName, document.getElementById('body').appendChild(t.elements[key].img);
			else
				window.document.getElementsByTagName(data.tagNameParent)[0].appendChild(t.elements[key].doc);//getElementsByTagName, document.getElementById('body').appendChild(t.elements[key].img);

			
			t.elements[key].naturalHeight = parseFloat(t.elements[key].doc.style.getPropertyValue("height"), 10);//this.elements[key].doc.clientHeight;
			t.elements[key].naturalWidth = parseFloat(t.elements[key].doc.style.getPropertyValue("width"), 10);//this.elements[key].doc.clientWidth;
			t.elements[key].naturalLeft = (data.style && parseFloat(data.style.left, 10) ) || 0;
			t.elements[key].naturalTop = (data.style && parseFloat(data.style.top, 10) ) || 0;
		

			if(t.elements[key].options.isTween == true){
				t.elements[key].tween = new Tweener(t.elements[key], data.tween);
				t.elements[key].naturalLeft = data.tween.position.x;
				t.elements[key].naturalTop = data.tween.position.y;
			}
		}
		
		
		
		
		return;
	
	},
	BuildContent: function(dataList, callback) 
	{
		//debugger;
		var i, key;
		var len = dataList.length;
		this.LoadedFilesTotal = len;
		this.onStartCallback = callback;
		this.preloaderCount = 0;
		this.preloaderList = [];
		this.preloaderPercent = 0;
		//check how many image should be call in onload event
		for(i = 0;i<len;i++){
			type = dataList[i].type;
			if(type == "image/png") {
				if( Utils.isArray(dataList[i].src) == true){
					this.onLoadImageCount += dataList[i].src.length ;
					////debugger;
				}else
					this.onLoadImageCount++;
			}
		}	
			
		for(i = 0;i<len;i++){

			key = dataList[i].className;
			if(key == null) continue;
			if(this.elements[key] == null){
			
				var parentIndex = 0;
				if(this.elements[dataList[i].classNameParent || dataList[i].tagNameParent] != null) {
					parentIndex = parseInt( this.elements[dataList[i].classNameParent || dataList[i].tagNameParent].doc.style.zIndex || 0 );
				}
				
				
				dataList[i].zIndex = dataList[i].zIndex || (i + parentIndex);
				this.LoadContent(dataList[i],callback);
			}else{
				//if duplicate name in dataList
				this.LoadedFilesTotal--;
			}
		}
	},
	LoadContent: function(data, callback) 
	{
		//////debugger;
		var t = this;
		var key = data.className;
		
		this.elements[key] = {};
		this.elements[key].options = data.options;
		this.elements[key].type = data.type;
		this.elements[key].center = data.center || false;
		this.elements[key].onresize = data.onresize || true;
		this.elements[key].LoadedBytes = 0;
		this.elements[key].LoadedBytesTotal = 0;
		this.elements[key].LoadedBytesOld = 0;
		this.elements[key].LoadedBytesTotalOld = 0;
		//this.onStartCallback = callback;
		
		// if HTML Element doc, dont need load request
		if(data.type == 'HTMLElement'){
			t.preloader && t.preloader(key);
			t.CreateElement(data, key);
			t.CreateAllElements(callback);
			return;
		}
		/*
		if(data.type == 'HTMLElement'){
			//////debugger;
			this.elements[key].doc = window.document.createElement("div");
			if(this.elements[key].options.isStyle == true){
				//this.elements[key].style = {};
					
				this.elements[key].doc.style.left = data.style.left || '0px';
				this.elements[key].doc.style.top =  data.style.top || '0px';
				this.elements[key].doc.style.opacity =  data.style.alpha || 0;
				this.elements[key].doc.style.display = data.style.display || 'block';//'none';
				this.elements[key].doc.style.position = 'absolute'; 
				this.elements[key].doc.style.overflow = 'auto'; 
				
				if(data.style.cssText)
					if(data.style.cssText.length > 0)
						this.elements[key].doc.style.cssText = data.style.cssText;
						//console.log(this.elements[key].doc.clientHeight + " " + this.elements[key].doc.clientWidth);
				
				
				//this.elements[key].naturalHeight = this.elements[key].doc.clientHeight;
				//this.elements[key].naturalWidth = this.elements[key].doc.clientWidth;
			}
			this.elements[key].doc.className = data.className;
			t.elements[key].doc.style.zIndex = data.zIndex;

			if(data.classNameParent)
				window.document.getElementsByClassName(data.classNameParent)[0].appendChild(t.elements[key].doc);//getElementsByTagName, document.getElementById('body').appendChild(t.elements[key].img);
			else
				window.document.getElementsByTagName(data.tagNameParent)[0].appendChild(t.elements[key].doc);//getElementsByTagName, document.getElementById('body').appendChild(t.elements[key].img);

			this.elements[key].naturalHeight = parseFloat(this.elements[key].doc.style.getPropertyValue("height"), 10);//this.elements[key].doc.clientHeight;
			this.elements[key].naturalWidth = parseFloat(this.elements[key].doc.style.getPropertyValue("width"), 10);//this.elements[key].doc.clientWidth;
			this.elements[key].naturalLeft = data.style.left || 0;
			this.elements[key].naturalTop = data.style.top || 0;
			
			//if(this.elements[key].options.isTween == true){
			//	this.elements[key].tween = new Tween(this.elements[key]);
			//}
			if(t.elements[key].options.isTween == true){
				t.elements[key].tween = new Tweener(t.elements[key], data.tween);
				t.elements[key].naturalLeft = data.tween.position.x;
				t.elements[key].naturalTop = data.tween.position.y;
			}
			
			//if(this.elements[key].options.isEvent == true){
			//}
			
			
			this.LoadedFiles.push(key);
			
			this.CreateAllElements(callback);
			
			return;
		}
		*/
		
		// data is array or not
		//////debugger;
		if( Utils.isArray(data.src) == false)
			this.requestContent(data, callback, data.src);
		else{
			t.elements[key].blobUrlDefault = data.blobUrlDefault || 0;
			t.elements[key].blobBase64 = data.blobBase64 || 0;
			t.elements[key].blobUrlCount = data.blobUrlCount || 0;
			//this.LoadedFilesTotal++;
			var i = 0;
			for(i = 0; i < data.src.length; i++)
				this.requestContent(data, callback, data.src[i], i);
		}
		
	},
	requestContent: function(data, callback, src, order = 0) {
		//////debugger;
		var key = data.className;
		var t = this;
		
		var xhr = new XMLHttpRequest();
		
		//define absolute path
		//if(this.realPathURL != null) src = this.realPathURL + src;
		////debugger;
		
		xhr.open('GET', src, true);//xhr.open('GET', data.src, true);
		//xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
		
		if(this.elements[key].type == "text/plain" )
			xhr.responseType = 'document';
		else if(this.elements[key].type == "image/svg+xml")
			xhr.responseType = 'document'; 
		else
			xhr.responseType = 'blob';
		

		xhr.onload = function(e) {
			//if(key == 'menu_media')
			//	////debugger;
			
			/*
			if(data.type == "text/plain"){
				////debugger
				t.elements[key].innerHTML = this.responseXML.getElementsByTagName("body")[0].innerHTML;//.firstChild.nodeValue;
				t.elements[key].innerJS = this.responseXML.getElementsByTagName("script")[0].innerText;    
				
				if(data.classNameParent)
					t.elements[key].classNameParent = data.classNameParent;
				else if(data.tagNameParent)
					t.elements[key].classNameParent = data.tagNameParent;
			}else{
				var blob = new Blob([this.response], {type: data.type}); 
				var blobUrl = URL.createObjectURL(blob);
				
				if(t.elements[key].doc == null)
					t.elements[key].doc = window.document.createElement("img");
				
				
				if( Utils.isArray(data.src) == true){
					if(t.elements[key].blobUrl == null)
						t.elements[key].blobUrl = [];
					
					t.elements[key].blobUrl[order] = blobUrl;
					
					if(order == t.elements[key].blobUrlDefault)
						t.elements[key].doc.src = blobUrl;
				}else
					t.elements[key].doc.src = blobUrl;
				
				t.elements[key].doc.className = data.className;
				t.elements[key].doc.onload = function (e)
				{
					//if(key == 'menu_media')
					//	////debugger;
					//////debugger;
					t.elements[key].naturalHeight = e.srcElement.naturalHeight;//e.target.clientHeight;
					t.elements[key].naturalWidth = e.srcElement.naturalWidth;//e.target.clientWidth;
					t.elements[key].doc.style.height = e.srcElement.naturalHeight + "px";
					t.elements[key].doc.style.width = e.srcElement.naturalWidth + "px";
					window.URL.revokeObjectURL(blobUrl);
					console.log("onload " + key);
					
					if(key == "MainContainer")
						updateDiv(t.elements[key],true, true);
					else
						updateDiv(t.elements[key],true);
				
				}
			
			}
			
			if(t.elements[key].options.isStyle == true){
				t.elements[key].doc.style.left = data.style.left || '0px';
				t.elements[key].doc.style.top =  data.style.top || '0px';
				t.elements[key].doc.style.opacity =  data.style.opacity || 0;
				t.elements[key].doc.style.display = data.style.display || 'block';//'none';
				//visibility = 'hidden';//'none';
				t.elements[key].doc.style.position = 'absolute'; 
				t.elements[key].doc.style.overflow = 'auto'; 
				
				if(data.style.cssText)
					if(data.style.cssText.length > 0)
						t.elements[key].doc.style.cssText = data.style.cssText;
				//t.elements[key].naturalTop = data.style.top || 0;
				//t.elements[key].doc.style.clientHeight = t.elements[key].doc.style.clientHeight || 0;;
				//t.elements[key].doc.style.clientWidth = t.elements[key].doc.style.clientHeight || 0;;
				
			}
			if(t.elements[key].doc != null)
				t.elements[key].doc.style.zIndex = data.zIndex;
			

						
			if(t.elements[key].options.isEvent == true){
				//////debugger;
				var eventList = data.event;
				for (eventName in eventList){
					t.elements[key].doc[eventName] = eventList[eventName];
				}
				
			}
			
			if(data.type != "text/plain"){
				if(data.classNameParent)
					window.document.getElementsByClassName(data.classNameParent)[0].appendChild(t.elements[key].doc);//getElementsByTagName, document.getElementById('body').appendChild(t.elements[key].img);
				else 
					window.document.getElementsByTagName(data.tagNameParent)[0].appendChild(t.elements[key].doc);//getElementsByTagName, document.getElementById('body').appendChild(t.elements[key].img);

			
				t.elements[key].naturalHeight = t.elements[key].naturalHeight || t.elements[key].doc.clientHeight;
				t.elements[key].naturalWidth = t.elements[key].naturalWidth || t.elements[key].doc.clientWidth;
				t.elements[key].naturalLeft = t.elements[key].naturalLeft  || t.elements[key].doc.offsetLeft;
				t.elements[key].naturalTop = t.elements[key].naturalTop || t.elements[key].doc.offsetTop;
				
				if(t.elements[key].options.isTween == true){
					t.elements[key].tween = new Tweener(t.elements[key], data.tween);
					t.elements[key].naturalLeft = data.tween.position.x;
					t.elements[key].naturalTop = data.tween.position.y;
				}	
			
			}
			
			//var ratio = _browserClient.ratio;
			//t.elements[key].naturalHeight *= ratio;
			//t.elements[key].naturalWidth *= ratio;
			//t.elements[key].naturalLeft *= ratio;
			//t.elements[key].naturalTop *= ratio;
			*/
			//////debugger;
			var blob = {};
			if(data.type == "text/plain"){
				////debugger
				blob.innerHTML = this.responseXML.getElementsByTagName("body")[0].innerHTML;//.firstChild.nodeValue;
				blob.script = this.responseXML.getElementsByTagName("script");//[0].innerText;    
			}else if(data.type == "image/svg+xml"){
				blob.blobSVG = this.responseXML.getElementsByTagName("svg")[0];
			}else{
				blob.blobResponse = new Blob([this.response], {type: data.type}) ;
				blob.blobUrl = URL.createObjectURL( blob.blobResponse );
			}
			t.CreateElement(data, key, blob, order);
				
			t.CreateAllElements(callback);
			 
		};
		
		xhr.onprogress = function(e) {
			if (e.lengthComputable)
			{
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
			}
		};
		
		xhr.onerror = function(e) {
			alert("Error " + e.target.status + " occurred while receiving the document.");
		};
		
		xhr.send();
	},
	loadPage: function(divName, arrayPages) 
	{
		var t = this;
		//debugger;
		//console.log("loadPage " + divName + " " + arrayPages);
		
		t.arrayPages = arrayPages;

				
		var i = 0;
		var pageCurr;// = arrayPages[0];
				
		//return;
		var data;
		var dataList = [];
		
		
		
		var element = t.elements["bg_MainTopSelect"];
		if(element == null){
			data = t.setElement("image/png", {isTween:true,isStyle:true,isEvent:true} );
			data.src = [];
			data.src[0] = "./assets/img/bg_MainTopSelectOff.png";
			data.src[1] = "./assets/img/bg_MainTopSelectOn.png";
			data.blobUrlDefault = 0;
			data.blobUrlCount = data.src.length;
			data.className = "bg_MainTopSelect";
			data.classNameParent = "MainTopContainer";
			data.revokeBlobUrl = false;
			data.tween.position = {x:0,y:0};
			data.tween.positionBefore = {x:0,y:0};
			data.tween.positionAfter = {x:0,y:0};
			data.tween.alpha = 0;
			data.tween.delay = 500;
			data.tween.duration = 1200;
			data.tween.autoplay = false;
			data.zIndex = 100;
			data.event.onclick = function(){
				//_DataManager.elements["scrollbar_main"].doc.style.top = _DataManager.elements["scrollbar_main"].naturalTop*_browserClient.ratio;
				//console.log("bg_MainTopSelect");
			}
			dataList.push(data);
		}
		////debugger;
		for(i = 0 ; i < arrayPages.length; i++){
			pageCurr = arrayPages[i];
			elemName = "menuSub"+pageCurr
			element = t.elements[elemName];
			if(element == null){
				data = t.setElement("image/png", {isTween:true,isStyle:true,isEvent:false} );
				data.src = "./assets/img/"+elemName+".png";
				data.className = elemName;
				data.classNameParent = "MainTopContainer";
				data.tween.position = {x:(-70*0.5+56*0.5)*0,y:15};
				data.tween.positionBefore = {x:0,y:50};
				data.tween.positionAfter = {x:0,y:0};
				data.tween.alpha = 0;
				data.tween.delay = 0;
				data.tween.duration = 1000;
				data.tween.autoplay = false;
				//data.zIndex = 100;
				dataList.push(data);
			}
			//break;
		}
		

		
		
		for(i = 0 ; i < arrayPages.length; i++){
			pageCurr = arrayPages[i];
			element = t.elements[pageCurr];
			if(element == null){
				data = t.setElement("text/plain", {isTween:false,isStyle:false,isEvent:false});
				data.src = "./"+pageCurr+".html";
				data.className = pageCurr;
				data.classNameParent = divName;
				dataList.push(data);
			}	
		}
		

		var callback = function(){
			
			//console.log('******** Page Title 3!!!!');
			
			//////debugger;
			//t.elements["MainSubContainer"].select = null;
			//t.elements["MainSubContainer"].pageID = null;
			//t.elements["MainSubContainer"].pageCurr = null;
			//t.elements["MainSubContainer"].doc.style.opacity = "0";
			t.displayPageTopContainer(arrayPages);
			t.displayPageSubContainer(arrayPages);
			//if( t.elements["MainSubContainer"].tween.isPlaying() || t.elements["MainTopContainer"].tween.isPlaying() ){
			
			// play each time, except first time, where tween is done from dispatcher
			/*
			t.elements["MainTopContainer"].tween.reset(true);
			t.elements["MainSubContainer"].tween.reset(true);
			t.elements["MainSubContainer"].tween.play();
			t.elements["MainTopContainer"].tween.play();
			t.elements["MainSubContainer"].doc.style.display = "block";
			t.elements["MainTopContainer"].doc.style.display = "block";
			*/
			//t.displayPageTopContainerTitle('onclickMenu');
		}
		
		if(dataList.length > 0){
			t.onLoadedCallback = function(){_DataManager.onLoadedCallback = null;callback();} ;
			t.BuildContent(dataList, function(){setWindowSize();} );
		}else
			callback();
		
	},
	onLoadedPageSubContainer:function(compute = true, tween = true) 
	{	
		var t = this;
		
		

		
		if(compute == true){
			var pageCurr = t.elements["MainSubContainer"].select;
			
			//resize
			var defaultWidthMax = 640;
			if(tween == true){
						//var size = _browserClientwidth/defaultWidth;
						
						//t.elements[pageCurr].defaultWidth = 2*t.elements["MainSubContainer"].doc.clientWidth;
						//if(t.elements[pageCurr].defaultWidth != t.elements["MainSubContainer"].doc.clientWidth)
							t.elements[pageCurr].defaultWidth = null
						//else
						//	t.elements[pageCurr].defaultWidth = (t.elements[pageCurr].defaultWidth*t.elements[pageCurr].defaultWidthMax)/ t.elements["MainSubContainer"].doc.clientWidth;
			}
			// 2.compute
			var defaultWidth = t.elements[pageCurr].defaultWidth ||  t.elements[pageCurr].defaultWidthMax  || defaultWidthMax;
			console.log('onLoadedPageSubContainer ' + pageCurr);

			t.elements[pageCurr].innerJS["onResize"] && eval("var defaultWidth = "+defaultWidth+";"+"var filename = '"+pageCurr+"';"+"var _browserClientwidth = "+t.elements["MainSubContainer"].doc.clientWidth+";"+_DataManager.elements[pageCurr].innerJS["onResize"]);
			if(t.elements[pageCurr].defaultWidthMax == null)t.elements[pageCurr].defaultWidthMax = t.elements["MainSubContainer"].doc.clientWidth;
			t.elements[pageCurr].defaultWidth = t.elements["MainSubContainer"].doc.clientWidth;
			
			//if(t.elements[pageCurr].scrollHeight != t.elements["MainSubContainer"].doc.scrollHeight){// optimization dispatch trick
			//A. update elements["MainSubContainer"].scrollOffsetBottomY 
			var offsetTopY = t.elements["MainSubContainer"].doc.offsetHeight*0.33;
			var offsetBottomY = parseFloat(t.elements["MainSubContainer"].doc.style.height, 10);
			
			//0. update invisibleTop table
			//t.elements["MainSubContainer"].doc.getElementsByClassName("invisibleTop")[0].style.setProperty('height',offsetTopY.toString()+"px");

			
			// 1. update first bottom ornament height
			var contentOffsetHeight = t.elements["MainSubContainer"].doc.getElementsByClassName("tableClass")[0].offsetHeight;
			var percentHeightOrnament = 100-(contentOffsetHeight  / t.elements["MainSubContainer"].doc.offsetHeight )*100;
			if(percentHeightOrnament < 0) percentHeightOrnament = 0;
			percentHeightOrnament = percentHeightOrnament.toString();
			t.elements["MainSubContainer"].doc.getElementsByClassName("tableClassOrnament")[1].style.setProperty('height',percentHeightOrnament+"%");

			var ornamentOffsetHeight = t.elements["MainSubContainer"].doc.getElementsByClassName("tableClassOrnament")[1].offsetHeight;
			
			//2. compute
			var scrollHeight = contentOffsetHeight;//t.elements["MainSubContainer"].doc.scrollHeight - offsetTopY;
			if(scrollHeight>offsetBottomY) offsetBottomY = scrollHeight + offsetTopY + ornamentOffsetHeight;
			else offsetBottomY += offsetTopY;	
			// adjust new value		
			t.elements["MainSubContainer"].scrollOffsetBottomY = offsetBottomY;
			
			//update invisibleBottom table
			//t.elements["MainSubContainer"].doc.getElementsByClassName("invisibleBottom")[0].style.setProperty('top',offsetBottomY.toString()+"px");

			t.elements["MainSubContainer"].doc.scrollTop = 0;//offsetTopY; // focus on top
			t.elements["MainSubContainer"].scrollOffsetTopY = offsetTopY;
			t.elements[pageCurr].scrollOffsetTopY = t.elements["MainSubContainer"].scrollOffsetTopY;
			t.elements[pageCurr].scrollOffsetBottomY = t.elements["MainSubContainer"].scrollOffsetBottomY;
			t.elements[pageCurr].scrollTop = t.elements["MainSubContainer"].doc.scrollTop;
			t.elements[pageCurr].scrollHeight = t.elements["MainSubContainer"].doc.scrollHeight;
		}
		//}
		// B. play tween
		if(tween == true){
			//t.elements["MainSubContainer"].defaultWidth = null;
		
			//t.elements["MainTopContainer"].tween.reset(true);
			t.elements["MainSubContainer"].tween.reset(true);
			t.elements["MainSubContainer"].tween.play();
			//t.elements["MainTopContainer"].tween.play();
			t.elements["MainSubContainer"].doc.style.display = "block";
			t.elements["MainTopContainer"].doc.style.display = "block";
		}
		
		//if(t.elements["MainSubContainer"].select)
		if(compute == true)
			if( t.elements[t.elements["MainSubContainer"].select].pageLoaded == true && t.elements[t.elements["MainSubContainer"].select].outputHTML == null ){
				console.log('aaaaaaaaaaaaaa');
				t.elements[t.elements["MainSubContainer"].select].outputHTML = t.elements["MainSubContainer"].doc.innerHTML;//t.elements[t.elements["MainSubContainer"].select].innerHTML;
			}
	},
	displayPageSubContainer: function(arrayPages, topContainerClassName, isMouseOver = false) 
	{	
		//debugger;
		var t = this;
		
		var pageID = -1;
		var pagePrev = t.elements["MainSubContainer"].pageCurr;
		var pageCurr = arrayPages[0];
		
		//DEFINE SEO default URL here only once otherwise add URL
		var redirectory = SEO.directory.pageID;
		if(redirectory != null){
			var id = SEO.directory.pageID-1;
			if(id>-1)
				topContainerClassName = "bg_MainTopSelect"+id;
			else
				topContainerClassName = "bg_MainTopSelect";
			SEO.directory.pageID = null;
		}
		
		if(topContainerClassName != null){
			if(topContainerClassName == "bg_MainTopSelect"){
				pageCurr = arrayPages[0];
			}
			else if(topContainerClassName == "bg_MainTopSelect0"){
				pageCurr = arrayPages[1];
				pageID = 0;
			}
			else if(topContainerClassName == "bg_MainTopSelect1"){
				pageCurr = arrayPages[2];
				pageID = 1;
			}
			else if(topContainerClassName == "bg_MainTopSelect2"){
				pageCurr = arrayPages[3];
				pageID = 2;
			}
			else if(topContainerClassName == "bg_MainTopSelect3"){
				pageCurr = arrayPages[4];
				pageID = 3;
			}
			else if(topContainerClassName == "bg_MainTopSelect4"){
				pageCurr = arrayPages[5];
				pageID = 4;
			}
		}
		
		if(redirectory == null && isMouseOver == false){
			SEO.addURL(pageCurr);
		}
		
		if(pagePrev != pageCurr){
			//console.log("case: pagePrev != pageCurr");
			/*
			if(pagePrev != null){
				t.elements["menuSub"+pagePrev].tween.reset(true);
				t.elements["menuSub"+pagePrev].tween.alpha = 0; 
				t.elements["menuSub"+pagePrev].doc.style.opacity = 0; 
			}
			
			
			if(t.elements["menuSub"+pageCurr].tween.position.x == 0){
				t.elements["menuSub"+pageCurr].tween.position.x = (-t.elements["menuSub"+pageCurr].naturalWidth*0.5+56*0.5);

			}
			
			t.elements["menuSub"+pageCurr].tween.reset(true);
			t.elements["menuSub"+pageCurr].tween.play();
			*/
			t.elements["MainSubContainer"].pagePrev = t.elements["MainSubContainer"].select ;
			t.elements["MainSubContainer"].pageCurr = pageCurr;
			//console.log(pageCurr);
		}
		if(isMouseOver == false && t.elements["MainSubContainer"].select != pageCurr){
			//////debugger;
			
			// should remove and put in dispatch
			/*
			if(t.elements["MainSubContainer"].select)
				if( t.elements[t.elements["MainSubContainer"].select].pageLoaded == true && t.elements[t.elements["MainSubContainer"].select].outputHTML == null ){
					//////debugger;
					console.log('set output.html');
					t.elements[t.elements["MainSubContainer"].select].outputHTML = t.elements["MainSubContainer"].doc.innerHTML;//t.elements[t.elements["MainSubContainer"].select].innerHTML;
				}
			*/
			
			//console.log("case: isMouseOver == false");
			var oldPageID = t.elements["MainSubContainer"].pageID ;
			if(oldPageID === null) oldPageID = -1;
			
			if(oldPageID > -1){
				if(t.elements["bg_MainTopSelect"].clone.length > oldPageID)//if still exist and not deleted
					t.elements["bg_MainTopSelect"].clone[oldPageID].src = t.elements["bg_MainTopSelect"].blobUrl[0];
			}else
				t.elements["bg_MainTopSelect"].doc.src = t.elements["bg_MainTopSelect"].blobUrl[0];
			
			t.elements["MainSubContainer"].pageID = pageID;
			t.elements["MainSubContainer"].select = pageCurr;
			
			if(pageID > -1){
				if(t.elements["bg_MainTopSelect"].clone.length > pageID)//if still exist and not deleted
					t.elements["bg_MainTopSelect"].clone[pageID].src = t.elements["bg_MainTopSelect"].blobUrl[1];
			}else
				t.elements["bg_MainTopSelect"].doc.src = t.elements["bg_MainTopSelect"].blobUrl[1];
			
			// make invisible until final display
			t.elements["MainSubContainer"].doc.style.opacity = "0";
			
			if(! (t.elements[pageCurr].pageLoaded == true)){

				//////debugger;
				var offsetTopY = t.elements["MainSubContainer"].doc.offsetHeight*0.33;
				//add invisible table (top)
				t.elements["MainSubContainer"].doc.innerHTML = '';//'<table class="invisibleTop" style="border-style: solid;  border-width: 0px ; border-color: rgb( 255, 0, 0); width: 100%; height: '+offsetTopY+'px;"><tr><td></td></tr></table>';
				
				// add ornament top
				var subTableHTML2 = '<table class="tableClassOrnament" style="border-style: solid;  border-width: 0px ; border-color: rgb( 0, 0, 255); width:100%">';
				subTableHTML2 += '<tr><td align="center" valign="bottom"><img src="'+t.elements["menuSub_top"].doc.src+'" style="'+t.elements["menuSub_top"].doc.style.cssText+'"></td></tr>';
				//subTableHTML2 += '<tr><td align="center" valign="bottom"><div class="svgCore" signature="stroke-dashoffset 25s ease-in-out" width="640" height="65" data="./assets/svg/menuSub_top.svg"></div></td></tr>';

				
				
				subTableHTML2 += '</table>';
				//t.elements["MainSubContainer"].doc.innerHTML += subTableHTML2;
				
				//////debugger;
				// add content
				var subTableHTML = '<table class="tableClass" style="border-style: solid;  border-width: 0px ; border-color: rgb( 255, 0, 0);  width: 100%;"><tr><td>'+subTableHTML2+t.elements[pageCurr].innerHTML+'</td></tr></table>';
				t.elements["MainSubContainer"].doc.innerHTML += subTableHTML;//t.elements[pageCurr].innerHTML;
				////debugger;
				//compute
				var contentOffsetHeight = t.elements["MainSubContainer"].doc.getElementsByClassName("tableClass")[0].offsetHeight;
				

				
				var offsetBottomY = parseFloat(t.elements["MainSubContainer"].doc.style.height, 10);
				var scrollHeight = t.elements["MainSubContainer"].doc.scrollHeight - offsetTopY;
				
				// add ornament bottom
				var percentHeightOrnament = 100-(contentOffsetHeight  / t.elements["MainSubContainer"].doc.offsetHeight )*100;
				var styleHeightOrnament = "height:"+percentHeightOrnament+"%;";
				subTableHTML = '<table class="tableClassOrnament" style="border-style: solid;  border-width: 0px ; border-color: rgb( 0, 0, 255);'+styleHeightOrnament+'width:100%">';
				subTableHTML += '<tr><td align="center" valign="bottom"><center><img src="'+t.elements["menuSub_end"].doc.src+'"></center></td></tr>';
				subTableHTML += '</table><br>';
				t.elements["MainSubContainer"].doc.innerHTML += subTableHTML;
				var ornamentOffsetHeight = t.elements["MainSubContainer"].doc.getElementsByClassName("tableClassOrnament")[1].offsetHeight;
				

				//console.log("offsetBottomY : " + offsetBottomY);
				//console.log("scrollHeight : " + scrollHeight);
				if(scrollHeight>offsetBottomY) offsetBottomY = scrollHeight + offsetTopY + ornamentOffsetHeight;
				else offsetBottomY += offsetTopY;
				
				

				
				
				//add invisible table (bottom)
				//t.elements["MainSubContainer"].doc.innerHTML += '<table class="invisibleBottom" style="position: absolute; top:'+offsetBottomY+'px;border-style: solid;  border-width: 0px ; border-color: rgb( 0, 255, 0); width: 100%;  height: '+offsetTopY+'px;"><tr><td></td></tr></table>';
				
				t.elements["MainSubContainer"].scrollOffsetTopY = offsetTopY;
				t.elements["MainSubContainer"].scrollOffsetBottomY = offsetBottomY;
				
				t.elements["MainSubContainer"].doc.scrollTop = t.elements["MainSubContainer"].scrollOffsetTopY;
				//////debugger;
			}
			
			
			
			if(t.elements[pageCurr].pageLoaded == true){
				console.log('get output.html' + pageCurr);
				t.elements["MainSubContainer"].doc.innerHTML = t.elements[pageCurr].outputHTML;
				t.elements["MainSubContainer"].scrollOffsetTopY = t.elements[pageCurr].scrollOffsetTopY;
				t.elements["MainSubContainer"].scrollOffsetBottomY = t.elements[pageCurr].scrollOffsetBottomY;
				t.elements["MainSubContainer"].doc.scrollTop = t.elements[pageCurr].scrollTop;
				t.elements["MainSubContainer"].doc.scrollHeight = t.elements[pageCurr].scrollHeight;
				
				
				//correct ornament top/bottom dynamicly
				t.elements["MainSubContainer"].doc.getElementsByClassName("tableClassOrnament")[0].getElementsByTagName("td")[0].innerHTML = '';
				t.elements["MainSubContainer"].doc.getElementsByClassName("tableClassOrnament")[0].getElementsByTagName("td")[0].appendChild(t.elements["menuSub_top"].doc);
				t.elements["MainSubContainer"].doc.getElementsByClassName("tableClassOrnament")[1].getElementsByTagName("td")[0].getElementsByTagName("center")[0].innerHTML = '';
				t.elements["MainSubContainer"].doc.getElementsByClassName("tableClassOrnament")[1].getElementsByTagName("td")[0].getElementsByTagName("center")[0].appendChild(t.elements["menuSub_end"].doc);
				
				t.elements[pageCurr].innerJS["Loaded"] && eval("var filename = '"+pageCurr+"';"+t.elements[pageCurr].innerJS["Loaded"]);
				_Dispatcher.dispatchEvent('SubMainDataLoaded',[true]); // should be in the Inner file...
			}else{
				console.log('get output.html(2)' + pageCurr);
				//correct ornament top/bottom dynamicly
				t.elements["MainSubContainer"].doc.getElementsByClassName("tableClassOrnament")[0].getElementsByTagName("td")[0].innerHTML = '';
				t.elements["MainSubContainer"].doc.getElementsByClassName("tableClassOrnament")[0].getElementsByTagName("td")[0].appendChild(t.elements["menuSub_top"].doc);
				t.elements["MainSubContainer"].doc.getElementsByClassName("tableClassOrnament")[1].getElementsByTagName("td")[0].getElementsByTagName("center")[0].innerHTML = '';
				t.elements["MainSubContainer"].doc.getElementsByClassName("tableClassOrnament")[1].getElementsByTagName("td")[0].getElementsByTagName("center")[0].appendChild(t.elements["menuSub_end"].doc);
				
				var _onLoad = function(){eval(t.elements[pageCurr].innerJS["onLoad"])};
				t.elements[pageCurr].innerJS["Init"] && eval("var filename = '"+pageCurr+"';"+t.elements[pageCurr].innerJS["Init"]);
				//t.elements[pageCurr].outputHTML = t.elements["MainSubContainer"].doc.innerHTML;
				
				t.elements[pageCurr].scrollOffsetTopY = t.elements["MainSubContainer"].scrollOffsetTopY;
				t.elements[pageCurr].scrollOffsetBottomY = t.elements["MainSubContainer"].scrollOffsetBottomY;
				t.elements[pageCurr].scrollTop = t.elements["MainSubContainer"].doc.scrollTop;
				t.elements[pageCurr].scrollHeight = t.elements["MainSubContainer"].doc.scrollHeight;
				
				t.elements[pageCurr].pageLoaded = true;// set in the dispatch ?
			}
			
			t.displayPageTopContainerTitle('onload');
			
		}
		

		
	},
	displayPageTopContainer: function(arrayPages) 
	{
		var t = this;
		//////debugger;
		
		//console.log("arrayPages: " + arrayPages);
		//console.log("pageCount: " + arrayPages-1);
		
		var i = 0;
		var elemName;
		
		// check children of the div and create/remove according arrayPages
		var childElementCount = _DataManager.elements["MainTopContainer"].doc.childElementCount;
		var pageCount = arrayPages.length-1;// - childElementCount;
				
				
		//window.document.getElementsByClassName("MainTopContainer")[0].appendChild(window.document.createElement("img"));

		//elemName = t.elements["MainTopContainer"].doc.children[0].className;
		t.setClone("bg_MainTopSelect", pageCount);
		
		t.elements["bg_MainTopSelect"].doc.ontween = function(){
			//var elemParent = window.document.getElementsByClassName("MainTopContainer")[0];
			var elemChildReferenceX = parseInt(t.elements["bg_MainTopSelect"].doc.style.getPropertyValue("left"), 10);
			var elemChildReferenceY = parseInt(t.elements["bg_MainTopSelect"].doc.style.getPropertyValue("top"), 10);
			var elemChildReferenceOpacity = t.elements["bg_MainTopSelect"].doc.style.getPropertyValue("opacity");
			var offset = 56*_browserClient.ratio;
			var cloneElement;
			
			for(i=0; i < pageCount; i++){
			
				cloneElement = t.elements["bg_MainTopSelect"].clone[i];
				cloneElement.style.left = elemChildReferenceX + (offset)*(i+1) + "px";
				cloneElement.style.top = elemChildReferenceY + "px";
				cloneElement.style.opacity = elemChildReferenceOpacity;
				
				/*
				var pageCurr = arrayPages[i];
				cloneElement.onclick = function(){
					////debugger;
					t.displayPageSubContainer(arrayPages, this.className);
					console.log(this.className +" " + t.pageCurr);
				}
				*/
				
			}
		}
		t.elements["bg_MainTopSelect"].doc.ontweenEnd = function(){
			var pageCurr = arrayPages[i];
		
			//create div clone overall to handle mouseover/onclick event and zOrder problem
			var cloneElement;
			
			cloneElement = t.elements["bg_MainTopSelect"].div;
			cloneElement.style.position="absolute";
			cloneElement.style.display="block";
			cloneElement.style.zIndex = 300;
			cloneElement.style.left = t.elements["bg_MainTopSelect"].doc.style.left;
			cloneElement.style.top = t.elements["bg_MainTopSelect"].doc.style.top;
			cloneElement.style.width = t.elements["bg_MainTopSelect"].doc.style.width;
			cloneElement.style.height = t.elements["bg_MainTopSelect"].doc.style.height;
			cloneElement.onmouseover = function(){
				t.elements["bg_MainTopSelect"].doc.src = t.elements["bg_MainTopSelect"].blobUrl[1];
				t.displayPageSubContainer(arrayPages, this.className, true);
				//console.log(this.className +" " + t.pageCurr);
				if(t.elements["MainSubContainer"].pageID != this.classID)
					t.elements["bg_MainTopSelect"].doc.style.opacity = 0.5;
				t.displayPageSubContainer(arrayPages, this.className, true);
				
				t.displayPageTopContainerTitle('onmouseover');
			}
			cloneElement.onmouseout = function(){
				if(t.elements["MainSubContainer"].pageID != this.classID){
					t.elements["bg_MainTopSelect"].doc.src = t.elements["bg_MainTopSelect"].blobUrl[0];
					t.elements["bg_MainTopSelect"].doc.style.opacity = 1;
				}
				
				t.displayPageTopContainerTitle('onmouseout');
			}
			cloneElement.onclick = function(){				
				if(t.elements["MainSubContainer"].pageID == this.classID){
					t.elements["MainSubContainer"].pageGoToTop = true;
					t.elements["MainTopContainer"].doc.onclick();
					//t.elements["bg_MainTopSelect"].clone[this.classID].style.opacity = 1;
					t.elements["MainSubContainer"].pageGoToTop = false;
					return;
				}
			
				t.elements["bg_MainTopSelect"].doc.style.opacity = 1;
					
				//console.log("classID : " + this.classID);
				var coeffScroll = -1;
				if(t.elements["MainSubContainer"].pageID != null){
					
						if(t.elements["MainSubContainer"].pageID < this.classID)
							coeffScroll = 1;
				}
					
				var className = this.className;
				t.elements["MainSubContainer"].doc.ontweenEnd = function(){
					//tween is done in the dispatch now
					//t.elements["MainSubContainer"].tween.reset(true);
					//t.elements["MainSubContainer"].tween.play();
					t.displayPageSubContainer(arrayPages, className, false);
					t.elements["MainSubContainer"].doc.ontweenEnd = null;
				}
				
				t.elements["MainSubContainer"].tween.positionBefore = {x:0,y:25*coeffScroll};
				t.elements["MainSubContainer"].tween.positionAfter = {x:0,y:-25*coeffScroll};
				t.elements["MainSubContainer"].tween.duration = 400;
				t.elements["MainSubContainer"].tween.state = "end";
				t.elements["MainSubContainer"].tween.play();
				
				//t.displayPageTopContainerTitle('onclickSubMenu');
			}
			
			cloneElement = null;
			for(i=0; i < pageCount; i++){
				cloneElement = t.elements["bg_MainTopSelect"].cloneDiv[i];
				cloneElement.style.position="absolute";
				cloneElement.style.display="block";
				cloneElement.style.zIndex = 300;
				cloneElement.style.left = t.elements["bg_MainTopSelect"].clone[i].style.left;
				cloneElement.style.top = t.elements["bg_MainTopSelect"].clone[i].style.top;
				cloneElement.style.width = t.elements["bg_MainTopSelect"].clone[i].style.width;
				cloneElement.style.height = t.elements["bg_MainTopSelect"].clone[i].style.height;
				
				cloneElement.onmouseover = function(){
				
					t.elements["bg_MainTopSelect"].clone[this.classID].src = t.elements["bg_MainTopSelect"].blobUrl[1];
					if(t.elements["MainSubContainer"].pageID != this.classID)
						t.elements["bg_MainTopSelect"].clone[this.classID].style.opacity = 0.5;
					t.displayPageSubContainer(arrayPages, this.className, true);
					
					t.displayPageTopContainerTitle('onmouseover');
				}
				cloneElement.onmouseout = function(){
					
					
					if(t.elements["MainSubContainer"].pageID != this.classID){
						t.elements["bg_MainTopSelect"].clone[this.classID].src = t.elements["bg_MainTopSelect"].blobUrl[0];
						t.elements["bg_MainTopSelect"].clone[this.classID].style.opacity = 1;
					}
					
					t.displayPageTopContainerTitle('onmouseout');
				}
				cloneElement.onclick = function(){
				
					if(t.elements["MainSubContainer"].pageID == this.classID){
						t.elements["MainSubContainer"].pageGoToTop = true;
						t.elements["MainTopContainer"].doc.onclick();
						//t.elements["bg_MainTopSelect"].clone[this.classID].style.opacity = 1;
						t.elements["MainSubContainer"].pageGoToTop = false;
						return;
					}
				
					t.elements["bg_MainTopSelect"].clone[this.classID].style.opacity = 1;
					
					var coeffScroll = -1;
					if(t.elements["MainSubContainer"].pageID != null){
						
							if(t.elements["MainSubContainer"].pageID < this.classID)
								coeffScroll = 1;
					}
					
					var className = this.className;
					t.elements["MainSubContainer"].doc.ontweenEnd = function(){
						//tween is done in the dispatch now
						//t.elements["MainSubContainer"].tween.reset(true);
						//t.elements["MainSubContainer"].tween.play();
						t.displayPageSubContainer(arrayPages, className, false);
						t.elements["MainSubContainer"].doc.ontweenEnd = null;
					}
					
					t.elements["MainSubContainer"].tween.positionBefore = {x:0,y:25*coeffScroll};
					t.elements["MainSubContainer"].tween.positionAfter = {x:0,y:-25*coeffScroll};
					t.elements["MainSubContainer"].tween.duration = 400;
					t.elements["MainSubContainer"].tween.state = "end";
					t.elements["MainSubContainer"].tween.play();
					
					//t.displayPageTopContainerTitle('onclickSubMenu');
				}
				
			}
			
			t.elements["bg_MainTopSelect"].doc.ontween = null;
		}
		
		t.elements["bg_MainTopSelect"].tween.reset(true);
		t.elements["bg_MainTopSelect"].tween.alpha = 0; 
		t.elements["bg_MainTopSelect"].doc.style.opacity =  0; 
		for(i=0; i < pageCount; i++){
			cloneElement = t.elements["bg_MainTopSelect"].clone[i];
			cloneElement.style.opacity = 0; 			
		}
		t.elements["bg_MainTopSelect"].naturalLeft = (-56*0.5)*pageCount;
		t.elements["bg_MainTopSelect"].tween.position = {x:(-56*0.5)*pageCount,y:0};
		t.elements["bg_MainTopSelect"].tween.play();
		
	},	
	displayPageTopContainerTitle : function(eventName){
		var t = this;

		var pagePrev = t.elements["MainSubContainer"].pagePrev;
		var pageCurr = t.elements["MainSubContainer"].pageCurr;
		var pageSelect = t.elements["MainSubContainer"].select;
		var titlePageOut;
		var titlePageIn;
		

		// A. if onclickMenu or onclickSubMenu
		//1. PREV : 
		// if defined and opacity = 1, then play out
		//2. CURR:
		// then play in
		// B. if onmouseover
		//1. PREV or SELECT: 
		// if defined and opacity = 1, then play out
		//2. CURR:
		// then play in
		// C. if onmouseout
		//1. CURR: 
		// if defined and opacity = 1, then play out
		//2. PREV or SELECT:
		// then play in
		if(eventName == 'onclickMenu' || eventName == 'onclickSubMenu'  || eventName == 'onload'){
			titlePageOut = pagePrev;
			titlePageIn = pageCurr;
		}
		
		else if(eventName == 'onmouseover'){
			titlePageOut = pageSelect || pagePrev;// || pageSelect;
			titlePageIn = pageCurr;
		}
		else if(eventName == 'onmouseout'){
			titlePageOut = pageCurr;
			titlePageIn = pageSelect || pagePrev;
		}
		
		if( titlePageOut == titlePageIn )
			return;

			
		if(titlePageOut != null){
			t.elements["menuSub"+titlePageOut].tween.reset(true);
			t.elements["menuSub"+titlePageOut].tween.alpha = 0; 
			t.elements["menuSub"+titlePageOut].doc.style.opacity = 0; 
		}
		
		t.elements["menuSub"+titlePageIn].tween.reset(true);
		if(t.elements["menuSub"+titlePageIn].tween.position.x == 0){
			////debugger;
			t.elements["menuSub"+titlePageIn].naturalLeft = (-t.elements["menuSub"+titlePageIn].naturalWidth*0.5+56*0.5);
			t.elements["menuSub"+titlePageIn].tween.position.x = (-t.elements["menuSub"+titlePageIn].naturalWidth*0.5+56*0.5);
		}
		t.elements["menuSub"+titlePageIn].tween.play();
		
		/*
		if(pagePrev != null){
			t.elements["menuSub"+pagePrev].tween.reset(true);
			t.elements["menuSub"+pagePrev].tween.alpha = 0; 
			t.elements["menuSub"+pagePrev].doc.style.opacity = 0; 
		}
		
		
		if(t.elements["menuSub"+pageCurr].tween.position.x == 0){
			t.elements["menuSub"+pageCurr].tween.position.x = (-t.elements["menuSub"+pageCurr].naturalWidth*0.5+56*0.5);

		}
		
		t.elements["menuSub"+pageCurr].tween.reset(true);
		t.elements["menuSub"+pageCurr].tween.play();
		*/
	},
	getMainSubContainerrInfo: function() 
	{
		var t = this;
		
		console.log('*scrollOffsetTopY: '+t.elements["MainSubContainer"].scrollOffsetTopY);
		console.log('*scrollOffsetBottomY: '+t.elements["MainSubContainer"].scrollOffsetBottomY);
		console.log('scrollTop: '+t.elements["MainSubContainer"].doc.scrollTop);
		console.log('scrollHeight: '+t.elements["MainSubContainer"].doc.scrollHeight);
		console.log('offsetHeight: '+t.elements["MainSubContainer"].doc.offsetHeight);
		

	}
	
};

