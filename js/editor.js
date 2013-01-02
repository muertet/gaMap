var Editor={

	menu:[],
	init:function()
	{
		for(k in items){
			var itm=items[k];
			if(typeof this.menu[itm.scenario] =='undefined'){
				this.menu[itm.scenario]=[];
			}
			itm.name=k;
			this.menu[itm.scenario][this.menu[itm.scenario].length]=itm;
		}
		
		var html='<div class="menu">';
		for(k in this.menu){
			html+='<li onclick="Editor.loadScenario(\''+k+'\');">'+k+'</li>';
		}
		html+='</div>';
		$('#mapEditor').prepend(html);
	},
	loadScenario:function(scenario)
	{
		var html='';
		for(k in this.menu[scenario]){
			var itm=this.menu[scenario][k];
			html+='<div class="mapSprite '+itm.name+'" type="'+itm.type+'"></div>';
		}
		$('#items').html(html);
		$("#mapEditor .mapSprite" ).draggable({ containment: "#currentMap", obstacle: ".mapSprite", preventCollision: true });
	},

};