var Map=
{
	mapDiv:"currentMap",
	mapSize:{x:336,y:240},
	mapPos:{},
	playerPos:{},
	itemPos:{},
	debug:true,
	init:function(map)
	{
		if($('#'+this.mapDiv).length<1){
			$('body').prepend('<div id="'+this.mapDiv+'" class="map"></div>');
		}else{ //we collect current map info
			this.mapSize.x=parseFloat($('#'+this.mapDiv).css('width').replace(/[^-\d\.]/g, ''));
			this.mapSize.y=parseFloat($('#'+this.mapDiv).css('height').replace(/[^-\d\.]/g, ''));
		}
		$('#'+this.mapDiv).css('background-image','url(\'maps/'+map+'.png\')');

		document.onkeydown = this.movePlayer;
		/*$(document).keypress(function(event) //didnt catch game keys 
		{
			Map.movePlayer(event.which);
		});*/
	},
	moveMap:function(x,y)
	{
		if(this.debug){console.log("Moving map ("+x+","+y+")");}
		/* Must we change player pos? */
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
				var collisions=$("#myPlayer img").collision('.mapSprite');
				if(collisions.length>0)// collision detected, checking item type
				{
					var itm=$(collisions[0]).attr('type');
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
		
		$('#myPlayer img').attr('src','avatars/0'+avatar+'.png');
	},
	addItem:function(obj)
	{
		if(typeof this.itemPos[obj.x] =='undefined'){
			this.itemPos[obj.x]={};
		}
		this.itemPos[obj.x][obj.y]=obj.name;
		$('#currentMap').append('<div class="mapSprite '+obj.name+'" type="'+obj.name+'" style="position:absolute;left:'+obj.x+'px;top:'+obj.y+'px;"></div>');
	}

}