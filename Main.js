var Event = { "RESIZE":"onresize", "ENTER_FRAME":""};
var MouseEvent = { "MOUSE_DOWN":"mousedown", "MOUSE_UP":"mouseup", "MOUSE_MOVE":"mousemove", "MOUSE_WHEEL":"onwheel", "CLICK":"onclick"};
var TouchEvent = { "TOUCH_START":"touchstart", "TOUCH_END":"touchend", "TOUCH_MOVE":"touchmove", "TOUCH_CANCEL":"touchcancel", "TOUCH_ENTER":"touchenter", "TOUCH_LEAVE":"touchleave"};
var KeyboardEvent = { "KEY_DOWN" : "keydown", "KEY_UP" : "keyup"};
var GamepadEvent = { "CONNECTED" : "gamepadconnected", "DISCONNECTED" : "gamepaddisconnected", "MAP":null};

var Main = (function(){

	//this.MenuCarousselCV = null;
	
	function Main() 
	{
		//Init Module :
		//-Ajax Loading
		DataManager = new DataManager();
		//-Carroussel
		MenuCarousselCV = new MenuCarousselCV();
	}
	
	Main.prototype.init = function() 
	{
		
		this.content = document.getElementsByClassName('content')[0];
		
		MenuCarousselCV.div = document.getElementsByClassName('ScriptCVtemplate')[0];
		MenuCarousselCV.div.innerHTML = "";
		
		var i;
		var CSSText,srcImg,subBlockName;
		MenuCarousselCV.subBlock = [];
		MenuCarousselCV.subBlockNumber = 5;
		MenuCarousselCV.swipeFocus = 2;
		MenuCarousselCV.content = ["Angelic","Aruba","Ballinger","Belair","Belmont","Bentley","Bishop","Cailou","Casablanca","Delphini","Deluxe","Diplomat","Draco","Executive","Florence","Goodwood","Grace","Graceland","Helena","Hotshot","Layla","Nantucket","Oxford","Top Brass","Windsor"];
		for(i=0;i<MenuCarousselCV.subBlockNumber;i++){
			subBlockName = MenuCarousselCV.content[i];
			CSSText = "position: absolute;left:"+(-17.5+i*27.5)+"%;height:70%;width:25%;background-color: #fff;transform: scale(1.0, 1.0);transform-origin: center center;transition: opacity 1.6s ease-out 0s, transform 0.5s linear 0s;";
			MenuCarousselCV.subBlock[i] = document.createElement("div");
			MenuCarousselCV.subBlock[i].id = subBlockName;//"subBlock"+MenuCarousselCV.content[i];
			MenuCarousselCV.subBlock[i].setAttribute("style", CSSText);
			MenuCarousselCV.div.appendChild(MenuCarousselCV.subBlock[i]);
			
			//content
			srcImg = "Resume_"+subBlockName.replace(/\s/g, '')+".png";
			MenuCarousselCV.subBlock[i].innerHTML = '<img class="subBlockImg" src="./assets/img/templatePreview/'+srcImg+'" height=100% width=100%>';
			MenuCarousselCV.subBlock[i].innerHTML += '<div class="subBlockName" style="position: absolute;left:0%;top:-5%;width:100%;">'+subBlockName+'</div>';
			MenuCarousselCV.subBlock[i].innerHTML += '<div class="subBlockContentLink" style="visibility: hidden;position: absolute;left:0%;top:80%;height:100%;width:100%;"><a class="link" href="javascript:DataManager.loadPage('+MenuCarousselCV.subBlock[i].id+'");">Select Template</a></div>';
			MenuCarousselCV.subBlock[i].innerHTML += '<div class="subBlockContent" style="visibility: hidden;position: absolute;left:0px;top:0px;width:100%;border: 1px solid;border-color:red;text-align: right;align-items: right;">[EYE]</div>';

		}
		//button
		//Left
		CSSText = "position: absolute;left:0%;height:32px;width:32px;background-color: #f00;";
		MenuCarousselCV.buttonLeft = document.createElement("div");
		MenuCarousselCV.buttonLeft.id = "buttonLeft";
		MenuCarousselCV.buttonLeft.setAttribute("style", CSSText);
		MenuCarousselCV.buttonLeft.onclick = function(){MenuCarousselCV.MenuSwipe(27.5);};
		MenuCarousselCV.div.appendChild(MenuCarousselCV.buttonLeft);
		
		//Right
		CSSText = "position: absolute;right:0%;height:32px;width:32px;background-color: #f00;";
		MenuCarousselCV.buttonRight = document.createElement("div");
		MenuCarousselCV.buttonRight.id = "buttonLeft";
		MenuCarousselCV.buttonRight.setAttribute("style", CSSText);
		MenuCarousselCV.buttonRight.onclick = function(){MenuCarousselCV.MenuSwipe(-27.5);};
		MenuCarousselCV.div.appendChild(MenuCarousselCV.buttonRight);
		
		//drag
		MenuCarousselCV.updateFocus();
		
	}
	

	Main.prototype.display = function(responseXML, responseURL)   
	{
		debugger;
		var url = responseURL;
		var innerHTML = responseXML.getElementsByTagName("body")[0].innerHTML;
		var innerJS = responseXML.getElementsByTagName("script")[0].innerHTML;
		
		SEO.setURL("",url);
		this.content.innerHTML = innerHTML;
		if(innerJS != null) eval(innerJS);
		
		
	}
	
	Main.prototype.onResize = function(params)   
	{
	}

	Main.prototype.mouseVisible = function(enabled) 
	{
		if ( enabled == true)
			;//Mouse.show();
		else 
			;//Mouse.hide();
	}
	


	Main.prototype.onEnterFrame = function(params)   
	{

	}
	
	Main.prototype.onMouseDown = function(e,cb) 
	{
		if (cb != null)
			cb(e);
	}
	
	Main.prototype.onMouseUp = function(e,cb) 
	{ 
		if (cb != null)
			cb(e);
	}
	
	Main.prototype.onMouseMove = function(e,cb)   
	{        
		if (cb != null)
			cb(e);
	}

	Main.prototype.onMouseClick = function(e,cb)  
	{
		if (cb != null)
			cb(e);
	}
	
	Main.prototype.onMouseWheel = function(e,cb)   
	{		
		if (cb != null)
			cb(e);         
	}
	
	Main.prototype.onKeyDownHandler = function(e,cb) 
	{
		if (cb != null)
			cb(e);
	}
	
	Main.prototype.onKeyUpHandler = function(e,cb) 
	{
		if (cb != null)
			cb(e);
	}


	Main.prototype.onError = function(e,cb)   
	{
		if (cb != null)
			cb(e);
	}

	return Main;
}());
Main = new Main();
