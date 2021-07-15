const path = require('path');
const http = require('http')
const express = require('express');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser,userLeave,getRoomUsers} = require('./utils/users')
//set static folder 
app.use(express.static(path.join(__dirname,'/public')));
const PORT = process.env.PORT || 3000;
const  bot_name = "chitti Bot"
io.on('connection', socket => {
    //get user and room  info
       socket.on('joinRoom', ({username, room })=>{
          const user = userJoin(socket.id,username,room)
          socket.join(user.room);
          //when new user join the rom
          socket.emit('message', formatMessage(bot_name, 'Welcome to chat-App'));
          //when a user joins chat 
         socket.broadcast.to(user.room).emit('message', formatMessage(bot_name, `${user.username} joined the chat`));
         //send users list 
         io.to(user.room).emit('roomUser',{
              room : user.room,
              users : getRoomUsers(user.room)
          })
      })

   //when a user disconnects  
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        if(user){
            io.to(user.room).emit('message',formatMessage(bot_name, `${user.username} left the chat`));
            //send users list 
            io.to(user.room).emit('roomUser',{
            room : user.room,
            users : getRoomUsers(user.room)
        })
        }
    })  
    //listening for chat message  
    socket.on('chatMsg',(msg)=>{
        const user = getCurrentUser(socket.id)
        
    io.to(user.room).emit('message', formatMessage(user.username,msg))
    })
})
server.listen(PORT,()=>{
    console.log(`server runnning on https://localhost:${PORT}`);
}) 