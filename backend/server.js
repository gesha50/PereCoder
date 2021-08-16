const express = require('express');
const {createServer} =  require('http');
const {Server} = require('socket.io');
const cors = require('cors');
const app = express();
const server = createServer(app);
const users = require('./users')()

app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "https://localhost:8080",
    credentials: true,
  },
  allowEIO3: true
})


// let userMsgQueue = new Queue();

io.on("connection", socket => {

  // socket.on('test', (dataFromClient, cbToClient) => {})

  console.log('connection good')

  socket.on('createMessage', data => {
    setTimeout(() => {
      socket.emit('newMessage', {
        text: data.text+' Server'+ socket.id
      })
    }, 500)
  })

  socket.on('registerNewGame', (data, cb) => {
    if (!data.name || !data.room) {
      cb('error nickname or room')
    }
    users.remove(socket.id)
    users.add({
      id: socket.id,
      name: data.name,
      room: data.room,
      team: data.team,
    })
    socket.join(data.room)
    cb({userId: socket.id})
    io.to(data.room).emit('updateUsers', users.getByRoom(data.room))
  })

  socket.on('disconnect', () => {
    console.log('disconnect')
  })

  socket.on('getIdUser', (dataFromClient, cbToClient) => {
    cbToClient(users.get(socket.id))
  })
  socket.on('setUserTeam', (dataFromClient, cbToClient) => {
    const user = users.get(dataFromClient.key)
    console.log(user.team)
    user.team = dataFromClient.team
    // cbToClient(users)
    io.to(user.room).emit('setUserTeam', users.getByRoom(user.room))
  })
});

const PORT = 3001;
server.listen(PORT);
