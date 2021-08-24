const express = require('express');
const {createServer} =  require('http');
const {Server} = require('socket.io');
const cors = require('cors');
const app = express();
const server = createServer(app);
const users = require('./users')()
const redis = require("redis");
const {contains, getThreeNumbers} = require("./functions");
const client = redis.createClient();

const { DICTIONARY_CLASSIC } = require('./dictionaries')

client.on("connect", function(connect) {
  console.log('connect to redis');
});
client.on("error", function(error) {
  console.error(error);
});

let isGameRun = false

app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "https://localhost:8080",
    credentials: true,
    methods: ["GET", "POST"],
  },
  allowEIO3: true
})

io.on("connection", socket => {
// test code
  // socket.on('test', (dataFromClient, cbToClient) => {})
  console.log('connection good')

  socket.on('getIdUser', (dataFromClient, cbToClient) => {
    client.hgetall(dataFromClient.id, function (e, data){
      if (e) console.log(e)
      cbToClient(data)
    })
  })
  socket.on('createMessage', (dataFromClient, cbToClient) => {
    cbToClient(dataFromClient.text + ' Server')
    socket.emit('newMessage', dataFromClient.text + ' Server')
  })

// finish test code

  socket.on('registerNewGame', (data, cb) => {
    if (!data.name || !data.room) {
      cb('error nickname or room')
    }
    // if (client.get(`room:${data.room}:game-status`, redis.print)) {
      console.log(client.get(`room:${data.room}:game-status`, redis.print))
    // }
    if (isGameRun) {
     cb('the game is Running')
    }
    // if (isRoomFull) {
    //   cb('too much players in a room')
    // }
    // if () {
    //  cb('in game have same nickname')
    // }

    const user = {
      id: socket.id,
      name: data.name,
      room: data.room,
      team: data.team,
      players: data.players ? data.players : 0,
      isOrganizer: data.isOrganizer
    }

    client.del(socket.id)
    client.hmset(socket.id,
      'id', socket.id,
      'name', user.name,
      'room', user.room,
      'team', user.team,
      'players', user.players,
      'isOrganizer', user.isOrganizer,
      'isActive', false,
      function(err, res) {
        if (err) console.log(err)
        console.log(res)
        client.set(`room:${data.room}:user:${socket.id}`, socket.id, redis.print)
        socket.join(data.room)
        if (data.isOrganizer) {
          io.to(data.room).emit('updateUsers', user)
          cb(user)
        } else {
          cb(user)
          users.getAllUsers(`room:${data.room}:user:*`, data.room, io)
        }
      })
  })

  socket.on('setUserTeam', (dataFromClient, cbToClient) => {
    console.log(dataFromClient)
    client.hmset(dataFromClient.user.id,
      'id', dataFromClient.user.id,
      'name', dataFromClient.user.name,
      'room', dataFromClient.user.room,
      'team', dataFromClient.team,
      'players', dataFromClient.players ? dataFromClient.players : 0,
      'isOrganizer', dataFromClient.user.isOrganizer,
      'isActive', false,
      function(err, res) {
        if (err) console.log(err)
        cbToClient(dataFromClient.team)
        io.to(dataFromClient.user.room).emit('setTeam', dataFromClient.team, dataFromClient.i)
      }
    )
  })

  // start button from org the game
  // all others people redirect to game

  socket.on('startGame', (dataFromClient, cbToClient) =>{
    isGameRun = true
    client.set(`room:${dataFromClient.room}:game-status`, isGameRun, redis.print)
    let ROUND = 0
    let i=0
    let uniqueIndexForDictionary = []
    while (i<8) {
      let indexInDictionary = Math.floor(0 + Math.random() * (DICTIONARY_CLASSIC.length-1 + 1 - 0))
      if (i === 0) {
        uniqueIndexForDictionary.push(indexInDictionary)
        i++
      } else {
        if (!contains(uniqueIndexForDictionary, indexInDictionary)) {
          uniqueIndexForDictionary.push(indexInDictionary)
          i++
        }
      }
    }
    let FOUR_WORDS_WHITE = []
    let FOUR_WORDS_BLACK = []
    for (let i=0; i<uniqueIndexForDictionary.length;i++) {
      if (i<4) {
        FOUR_WORDS_WHITE.push(DICTIONARY_CLASSIC[uniqueIndexForDictionary[i]])
      } else {
        FOUR_WORDS_BLACK.push(DICTIONARY_CLASSIC[uniqueIndexForDictionary[i]])
      }
    }
    client.set('FOUR_WORDS_WHITE', JSON.stringify(FOUR_WORDS_WHITE), redis.print)
    client.set('FOUR_WORDS_BLACK', JSON.stringify(FOUR_WORDS_BLACK), redis.print)

    io.to(dataFromClient.room).emit('setGameStatus', isGameRun)
    cbToClient('ok')
  })

  // start to every people
  socket.on('joinToGameStart', (dataFromClient, cbToClient) => {
    client.hgetall(dataFromClient.id, function (e, res) {
      if (e) console.log(e)
      let teamWhite = dataFromClient.room+'-white'
      let teamBlack = dataFromClient.room+'-black'
      let multi = client.multi()
      let FOUR_WORDS_BLACK = ''
      let FOUR_WORDS_WHITE = ''
      multi.get('FOUR_WORDS_BLACK')
      multi.get('FOUR_WORDS_WHITE')
      multi.exec(function (err, replies) {
        FOUR_WORDS_BLACK = JSON.parse(replies[0])
        FOUR_WORDS_WHITE = JSON.parse(replies[1])
        if (res.team === 'white') {
          client.sadd(`room:${dataFromClient.room}:team:white:users`, res.id)
          socket.join(teamWhite)
          console.log(socket.rooms)
          socket.emit('setFourWords', FOUR_WORDS_WHITE)
        } else {
          console.log('black')
          client.sadd(`room:${dataFromClient.room}:team:black:users`, res.id)
          socket.join(teamBlack)
          console.log(socket.rooms)
          socket.emit('setFourWords', FOUR_WORDS_BLACK)
        }
      })
    })
    cbToClient('start')
  })

  // start round

  socket.on('startRound', (dataFromClient, cbToClient) => {
    client.smembers(`room:${dataFromClient.room}:team:white:users`, function (e, keys) {
      if (e) console.log(e)
      console.log(keys)
      // переделать чтобы по кругу было
      let activeIndex = Math.floor(0 + Math.random() * (keys.length-1 + 1 - 0))
      client.hgetall(keys[activeIndex], function (e, activeUser){
        if (e) console.log(e)
        client.hmset(keys[activeIndex],
          'id', keys[activeIndex],
          'name', activeUser.name,
          'room', activeUser.room,
          'team', activeUser.team,
          'players', activeUser.players,
          'isOrganizer', activeUser.isOrganizer,
          'isActive', true,
          function(err, res) {
            if (err) console.log(err)
            console.log(res)
            let multi = client.multi()
            keys.forEach(whiteUser =>{
              multi.hgetall(whiteUser)
            })
            multi.exec(function(error, whiteUser) {
              if (error) console.log(error)
              whiteUser.forEach(whUser =>{
                if (whUser.isActive) {
                  cbToClient()
                  console.log(socket.rooms)
                  socket.to(whUser.id).emit('threeNumbers', getThreeNumbers())
                } else {
                  cbToClient()
                }
              })
            })
          })
      })
      let multi = client.multi()
      keys.forEach(whiteUser =>{
        multi.hgetall(whiteUser)
      })
      multi.exec(function(err, replies) {
        console.log(replies)
      })
    })
    client.smembers(`room:${dataFromClient.room}:team:black:users`, function (e, keys) {
      if (e) console.log(e)
      console.log(keys)
      // переделать чтобы по кругу было
      let activeIndex = Math.floor(0 + Math.random() * (keys.length-1 + 1 - 0))
      client.hgetall(keys[activeIndex], function (e, activeUser){
        if (e) console.log(e)
        client.hmset(keys[activeIndex],
          'id', keys[activeIndex],
          'name', activeUser.name,
          'room', activeUser.room,
          'team', activeUser.team,
          'players', activeUser.players,
          'isOrganizer', activeUser.isOrganizer,
          'isActive', true,
          function(err, res) {
            if (err) console.log(err)
            console.log(res)
            let multi = client.multi()
            keys.forEach(blackUser =>{
              multi.hgetall(blackUser)
            })
            multi.exec(function(error, blackUsers) {
              if (error) console.log(error)
              blackUsers.forEach(blUser =>{
                if (blUser.isActive) {
                  cbToClient()
                  console.log(socket.rooms)
                  socket.to(blUser.id).emit('threeNumbers', getThreeNumbers())
                } else {
                  cbToClient()
                }
              })
            })
          })
      })
      let multi = client.multi()
      keys.forEach(blackUser =>{
        multi.hgetall(blackUser)
      })
      multi.exec(function(err, replies) {
        console.log(replies)
      })
    })
  })

  // end round

  socket.on('disconnecting', () => {
    console.log(socket.rooms); // the Set contains at least the socket ID
  });
  socket.on('disconnect', function (socket) {
    console.log(socket)
    console.log('disconnect')
  })
});

const PORT = 3001;
server.listen(PORT);
