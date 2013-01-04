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
	multiplayer:false,
	editing:false,
	numTeleports:0,
	uid:0,
	init:function(data)
	{
		var itemsArea=[];
		this.initialized=true;
		
		//are we in edition mode?
		if(typeof Editor !='undefined'){
			if(Editor.initialized){this.editing=true;}
		}
		
		// data check
			if(typeof data.areas =='undefined'){
				alert('Missing map areas. [Areas not found]');Map.abort();return false;
			}
		//--
		
		//saved game?
		if(typeof data['playerPos'] !='undefined'){
			if(typeof data.areas['area'+data.playerPos.area] !='undefined'){
				itemsArea=data.areas['area'+data.playerPos.area];
				Map.movePlayer(data.playerPos.uid,data.playerPos.x,data.playerPos.y);
			}else{
				alert('Missing map areas or invalid save game. [player area not found]');
				Map.abort();
				return false;
			}
		}else{
			if(typeof data.areas['area0'] !='undefined'){
				itemsArea=data.areas['area0'];
			}else{
				alert('Missing map areas. [Area0 not found]');
				Map.abort();
				return false;
			}
		}
		
		if($('#'+this.mapDiv).length<1){
			$('body').prepend('<div id="'+this.mapDiv+'" class="map"></div>');
		}else{ //we collect current map info
			this.mapSize.x=parseFloat($('#'+this.mapDiv).css('width').replace(/[^-\d\.]/g, ''));
			this.mapSize.y=parseFloat($('#'+this.mapDiv).css('height').replace(/[^-\d\.]/g, ''));
		}
		
		if(!this.multiplayer){
			this.uid=0;
			this.defaultPlayer(0);
		}else{
			//nodeJS
		}
		
		Map.areas=data.areas;
		Map.addItems(itemsArea);
						
		$(document).keydown(function(e){
			Map.movePlayer(Map.uid,e.keyCode);
		});

		
		//search the teleport again (0% optimization, sucks)
		for(k in Map.areas)
		{
			for(o in Map.areas[k])
			{	
				var preObj=Map.areas[k][o],
					obj=Item.info(preObj.name);
				if(obj.type=='teleport')
				{
					this.numTeleports++;
				}
			}
		}
		
	},
	changeArea:function(teleportId)
	{
		if(typeof teleportId =='undefined'){return false;}
		
		this.loadingArea=true;
		var found=false;
		
		//search the teleport again (0% optimization, sucks)
		for(k in Map.areas)
		{
			for(o in Map.areas[k])
			{	
				var preObj=Map.areas[k][o],
					obj=Item.info(preObj.name);
				if(obj.type=='teleport' && preObj.id==parseInt(teleportId))
				{
					var area=k;
					found=true;
					break;
				}
			}
			if(found){break;}
		}
		if(this.debug){console.log("Using teleport "+teleportId+" to "+area);}
		
		$('#'+this.mapDiv+' item').remove(); //unload items
		this.killPlayer(this.uid); //to respawn it in addItems
		
		this.addItems(this.areas[area]);
		this.movePlayer(this.uid,preObj.x,preObj.y);
		this.loadingArea=false;
		
		if($('#player'+this.uid).length<1 && !this.editing){
			alert("ERROR: This area ["+area+"] doesn't have any spawn point");Map.abort();return false;
		}
		
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
	movePlayer:function(uid,key,y)
	{
		//setup player
		if($('#player'+uid).length<1){
			Map.addPlayer(uid);
		}
		
		var avatar='front';
		if(typeof y =='undefined')
		{
			
	   		var pixels=0,
				property='',
				negative=false;
			switch(key){
				case 83: //avall
				case 40:
					property='top';
					avatar='front';
				break;
				case 87: //adalt
				case 38:
					property='top';
					negative=true;
					avatar='back';
				break;
				case 68: //dreta
				case 39:
					property='left';
					avatar='right';
				break;
				case 65://esquerra
				case 37:
					property='left';
					negative=true;
					avatar='left';
				break;
				default:
					Map.hotKeys(key);
					return false;
				break;
			}
			
			pixels=$('#player'+uid).css(property).replace(/[^-\d\.]/g, '');
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
				i=Map.playerPos[uid].x;
			}else{
				i=Map.playerPos[uid].y;
			}
			lastI=i;
			while(true)
			{
				$('#player'+uid).css(property,i+'px');
				var collisions=$('#player'+uid).collision('item[type!=walk]');
				if(collisions.length>0)// collision detected, checking item type
				{
					var itm=collisions[0],
						name=$(itm).attr('name');
					//console.log(items[itm]);
					
					if(items[name].type=='solid'){
						//console.log(pixels,lastI,property,Map.playerPos.x,Map.playerPos.y);
						$('#player'+uid).css(property,lastI+'px');
						if(property=='left'){
							Map.playerPos[uid].x=lastI;
						}else{
							Map.playerPos[uid].y=lastI;
						}
						console.log('cant');return false;
					}else if(items[name].type=='teleport'){
						var to=$(itm).attr('to');
						Map.changeArea(to);
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
			
			/* Update playerPos*/
			if(property=='left'){
				Map.playerPos[uid].x=pixels;
			}else{
				Map.playerPos[uid].y=pixels;
			}

		}else{
			if(this.debug){console.log('moving player pos ('+uid+','+key+','+y+')')};
			$('#player'+uid).css('top',y);
			$('#player'+uid).css('left',key);
			
			/* Update playerPos*/
			this.playerPos[uid].y=y;
			this.playerPos[uid].x=key;
		}
		
		$('#player'+uid).removeClass(this.playerPos[uid].skin+'-front');
		$('#player'+uid).removeClass(this.playerPos[uid].skin+'-left');
		$('#player'+uid).removeClass(this.playerPos[uid].skin+'-right');
		$('#player'+uid).removeClass(this.playerPos[uid].skin+'-back');
		$('#player'+uid).addClass(this.playerPos[uid].skin+'-'+avatar);
	},
	addItem:function(obj)
	{
		if(typeof this.itemPos[obj.x] =='undefined'){
			this.itemPos[obj.x]={};
		}
		this.itemPos[obj.x][obj.y]=obj.name;
		var sprite='',
			teleport='',
			prepend=false,
			text='';
		
		//check if object is set
		if(typeof items[obj.name] =='undefined'){
			alert('no data found for object: '+obj.name);
			Map.abort();
			return false;
		}
		if(typeof items[obj.name].sprite !='undefined'){
			sprite=items[obj.name].sprite;
		}
		
		//Spawn point? teleport point?
		if(items[obj.name].type=='spawn' && $('#myPlayer').length<1 && !this.editing){
			this.movePlayer(this.uid,obj.x,obj.y);
		}
		else if(items[obj.name].type=='teleport')
		{	
			if(typeof obj.id =='undefined'){
				this.numTeleports++;
				obj.id=this.numTeleports;
			}
			teleport='teleportid="'+obj.id+'" ';
			if(typeof obj.to =='undefined'){
				if(!this.editing){
					alert('Teleport with no destination/id found, mapping stopped.');
					Map.abort();
					return false;
				}
			}else{
				teleport+='to="'+obj.to+'"';
			}
			if(this.editing){//show teleport id in map
				text=obj.id;
			}
			
		}else if(items[obj.name].type=='walk'){
			prepend=true;
		}
		//--
		
		var itemLine='<item class="'+sprite+' '+obj.name+'" '+teleport+' name="'+obj.name+'" type="'+items[obj.name].type+'" style="position:absolute;left:'+obj.x+'px;top:'+obj.y+'px;">'+text+'</item>';
		
		if(prepend){
			$('#currentMap').prepend(itemLine);
		}else{
			$('#currentMap').append(itemLine);
		}
		
		if(this.editing){
			$("#currentMap item" ).draggable({ containment: "#currentMap", obstacle: "item", preventCollision: true });
		}
	},
	addItems:function(arr){
		for(k in arr){
			this.addItem(arr[k]);
		}
	},
	defaultPlayer:function(uid){
		if(typeof this.playerPos[uid] =='undefined'){
			this.playerPos[uid]={
				x:0,
				y:0,
				uid:uid,
				skin:'lab_guy1',
			};
		}else if(typeof this.playerPos[this.uid].skin =='undefined'){
			this.playerPos[this.uid].skin='lab_guy1';
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
	killPlayer:function(uid){
		$('#player'+uid).remove();	
	},
	addPlayer:function(uid)
	{
		if($('#player'+uid).length<1){
			this.defaultPlayer(uid);//check if has basic player schema
			var html='<div id="player'+uid+'" class="mapSprite '+this.playerPos[uid].skin+' player"></div>';
			$('#'+Map.mapDiv).prepend(html);
		}else{
			return false;
		}
	},
	abort:function(){
		if(!this.editing){
			$('#'+this.mapDiv).remove();
		}
	},

}
function isInteger(s) {
  return (s.toString().search(/^-?[0-9]+$/) == 0);
}