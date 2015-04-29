var app = require('express')(),
   server = require('http').Server(app),
   io = require('socket.io')(server),
   _ = require('underscore'),
   Room=[];

server.listen(process.env.PORT || 8000);


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.htm');
});
app.get('/m/', function (req, res) {
  res.sendFile(__dirname + '/index_m.htm');
});



io.sockets.on("connection", function(socket){

  socket.on("PConline",function(){

    console.log("PConline",socket.id);//服务端输出打印
    var data=socket.id;
    Room.push(data);
    socket.join(data);
    io.sockets.in(data).emit("PCId", data);
   // socket.broadcast.emit("PCId",data);
  });

  socket.on("GetId",function(data){
    console.log("GetId",data);//服务端输出打印

    var hasRoom = _.findWhere(io.sockets.sockets,{id:data});
    if (hasRoom) {
      socket.join(data);
      io.sockets.in(data).emit("Scan", data);
    }else{
      socket.emit("err", "刷新") ;
    }
   // socket.broadcast.emit("PCId",data);
  });

  socket.on("MToP",function(data){
    console.log("MToP",data.msg);//服务端输出打印
    console.log("MToP",data.id);

    io.sockets.in(data.id).emit("GetNavigator", {id:data.id,msg:data.msg,h:data.h}) ;
  });


  socket.on('disconnect',function(){
    var data = _.findWhere(Room,socket.id);
    if(data){
      Room = _.without(Room,socket.id);
    }
  });

})


