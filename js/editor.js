var Editor={

	menu:[],
	initialized:false,
	debug:true,
	init:function()
	{
		this.initialized=true;
		var html='';
		
		//check if we are editing a map or we are creating a new one
		if($('#'+Map.mapDiv).length<1){
			if(Map.initialized){
				alert('something went wrong, map class initialized, no map founded');return false;
			}
			html='<div id="firstMenu"><h2>Map Editor</h2><br>¿What do you wanna do?<br><div>'+
					    '<div class="border option">Edit existing map<textarea id="mapCode" rows="10"></textarea><button onclick="Editor.loadMap();">Load map</button></div>'+
					    '<div class="border option" >Create new map<br><br>How many areas will have?<input id="numAreas" type="text"><button onclick="Editor.createSchema();">Create map</button></div>'+
				'</div></div>';
			$('body').prepend(html);
			return false;
		}else{
			$('#firstMenu').remove();
		}
		
		//setup basic html
		html='<div id="mapEditor">'+
				'<button onclick="Editor.generateMap();">Generate map code</button>'+
				'<div id="items"></div>'+
			'</div>';
		$('body').append(html);
		
		// making area switch
		html='<select id="areaSelect"class="menu">';
		if(typeof Map.areas =='undefined'){alert('Invalid map data. [No areas found]');return false;}
		
		for(k in Map.areas){
			var selected='';
			if(k==0){
				selected='selected="selected"';
			}
			html+='<option '+selected+' onclick="Map.changeArea(\''+k+'\');">'+k+'</option>';
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
		
		html='<select class="menu"><option>Select scenario</option>';
		for(k in this.menu){
			html+='<option onclick="Editor.loadScenario(\''+k+'\');">'+k+'</option>';
		}
		html+='</select>';
		$('#mapEditor').prepend(html);
		//--------
		
		$("#myPlayer img" ).draggable({ containment: "#currentMap", obstacle: "item", preventCollision: true });
		
		// detecting clicks on interactive items
		$('body')
			.on('click.Teleport', 'item[type=teleport]', function() {
				if(typeof $(this).attr('to')=='undefined'){
					alert('to do popup teleport area select');
				}else{
					alert('to do popup teleport area change select');
				}
			});
		setInterval("Editor.saveMap()",3000);
	},
	loadScenario:function(scenario)
	{
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
				y=parseFloat($(this).css('top').replace(/[^-\d\.]/g, ''));
				
			if(typeof name =='undefined'){ //if doesnt have name, it should be players div
				name='playerPos';
				return false;
			}
			mapCode[mapCode.length]={
				name:name,
				x:x,
				y:y,	
			};
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
	saveMap:function() //BUG: saving area while switching area
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
			setTimeout("$('#editorSaving').hide();",1000);
		}else{
			$('body').append('<div id="editorSaving" class="border"><img src="images/loading.gif"/> Saving area...</div>');
		}
		
		if(Map.loadingArea){return false;}
		Map.areas[area]=code;
	},
	loadMap:function()
	{
		if($('#mapCode').length<1 || $('#mapCode').val()==''){return false;}
		Map.init(jQuery.parseJSON($('#mapCode').val()));
		Editor.init();
	},
};