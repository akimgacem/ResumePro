var MenuCarousselCV = (function(){

	function MenuCarousselCV(){
		this.labelName = {"current":null , "previous":null , "next":null};
	}

	MenuCarousselCV.prototype.constructor = MenuCarousselCV;
	
	MenuCarousselCV.prototype.MenuSwipe = function (val){
		var i,j,subBlock,subBlockName,srcImg;

		//hide old focus bloc
		i = modulo(this.swipeFocus,this.subBlockNumber);
		subBlock = this.subBlock[i];
		subBlock.getElementsByClassName("subBlockContent")[0].style.visibility="hidden"; 
		subBlock.getElementsByClassName("subBlockContentLink")[0].style.visibility="hidden"; 

		
		for(i=0;i<this.subBlockNumber;i++){
			valCurr = this.subBlock[i].style.left;
			valCurr = valCurr.substring(0, valCurr.length-1);
			valCurr = val + parseFloat(valCurr);
			
			//move left right 27.5%
			//<-25% -> 100% ou <100%-> -25%
			flag = false;
			if(valCurr<-25){
				valCurr = (-17.5+4*27.5);
				this.swipeFocus++;
				flag = 5;
			}else if(valCurr>100){
				valCurr = (-17.5+0*27.5);	
				this.swipeFocus--;
				flag = -5;
			}
				

			this.subBlock[i].style.left = valCurr + "%";
			this.subBlock[i].style.transform = "scale(1.0, 1.0)";
			this.subBlock[i].style.border = "0px solid";
			
			//content
			if(flag != false){
			
				j = this.content.indexOf(this.subBlock[i].id);
				j = modulo((j+flag),this.content.length);
				subBlockName = this.content[j];
				srcImg = "Resume_"+subBlockName.replace(/\s/g, '')+".png";
				this.subBlock[i].id =  this.content[j];
				this.subBlock[i].getElementsByClassName("subBlockImg")[0].src = './assets/img/templatePreview/'+srcImg;
				this.subBlock[i].getElementsByClassName("subBlockName")[0].innerHTML = subBlockName;
			}
		}
		
		this.updateFocus();
		
	}
	
	MenuCarousselCV.prototype.updateFocus = function (){

		var subBlock = this.subBlock[modulo(this.swipeFocus,this.subBlockNumber)]; 
		var style = subBlock.style;
	
		style.transform = "scale(1.1, 1.1)";
		style.border = "1px solid";
		style.borderColor = "green";

		
		subBlock.getElementsByClassName("subBlockContent")[0].style.visibility="visible"; 
		subBlock.getElementsByClassName("subBlockContentLink")[0].style.visibility="visible"; 
		subBlock.getElementsByClassName("subBlockContentLink")[0].getElementsByClassName("Link")[0].href = 'javascript:DataManager.loadPage("./formCV.html?p='+subBlock.id+'");';
		
	}

	return MenuCarousselCV;
}());

