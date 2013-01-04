var io = require('socket.io').listen(1135)
 playerPos={},
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
    playerPos[data.playerPos.uid]=data.playerPos;
    socket.emit('allPlayerData',{playerPos:playerPos});

    for(k in online){
     if(k==uid){continue;}
     online[k].emit('newPlayer',{playerPos:data.playerPos});
    }
  });
  socket.on('movePlayer', function(data){
    playerPos[data.playerPos.uid]=data.playerPos;
    for(k in online){
     if(k==uid){continue;}
     online[k].emit('movePlayer',{playerPos:data.playerPos});
    }

  });

  socket.on('disconnect', function () {
    
    delete online[uid];
    delete playerPos[uid];
    delete usedIds[uid];
    
    io.sockets.emit('killPlayer', {uid: uid });
  });
});
