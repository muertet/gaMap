var Editor={

	menu:[],
	initialized:false,
	debug:true,
	deleteModeStatus:false,
	init:function()
	{
		this.initialized=true;
		var html='';
		
		//check if we are editing a map or we are creating a new one
		if($('#'+Map.mapDiv).length<1){
			if(Map.initialized){
				alert('something went wrong, map class initialized, no map found');return false;
			}
			html='<div id="firstMenu"><h2>Map Editor</h2><br>¿What do you wanna do?<br><div>'+
					    '<div class="border option">Edit existing map<hr><textarea id="mapCode" rows="10">{"areas":{"area0":[{"name":"teleport_area","x":0,"y":96,"id":0,"to":1},{"name":"cave_land","x":288,"y":57},{"name":"cave_land","x":288,"y":28},{"name":"cave_land","x":288,"y":0},{"name":"cave_land","x":241,"y":0},{"name":"cave_land","x":288,"y":89},{"name":"playerSpawn","x":302,"y":17},{"name":"cave_land","x":242,"y":93},{"name":"cave_land","x":194,"y":62},{"name":"cave_land","x":241,"y":62},{"name":"cave_land","x":243,"y":32},{"name":"cave_land","x":195,"y":32},{"name":"cave_land","x":195,"y":0},{"name":"cave_land","x":194,"y":94},{"name":"cave_land","x":288,"y":120},{"name":"cave_land","x":241,"y":124},{"name":"cave_land","x":194,"y":125},{"name":"cave_land","x":288,"y":208},{"name":"cave_land","x":240,"y":208},{"name":"cave_land","x":192,"y":208},{"name":"cave_land","x":288,"y":180},{"name":"cave_land","x":288,"y":150},{"name":"cave_land","x":241,"y":153},{"name":"cave_land","x":240,"y":176},{"name":"cave_land","x":193,"y":157},{"name":"cave_land","x":193,"y":178},{"name":"cave_land","x":147,"y":180},{"name":"cave_land","x":148,"y":148},{"name":"cave_land","x":148,"y":118},{"name":"cave_land","x":147,"y":87},{"name":"cave_land","x":146,"y":57},{"name":"cave_land","x":147,"y":31},{"name":"cave_land","x":149,"y":0},{"name":"cave_land","x":102,"y":119},{"name":"cave_land","x":102,"y":149},{"name":"cave_land","x":99,"y":181},{"name":"cave_land","x":100,"y":208},{"name":"cave_land","x":145,"y":208},{"name":"grass_land","x":101,"y":0},{"name":"grass_land","x":88,"y":0},{"name":"grass_land","x":44,"y":0},{"name":"grass_land","x":0,"y":0},{"name":"grass_land","x":102,"y":22},{"name":"grass_land","x":92,"y":22},{"name":"grass_land","x":46,"y":22},{"name":"grass_land","x":0,"y":19},{"name":"grass_land","x":61,"y":44},{"name":"grass_land","x":0,"y":61},{"name":"grass_land","x":100,"y":45},{"name":"grass_land","x":0,"y":41},{"name":"grass_land","x":99,"y":94},{"name":"grass_land","x":61,"y":65},{"name":"grass_land","x":100,"y":70},{"name":"grass_land","x":37,"y":46},{"name":"grass_land","x":0,"y":86},{"name":"grass_land","x":44,"y":85},{"name":"grass_land","x":24,"y":68},{"name":"grass_land","x":72,"y":87},{"name":"building_modern2","x":6,"y":0},{"name":"cave_rock2","x":268,"y":86},{"name":"cave_rock2","x":217,"y":162},{"name":"cave_rock1","x":194,"y":52},{"name":"grass_border2","x":30,"y":101},{"name":"grass_border2","x":32,"y":143},{"name":"cave_rock1","x":230,"y":221},{"name":"cave_rock1","x":214,"y":212},{"name":"cave_rock1","x":215,"y":195},{"name":"cave_rock1","x":217,"y":178}],"area1":{},"area2":[{"name":"grass_land","x":55,"y":40},{"name":"grass_land","x":55,"y":40},{"name":"grass_land","x":179,"y":215},{"name":"grass_land","x":288,"y":215},{"name":"grass_bridge1","x":55,"y":40},{"name":"playerSpawn","x":251,"y":217},{"name":"teleport_area","x":305,"y":0,"id":1,"to":0}],"area3":{}}}</textarea><button onclick="Editor.loadMap();">Load map</button></div>'+
					    '<div class="border option" >Create new map<hr><br><br>How many areas will have?<input id="numAreas" type="text"><button onclick="Editor.createSchema();">Create map</button></div>'+
				'</div></div>';
			$('body').prepend(html);
			return false;
		}else{
			$('#firstMenu').remove();
		}
		
		//setup basic html
		html='<div id="mapEditor">'+
				'<button onclick="Editor.generateMap();">Generate map code</button><br><button style="float:right"onclick="Editor.deleteMode();">Delete mode: <span id="deleteModeStatus">OFF</span></button>'+
				'<div id="items" class="editorMode"></div>'+
			'</div>';
		$('body').append(html);
		
		// making select for area switch
		html='<select id="areaSelect"class="menu" onchange="Map.changeArea(this.value);">';
		if(typeof Map.areas =='undefined'){alert('Invalid map data. [No areas found]');return false;}
		
		for(k in Map.areas){
			var selected='';
			if(k==0){
				selected='selected="selected"';
			}
			html+='<option '+selected+' value="'+k+'">'+k+'</option>';
		}
		html+='</select>';
		$('#mapEditor').prepend(html);
		//---
		
		// making scenario select
		for(k in items){
			var itm=items[k];
			if(typeof this.menu[itm.scenario] =='undefined'){
				this.menu[itm.scenario]=[];
			}
			itm.name=k;
			this.menu[itm.scenario][this.menu[itm.scenario].length]=itm;
		}
		
		html='<select class="menu" onchange="Editor.loadScenario(this.value);"><option value="-1">Select scenario</option>';
		for(k in this.menu){
			html+='<option value="'+k+'">'+k+'</option>';
		}
		html+='</select>';
		$('#mapEditor').prepend(html);
		//--------
		
		$("#myPlayer img" ).draggable({ containment: "#currentMap", obstacle: "item", preventCollision: true });
		
		// detecting clicks on interactive items
		$('body')
			.on('click.Teleport', 'item[type=teleport]', function() 
			{
				var id=parseInt($(this).attr('teleportid')),
					to=parseInt($(this).attr('to'));
					html='<div id="teleportSelect" class="border">Select teleport destination for '+id+': <select onchange="Editor.modTeleport('+id+',this.value);" class="menu"><option value="-1">---</option>',
					area=$('#areaSelect :selected').text();
				
				//search all available teleports
				for(k in Map.areas)
				{
					for(o in Map.areas[k])
					{	
						var preObj=Map.areas[k][o],
							obj=Item.info(preObj.name);
						if(obj.type=='teleport')
						{
							var selected='';
							if(preObj.id!=id){
								if(preObj.id==to){
									selected='selected="selected"';
								}
								html+='<option '+selected+' value="'+preObj.id+'">'+preObj.id+' (in '+k+')</option>';
							}
						}
					}
				}
				html+='</select></div>';
				$('body').prepend(html);
			})
			.on('click.DeleteMode', '.deleteMode item', function() {
				$(this).remove();
			})
			;
		$('#'+Map.mapDiv).bind('DOMNodeInserted DOMNodeRemoved DOMSubtreeModified', function(event) {
			Editor.saveMap();
		});
		$('#'+Map.mapDiv).addClass('editorMode');
	},
	loadScenario:function(scenario)
	{
		if(scenario==-1){return false;}
		var html='';
		
		for(k in this.menu[scenario]){
			var itm=this.menu[scenario][k],
				sprite='';
				
			if(typeof itm.sprite !='undefined'){
				sprite=itm.sprite;
			}
			html+='<div class="'+sprite+' pointer '+itm.name+'" onclick="Map.addItem({name:\''+itm.name+'\',x:55,y:40});"type="'+itm.type+'"></div>';
		}
		$('#items').html(html);
		$("#currentMap item" ).draggable({ containment: "#currentMap", obstacle: "item", preventCollision: true });
	},
	generateArea:function()
	{
		var mapCode=[];
		$("#currentMap item").each(function(){
			var name=$(this).attr('name'),
				x=parseFloat($(this).css('left').replace(/[^-\d\.]/g, '')),
				y=parseFloat($(this).css('top').replace(/[^-\d\.]/g, '')),
				id=parseInt($(this).attr('teleportid'));
				to=parseInt($(this).attr('to'));
				
			if(typeof name =='undefined'){ //if doesnt have name, it should be players div
				name='playerPos';
				return false;
			}
			mapCode[mapCode.length]={
				name:name,
				x:x,
				y:y,
			};
			if(id!=null){
				mapCode[mapCode.length].id=id;
			}
			if(to!=null){
				mapCode[mapCode.length].to=to;
			}
			
		});
		return mapCode;
	},
	generateMap:function()
	{
		if($('#mapEditor textarea').length<1){
			$('#mapEditor').append('<textarea>{"areas":'+JSON.stringify(Map.areas)+'}</textarea>');
		}else{
			$('#mapEditor textarea').text('{"areas":'+JSON.stringify(Map.areas)+'}');
		}
	},
	createSchema:function()
	{
		//validating input
		if($('#numAreas').length<1 || $('#numAreas').val()==''){return false;}
		var num=parseInt($('#numAreas').val().replace(/[^-\d\.]/g, '')),
			i=0,
			schema={"areas":{}};
		if(num<1){return false;}
		//-- 
		
		while(i<num){
			schema.areas['area'+i]={};
			i++;
		}
		Map.init(schema);
		Editor.init();
	},
	saveMap:function()
	{
		if(Map.loadingArea){return false;}
		var area=$('#areaSelect :selected').text(),
			code=Editor.generateArea();
		if(typeof code =='undefined' || code == '' || code =='[]'){
			return false;//he didnt even start
		}
		
		//--saving div
		if($('#editorSaving').length>0){
			$('#editorSaving').show();
		}else{
			$('body').append('<div id="editorSaving" class="border"><img src="images/loading.gif"/> Saving area...</div>');
		}
		
		if(Map.loadingArea){return false;}
		Map.areas[area]=code;
		setTimeout("$('#editorSaving').hide();",1000);
	},
	loadMap:function()
	{
		if($('#mapCode').length<1 || $('#mapCode').val()==''){return false;}
		Map.init(jQuery.parseJSON($('#mapCode').val()));
		Editor.init();
	},
	deleteMode:function()
	{
		var mode='';
		if(this.deleteModeStatus)
		{
			$('#'+Map.mapDiv).removeClass('deleteMode');
			this.deleteModeStatus=false;
			mode='OFF';
		}else{
			$('#'+Map.mapDiv).addClass('deleteMode');
			this.deleteModeStatus=true;
			mode='ON';
		}
		$('#deleteModeStatus').html(mode);
	},
	modTeleport:function(teleportId,to)
	{
		if(teleportId==-1){return false;}
		$('[teleportid='+teleportId+']').attr('to',to);
		$('#teleportSelect').remove();
	}
};