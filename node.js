var io = require('./node_modules/socket.io').listen(1135)
 playerPos={},
 keys={},
 usedIds={},
 online={};
io.sockets.on('connection', function (socket) {

  var uid=Math.floor(Math.random() * 1000);
  
  if(typeof usedIds[uid]=='undefined'){
   online[uid]=socket;
   usedIds[uid]=true;
  }

  socket.emit('getId', { uid: uid});
  socket.on('playerData', function (data) {
    playerPos[data.uid]=data;
    var tempObj={},temp={};
    for(k in playerPos){
      temp=playerPos[k];
      if(temp.area==data.area){
        tempObj[temp.uid]=temp;
      }
    }
    socket.emit('allPlayerData',tempObj);

    for(k in online){
     if(k==uid){continue;}
     online[k].emit('newPlayer',data);
    }
  });
  socket.on('movePlayer', function(data){
    playerPos[data.uid]=data;
    for(k in online){
     if(k==uid || playerPos[k].area!=data.area){continue;}
     online[k].emit('movePlayer',data);
    }

  });
  socket.on('changeArea',function(data){
   playerPos[data.uid]=data;
    var tempObj={},temp={};
    for(k in playerPos){
      temp=playerPos[k];
      if(temp.area==data.area){
        tempObj[temp.uid]=temp;
      }
    }
    socket.emit('allPlayerData',tempObj);


  });
  socket.on('disconnect', function () {
    
    delete online[uid];
    delete playerPos[uid];
    delete usedIds[uid];
    
    io.sockets.emit('killPlayer',uid);
  });
});
