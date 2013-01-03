var Map=
{
	mapDiv:"currentMap",
	mapSize:{x:336,y:240},
	areas:{},
	mapPos:{},
	playerPos:{},
	itemPos:{},
	debug:true,
	loadingArea:false,
	initialized:false,
	init:function(data)
	{
		var itemsArea=[];
		this.initialized=true;
		
		// data check
			if(typeof data.areas =='undefined'){
				alert('Missing map areas. [Areas not found]');return false;
			}
		//--
		
		//saved game?
		if(typeof data['playerPos'] !='undefined'){
			if(typeof data.areas['area'+data.playerPos.area] !='undefined'){
				itemsArea=data.areas['area'+data.playerPos.area];
				Map.movePlayer(data.playerPos.x,data.playerPos.y);
			}else{
				alert('Missing map areas or invalid save game. [player area not found]');
				return false;
			}
		}else{
			if(typeof data.areas['area0'] !='undefined'){
				itemsArea=data.areas['area0'];
			}else{
				alert('Missing map areas. [Area0 not found]');
				return false;
			}
		}
		
		if($('#'+this.mapDiv).length<1){
			$('body').prepend('<div id="'+this.mapDiv+'" class="map"></div>');
		}else{ //we collect current map info
			this.mapSize.x=parseFloat($('#'+this.mapDiv).css('width').replace(/[^-\d\.]/g, ''));
			this.mapSize.y=parseFloat($('#'+this.mapDiv).css('height').replace(/[^-\d\.]/g, ''));
		}
		
		Map.areas=data.areas;
		Map.addItems(itemsArea);

		document.onkeydown = this.movePlayer;
		/*$(document).keypress(function(event) //didnt catch game keys 
		{
			Map.movePlayer(event.which);
		});*/
	},
	changeArea:function(area)
	{
		this.loadingArea=true;
		if(this.debug){console.log("Moving to "+area);}
		
		$('#'+this.mapDiv+' item').remove(); //unload items
		
		this.addItems(this.areas[area]);
		this.loadingArea=false;
		
		
		/* Should we change player pos?
		if(this.mapPos.x==x){
			var playerY=0;
			if(this.mapPos.y<y){
				playerY=this.mapSize.y-20;
			}
			this.movePlayer(this.playerPos.x,playerY);
		}else if(this.mapPos.y==y){
			var playerX=0;
			if(this.mapPos.x<x){
				playerX=this.mapSize.x;
			}
			this.movePlayer(playerX,this.playerPos.y);
		} 
		this.mapPos.x=x;
		this.mapPos.y=y;
		$('#'+this.mapDiv).css('background-position',x+'px '+y+'px');
		*/
		
	},
	movePlayer:function(key,y)
	{
		var avatar='Down';
		if(typeof y =='undefined')
		{
			
	   		var tecla = (window.event) ? event.keyCode : key.keyCode,
				pixels=0,
				property='',
				negative=false;
			switch(tecla){
				case 83: //avall
				case 40:
					property='top';
					avatar='Down';
				break;
				case 87: //adalt
				case 38:
					property='top';
					negative=true;
					avatar='Up';
				break;
				case 68: //dreta
				case 39:
					property='left';
					avatar='Right';
				break;
				case 65://esquerra
				case 37:
					property='left';
					negative=true;
					avatar='Left';
				break;
				default:
					Map.hotKeys(tecla);
					return false;
				break;
			}
			
			pixels=$('#myPlayer img').css(property).replace(/[^-\d\.]/g, '');
			if(pixels=="auto" || pixels==""){
				pixels=0;
			}else{
				if(negative){
					pixels=parseFloat(pixels)-10;
				}else{
					pixels=parseFloat(pixels)+10;
				}
			}
			
			// check if i can do following step
			var i=0,lastI=0;
			if(property=='left'){
				i=Map.playerPos.x;
			}else{
				i=Map.playerPos.y;
			}
			lastI=i;
			while(true)
			{
				$('#myPlayer img').css(property,i+'px');
				var collisions=$("#myPlayer img").collision('item[type!=walk]');
				if(collisions.length>0)// collision detected, checking item type
				{
					var itm=$(collisions[0]).attr('name');
					//console.log(items[itm]);
					
					if(items[itm].type=='solid'){
						//console.log(pixels,lastI,property,Map.playerPos.x,Map.playerPos.y);
						$('#myPlayer img').css(property,lastI+'px');
						if(property=='left'){
							Map.playerPos.x=lastI;
						}else{
							Map.playerPos.y=lastI;
						}
						console.log('cant');return false;
					}
					
				}
				if(i==pixels){
					break;
				}
				lastI=i;
				if(i>pixels){
					i--;
				}else{
					i++;
				}
			}
			//$('#myPlayer img').css(property,pixels+'px');
			
			/* Update playerPos*/
			if(property=='left'){
				Map.playerPos.x=pixels;
			}else{
				Map.playerPos.y=pixels;
			}
			
			//detect map change
			if(property=='top' && (pixels>=230 || pixels<=6))
			{
				var y=Map.mapPos.y;
				if(pixels<=6){
					y+=Map.mapSize.y;
				}else{
					y-=Map.mapSize.y;
				}
				Map.moveMap(Map.mapPos.x,y);
			}else if(property=='left' && (pixels>=330 || pixels<=6)){
				
				var x=Map.mapPos.x;
				if(pixels<=6){
					x+=Map.mapSize.x;
				}else{
					x-=Map.mapSize.x;
				}
				
				Map.moveMap(x,Map.mapPos.y);
			}
		}else{
			$('#myPlayer img').css('top',y);
			$('#myPlayer img').css('left',key);
			
			/* Update playerPos*/
			this.playerPos.y=y;
			this.playerPos.x=key;
		}
		
		$('#myPlayer img').attr('src','images/avatars/0'+avatar+'.png');
	},
	addItem:function(obj)
	{
		if(typeof this.itemPos[obj.x] =='undefined'){
			this.itemPos[obj.x]={};
		}
		this.itemPos[obj.x][obj.y]=obj.name;
		var sprite='';
		
		//check if object is set
		if(typeof items[obj.name] =='undefined'){
			alert('no data found for object: '+obj.name);
			return false;
		}
		if(typeof items[obj.name].sprite !='undefined'){
			sprite=items[obj.name].sprite;
		}
		
		$('#currentMap').append('<item class="'+sprite+' '+obj.name+'" name="'+obj.name+'" type="'+items[obj.name].type+'" style="position:absolute;left:'+obj.x+'px;top:'+obj.y+'px;"></item>');

		if(typeof Editor !='undefined'){
			if(Editor.initialized){
				$("#currentMap item" ).draggable({ containment: "#currentMap", obstacle: "item", preventCollision: true });
			}
		}
	},
	addItems:function(arr){
		for(k in arr){
			this.addItem(arr[k]);
		}
	},
	hotKeys:function(key){
		switch(key){
			case 88: // X/M bag
			case 77:
				if($('#gameMenu').length>0){
					$('#gameMenu').toggleClass('oculto');
				}else{
					var html='<div id="gameMenu" style="margin-left:'+Map.mapSize.x+'px;float:left;border:1px solid;height:'+Map.mapSize.y+'px;width:120px;"><ul>'+
						'<li>Op1</li>'+
						'<li>Op2</li>'+
						'<li>Op3</li>'+
						'<li>Op4</li>'+
					'</ul></div>';
					$('body').append(html);
				}
			break;
			case 27: //ESC
			break;
		}
	},

}