var Editor={

	menu:[],
	mapCode:[],
	initalized:false,
	init:function()
	{
		this.initalized=true;
		for(k in items){
			var itm=items[k];
			if(typeof this.menu[itm.scenario] =='undefined'){
				this.menu[itm.scenario]=[];
			}
			itm.name=k;
			this.menu[itm.scenario][this.menu[itm.scenario].length]=itm;
		}
		
		var html='<select class="menu"><option>Select scenario</option>';
		for(k in this.menu){
			html+='<option onclick="Editor.loadScenario(\''+k+'\');">'+k+'</option>';
		}
		html+='</select>';
		$('#mapEditor').prepend(html);
		
		$("#myPlayer img" ).draggable({ containment: "#currentMap", obstacle: ".mapSprite", preventCollision: true });
	},
	loadScenario:function(scenario)
	{
		var html='';
		for(k in this.menu[scenario]){
			var itm=this.menu[scenario][k];
			html+='<div class="mapSprite pointer '+itm.name+'" onclick="Map.addItem({name:\''+itm.name+'\',x:55,y:40});"type="'+itm.type+'"></div>';
		}
		$('#items').html(html);
		$("#currentMap .mapSprite" ).draggable({ containment: "#currentMap", obstacle: ".mapSprite", preventCollision: true });
	},
	generateMap:function()
	{
		$("#currentMap .mapSprite, #currentMap .player img").each(function(){
			var name=$(this).attr('name'),
				x=parseFloat($(this).css('left').replace(/[^-\d\.]/g, '')),
				y=parseFloat($(this).css('top').replace(/[^-\d\.]/g, ''));
				
			if(typeof name =='undefined'){ //if doesnt have name, it should be players div
				name='playerPos';
			}
			Editor.mapCode[Editor.mapCode.length]={
				name:name,
				x:x,
				y:y,	
			};
		});
		
		if(Editor.mapCode.length>1){
			if($('#mapEditor textarea').length<1){
				$('#mapEditor').append('<textarea>'+JSON.stringify(Editor.mapCode)+'</textarea>');
			}else{
				$('#mapEditor textarea').text(JSON.stringify(Editor.mapCode));
			}
		}
		Editor.mapCode=[];//reset
	},
};