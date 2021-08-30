const express = require('express');
const {createServer} =  require('http');
const {Server} = require('socket.io');
const cors = require('cors');
const app = express()
const server = createServer(app)
const users = require('./users')()
const redis = require("redis")
const {contains, getThreeNumbers, isGameFinish, getRoomNumber, isRoomExist} = require("./functions")
const client = redis.createClient()
const { DICTIONARY_CLASSIC } = require('./dictionaries')

client.on("connect", function(connect) {
  console.log('connect to redis');
})
client.on("error", function(error) {
  console.error(error);
})

let isGameRun = false
let isWhiteBtnPress = false
let isBlackBtnPress = false
let ROUND = 0
let isTryBlackToGuessCorrect
let isTryWhiteToGuessCorrect
let blackCounterHindrance = 0
let blackCounterInterception = 0
let whiteCounterHindrance = 0
let whiteCounterInterception = 0
let blackActiveIndex = 0
let whiteActiveIndex = 0

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

  socket.on('getRoomCode', (dataFromClient, cbToClient) => {
    let room = getRoomNumber()
    while (isRoomExist(client, room)) {
      isRoomExist(client, room)
    }
    client.set(`room:${room}`, room, redis.print)
    cbToClient(room)
  })

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

    if (!data.isOrganizer) {
      let isEx = false
      client.keys('room:????', function (e, keys) {
        keys.forEach(key => {
          let oldRoom = key.split(':')[1]
          if (oldRoom === data.room) {
            isEx = true
          }
        })
        if (!isEx){
          cb(`room ${data.room} not exist! Please start a new game or check the room number`)
        }
      })
    }

    if (data.isOrganizer) {
      client.set(`room:${data.room}:players`, data.players.toString())
    }
    let isRoomFull = false
    if (!data.isOrganizer) {
      client.keys(`room:${data.room}:user:*`, function (e, usersKeyInRoom){
        if (e) console.log(e)
        let multi = client.multi()
        multi.get(`room:${data.room}:players`, function (er, players){
          if (usersKeyInRoom.length+1 > Number(players)) {
            isRoomFull = true
          }
        })
        multi.exec(function(err, replies) {
          if (isRoomFull) {
            cb(`room ${data.room} is Full! Too much players!`) // cb не работает...
            console.log('room full!')
          }
        })
      })
    }

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
        client.set(`room:${data.room}:user:${socket.id}`, socket.id, redis.print)
        socket.join(data.room)
        if (data.isOrganizer) {
          io.to(data.room).emit('updateUsers', user)
          cb(user)
        } else {
          users.getAllUsers(`room:${data.room}:user:*`, data.room, io)
          cb(user)
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
        io.to(dataFromClient.user.id).emit('setPersonalTeam', dataFromClient.team)
      }
    )
  })

  // start button from org the game
  // all others people redirect to game

  socket.on('startGame', (dataFromClient, cbToClient) =>{
    isGameRun = true
    client.set(`room:${dataFromClient.room}:game-status`, isGameRun, redis.print)
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

    io.to(dataFromClient.room).emit('setGameStatus', isGameRun, ROUND)
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
    if (dataFromClient[1].team === 'white') {
      // client.set(`room:${dataFromClient[0][0].room}:isWhiteBtnPress`, 'true', redis.print)
      isWhiteBtnPress = true
    } else {
      // client.set(`room:${dataFromClient[0][0].room}:isBlackBtnPress`, 'true', redis.print)
      isBlackBtnPress = true
    }
    if (isWhiteBtnPress && isBlackBtnPress) {
      console.log('start')
      ROUND++
      client.set(`room:${dataFromClient[0][0].room}:roundNumber`, ROUND)
      io.to(dataFromClient[0][0].room).emit('setRound', ROUND)

      isBlackBtnPress = false
      isWhiteBtnPress = false
      io.to(dataFromClient[0][0].room).emit('setActiveTeam', isBlackBtnPress)

      client.smembers(`room:${dataFromClient[0][0].room}:team:white:users`, function (e, keys) {
        if (e) console.log(e)
        if (ROUND !== 0) {
          whiteActiveIndex++
          if (whiteActiveIndex > keys.length-1) {
            whiteActiveIndex = 0
          }
        }
        console.log(whiteActiveIndex)
        client.hgetall(keys[whiteActiveIndex], function (e, activeUser){
          if (e) console.log(e)
          client.hmset(keys[whiteActiveIndex],
            'id', keys[whiteActiveIndex],
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
                whiteUser.forEach(whUser => {
                  if (whUser.isActive === 'true') {
                    let threeCorrectSecretNumbers = getThreeNumbers()
                    client.set(
                      `room:${dataFromClient[0][0].room}:team:white:round:${ROUND}:threeCorrectSecretNumbers`,
                      JSON.stringify(threeCorrectSecretNumbers))
                    io.to(whUser.id).emit('threeNumbers', threeCorrectSecretNumbers)
                  }
                })
              })
            })
        })
      })
      client.smembers(`room:${dataFromClient[0][0].room}:team:black:users`, function (e, keys) {
        if (e) console.log(e)
        if (ROUND !== 0) {
          blackActiveIndex++
          if (blackActiveIndex > keys.length-1) {
            blackActiveIndex = 0
          }
        }
        console.log(blackActiveIndex)
        client.hgetall(keys[blackActiveIndex], function (e, activeUser){
          if (e) console.log(e)
          client.hmset(keys[blackActiveIndex],
            'id', keys[blackActiveIndex],
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
                  if (blUser.isActive === 'true') {
                    let threeCorrectSecretNumbers = getThreeNumbers()
                    client.set(
                      `room:${dataFromClient[0][0].room}:team:black:round:${ROUND}:threeCorrectSecretNumbers`,
                      JSON.stringify(threeCorrectSecretNumbers))
                    io.to(blUser.id).emit('threeNumbers', threeCorrectSecretNumbers)
                  }
                })
              })
            })
        })
      })
      cbToClient()
      io.to(dataFromClient[0][0].room).emit('messageToNotActive' ,'Wait please! Active players write a words =)')
    } else {
      if (isWhiteBtnPress) {
        io.to(`${dataFromClient[0][0].room}-white`).emit('setActiveTeam', isWhiteBtnPress, 'wait your opponent')
        cbToClient()
      } else {
        io.to(`${dataFromClient[0][0].room}-black`).emit('setActiveTeam', isBlackBtnPress, 'wait your opponent')
        cbToClient()
      }
    }
  })

  // readyThreeWords

  socket.on('readyThreeWords', (dataFromClient, cbToClient) => {
    if (dataFromClient[1].team === 'white') {
      // client.set(`room:${dataFromClient[0][0].room}:isWhiteBtnPress`, 'true', redis.print)
      client.zadd(`room:${dataFromClient[1].room}:team:white:round:${ROUND}:association`,
        1, dataFromClient[0][0],
        2, dataFromClient[0][1],
        3, dataFromClient[0][2])
      isWhiteBtnPress = true
    } else {
      // client.set(`room:${dataFromClient[0][0].room}:isBlackBtnPress`, 'true', redis.print)
      client.zadd(`room:${dataFromClient[1].room}:team:black:round:${ROUND}:association`,
        1, dataFromClient[0][0],
        2, dataFromClient[0][1],
        3, dataFromClient[0][2])
      isBlackBtnPress = true
    }
    if (isWhiteBtnPress && isBlackBtnPress) {
      isBlackBtnPress = false
      isWhiteBtnPress = false
      io.to(dataFromClient[1].room).emit('setActiveTeam', isBlackBtnPress)
      client.zrange(`room:${dataFromClient[1].room}:team:white:round:${ROUND}:association`, 0, -1, function (e, res) {
        if (e) console.log(e)
        io.to(dataFromClient[1].room).emit('setThreeWhiteWords', res)
      })
    } else {
      if (isWhiteBtnPress) {
        io.to(`${dataFromClient[1].room}-white`).emit('setActiveTeam', isWhiteBtnPress, 'wait your opponent')
        cbToClient()
      } else {
        io.to(`${dataFromClient[1].room}-black`).emit('setActiveTeam', isBlackBtnPress, 'wait your opponent')
        cbToClient()
      }
    }
  })

  // end readyThreeWords

  socket.on('changeNumberOne', (dataFromClient, cbToClient) => {
    cbToClient()
    io.to(`${dataFromClient[1].room}-${dataFromClient[1].team}`)
      .emit('changeNumberOne', dataFromClient[0],dataFromClient[1].team)
  })
  socket.on('changeNumberTwo', (dataFromClient, cbToClient) => {
    cbToClient()
    io.to(`${dataFromClient[1].room}-${dataFromClient[1].team}`)
      .emit('changeNumberTwo', dataFromClient[0],dataFromClient[1].team)
  })
  socket.on('changeNumberThree', (dataFromClient, cbToClient) => {
    cbToClient()
    io.to(`${dataFromClient[1].room}-${dataFromClient[1].team}`)
      .emit('changeNumberThree', dataFromClient[0],dataFromClient[1].team)
  })

  socket.on('nullNumbers', (dataFromClient, cbToClient) => {
    cbToClient()
    io.to(`${dataFromClient[1].room}-${dataFromClient[1].team}`)
      .emit('nullNumbers', dataFromClient[0])
  })
  // tryToGuessSecretCode

  socket.on('tryToGuessSecretCode', (dataFromClient, cbToClient) => {
    dataFromClient[0] = JSON.stringify(dataFromClient[0])
    client.get(`room:${dataFromClient[1].room}:team:white:round:${ROUND}:threeCorrectSecretNumbers`,
      function (e, threeCorrectSecretNumbers) {
        if (dataFromClient[1].team === 'white') {
          // client.set(`room:${dataFromClient[0][0].room}:isWhiteBtnPress`, 'true', redis.print)
          isWhiteBtnPress = true
          client.set(
            `room:${dataFromClient[1].room}:team:white:round:${ROUND}:threeTryToGuessNumbers`,
            dataFromClient[0])
          if (threeCorrectSecretNumbers === dataFromClient[0]) {
            isTryWhiteToGuessCorrect = true
          } else  {
            isTryWhiteToGuessCorrect = false
            whiteCounterHindrance++
          }
          client.set(`room:${dataFromClient[1].room}:team:white:isTryToGuessCorrect`, isTryWhiteToGuessCorrect)
          client.set(`room:${dataFromClient[1].room}:team:white:whiteCounterHindrance`, whiteCounterHindrance)
        } else {
          // client.set(`room:${dataFromClient[0][0].room}:isBlackBtnPress`, 'true', redis.print)
          isBlackBtnPress = true
          client.set(
            `room:${dataFromClient[1].room}:team:black:round:${ROUND}:threeTryToGuessNumbers`,
            dataFromClient[0])
          if (threeCorrectSecretNumbers === dataFromClient[0]) {
            isTryBlackToGuessCorrect = true
            blackCounterInterception++
          } else {
            isTryBlackToGuessCorrect = false
          }
          client.set(`room:${dataFromClient[1].room}:team:black:isTryToGuessCorrect`, isTryBlackToGuessCorrect)
          client.set(`room:${dataFromClient[1].room}:team:black:blackCounterInterception`, blackCounterInterception)
        }
        if (isWhiteBtnPress && isBlackBtnPress) {
          isBlackBtnPress = false
          isWhiteBtnPress = false
          io.to(dataFromClient[1].room).emit('setActiveTeam', isBlackBtnPress)
          client.get(`room:${dataFromClient[1].room}:team:white:isTryToGuessCorrect`, function (e, white){
            if (e) console.log(e)
            client.get(`room:${dataFromClient[1].room}:team:black:isTryToGuessCorrect`, function (e, black){
              if (e) console.log(e)
              client.get(`room:${dataFromClient[1].room}:team:white:round:${ROUND}:threeTryToGuessNumbers`,
                function (e, whiteThreeTryToGuessNumbers){
                  if (e) console.log(e)
                  client.get(`room:${dataFromClient[1].room}:team:black:round:${ROUND}:threeTryToGuessNumbers`,
                    function (e, blackThreeTryToGuessNumbers){
                      if (e) console.log(e)
                      io.to(dataFromClient[1].room)
                        .emit('middleRoundResult', black, white,
                          blackCounterInterception, whiteCounterHindrance,
                          threeCorrectSecretNumbers, whiteThreeTryToGuessNumbers,
                          blackThreeTryToGuessNumbers)
                    })
                })
            })
          })
        } else {
          if (isWhiteBtnPress) {
            io.to(`${dataFromClient[1].room}-white`).emit('setActiveTeam', isWhiteBtnPress, 'wait your opponent')
            cbToClient()
          } else {
            io.to(`${dataFromClient[1].room}-black`).emit('setActiveTeam', isBlackBtnPress, 'wait your opponent')
            cbToClient()
          }
        }
      })
  })

  // end tryToGuessSecretCode

  // three word black team

  socket.on('nextThreeWords', (dataFromClient, cbToClient) => {
    if (dataFromClient.team === 'white') {
      // client.set(`room:${dataFromClient[0][0].room}:isWhiteBtnPress`, 'true', redis.print)
      isWhiteBtnPress = true
    } else {
      // client.set(`room:${dataFromClient[0][0].room}:isBlackBtnPress`, 'true', redis.print)
      isBlackBtnPress = true
    }
    if (isWhiteBtnPress && isBlackBtnPress) {
      isBlackBtnPress = false
      isWhiteBtnPress = false
      io.to(dataFromClient.room).emit('setActiveTeam', isBlackBtnPress)

      client.zrange(`room:${dataFromClient.room}:team:black:round:${ROUND}:association`, 0, -1, function (e, res) {
        if (e) console.log(e)
        io.to(dataFromClient.room).emit('setThreeBlackWords', res)
      })
    } else {
      if (isWhiteBtnPress) {
        io.to(`${dataFromClient.room}-white`).emit('setActiveTeam', isWhiteBtnPress, 'wait your opponent')
        cbToClient()
      } else {
        io.to(`${dataFromClient.room}-black`).emit('setActiveTeam', isBlackBtnPress, 'wait your opponent')
        cbToClient()
      }
    }
  })

  //end three word black team

  // Try To Guess Secret Code team black

  socket.on('nextTryToGuessSecretCode', (dataFromClient, cbToClient) => {
    dataFromClient[0] = JSON.stringify(dataFromClient[0])
    client.get(`room:${dataFromClient[1].room}:team:black:round:${ROUND}:threeCorrectSecretNumbers`,
      function (e, threeCorrectSecretNumbers) {
        if (dataFromClient[1].team === 'white') {
          // client.set(`room:${dataFromClient[0][0].room}:isWhiteBtnPress`, 'true', redis.print)
          isWhiteBtnPress = true
          client.set(
            `room:${dataFromClient[1].room}:team:white:round:${ROUND}:tryToGuessBlackNumbers`,
            dataFromClient[0])
          if (threeCorrectSecretNumbers === dataFromClient[0]) {
            isTryWhiteToGuessCorrect = true
            whiteCounterInterception++
          } else  {
            isTryWhiteToGuessCorrect = false
          }
          client.set(`room:${dataFromClient[1].room}:team:white:isTryToGuessCorrect`, isTryWhiteToGuessCorrect)
          client.set(`room:${dataFromClient[1].room}:team:white:whiteCounterInterception`, whiteCounterInterception)
        } else {
          // client.set(`room:${dataFromClient[0][0].room}:isBlackBtnPress`, 'true', redis.print)
          isBlackBtnPress = true
          client.set(
            `room:${dataFromClient[1].room}:team:black:round:${ROUND}:tryToGuessBlackNumbers`,
            dataFromClient[0])
          if (threeCorrectSecretNumbers === dataFromClient[0]) {
            isTryBlackToGuessCorrect = true
          } else {
            isTryBlackToGuessCorrect = false
            blackCounterHindrance++
          }
          client.set(`room:${dataFromClient[1].room}:team:black:isTryToGuessCorrect`, isTryBlackToGuessCorrect)
          client.set(`room:${dataFromClient[1].room}:team:black:blackCounterHindrance`, blackCounterHindrance)
        }
        if (isWhiteBtnPress && isBlackBtnPress) {
          isBlackBtnPress = false
          isWhiteBtnPress = false
          io.to(dataFromClient[1].room).emit('setActiveTeam', isBlackBtnPress)
          client.get(`room:${dataFromClient[1].room}:team:white:isTryToGuessCorrect`, function (e, white){
            if (e) console.log(e)
            client.get(`room:${dataFromClient[1].room}:team:black:isTryToGuessCorrect`, function (e, black){
              if (e) console.log(e)
              client.get(`room:${dataFromClient[1].room}:team:white:round:${ROUND}:tryToGuessBlackNumbers`,
                function (e, whiteThreeTryToGuessNumbers){
                  if (e) console.log(e)
                  client.get(`room:${dataFromClient[1].room}:team:black:round:${ROUND}:tryToGuessBlackNumbers`,
                    function (e, blackThreeTryToGuessNumbers){
                      if (e) console.log(e)
                      io.to(dataFromClient[1].room)
                        .emit('finishRoundResult', black, white,
                          blackCounterHindrance, whiteCounterInterception,
                          threeCorrectSecretNumbers, whiteThreeTryToGuessNumbers,
                          blackThreeTryToGuessNumbers)
                      if (isGameFinish) {
                        // redirect to finish screen
                        // and delete all key after 5 minutes
                        //isGameRun = false
                      }
                      console.log(isGameFinish(blackCounterHindrance, whiteCounterInterception,
                        whiteCounterHindrance, blackCounterInterception))
                    })
                })
            })
          })
        } else {
          if (isWhiteBtnPress) {
            io.to(`${dataFromClient[1].room}-white`).emit('setActiveTeam', isWhiteBtnPress, 'wait your opponent')
            cbToClient()
          } else {
            io.to(`${dataFromClient[1].room}-black`).emit('setActiveTeam', isBlackBtnPress, 'wait your opponent')
            cbToClient()
          }
        }
      })
  })

  //end

  // finish Round

  socket.on('isActiveUserFalse', (dataFromClient, cbToClient) => {
    io.to(dataFromClient.room).emit('isActiveUserFalse')
  })

  socket.on('finishRound', (dataFromClient, cbToClient) => {
    let arr = []
    dataFromClient[0].forEach(user=>{
      if (user.isActive) {
        arr.push(user)
      }
    })
    arr.forEach(activeUser=>{
      client.hmset(activeUser.id,
        'id', activeUser.id,
        'name', activeUser.name,
        'room', activeUser.room,
        'team', activeUser.team,
        'players', activeUser.players,
        'isOrganizer', activeUser.isOrganizer,
        'isActive', false)
    })
    console.log('finish')
    users.getAllUsers(`room:${dataFromClient[1].room}:user:*`, dataFromClient[1].room, io)
    cbToClient()
  })

  // end finish Round

  // end round

  socket.on('disconnecting', () => {
    console.log(socket.id)
    console.log('disconnectionnnn')
    console.log(socket.rooms) // the Set contains at least the socket ID
  });
  socket.on('disconnect', function (socket) {
    console.log(socket)
    console.log('disconnect')
  })
});

const PORT = process.env.PORT || 3001;
server.listen(PORT);
