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

function endGame() {
  isGameRun = false
  isWhiteBtnPress = false
  isBlackBtnPress = false
  ROUND = 0
  blackCounterHindrance = 0
  blackCounterInterception = 0
  whiteCounterHindrance = 0
  whiteCounterInterception = 0
  blackActiveIndex = 0
  whiteActiveIndex = 0
}

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
    client.expire(`room:${room}`,  60 * 60 * 2)
    cbToClient(room)
  })

  socket.on('registerNewGame', (data, cb) => {
    if (!data.name || !data.room) {
      cb('error! Empty nickname or room')
      return 0
    }

    // if (client.get(`room:${data.room}:game-status`, redis.print)) {
    //   console.log(client.get(`room:${data.room}:game-status`, redis.print))
    // }
    if (isGameRun) {
     cb('the game is Running')
      return 0
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
          return 0
        }
      })
    }
    const user = {
      id: socket.id,
      name: data.name,
      room: data.room,
      team: data.team,
      players: data.players ? data.players : 0,
      isOrganizer: data.isOrganizer
    }
    if (data.isOrganizer) {
      client.set(`room:${data.room}:players`, data.players.toString())
      client.expire(`room:${data.room}:players`,  60 * 60 * 2)
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
            cb(`room ${data.room} is Full! Too much players!`)
          } else {
            client.smembers(`room:${data.room}:name`, function (e, allUsersName){
              if (e) console.log(e)
              if (allUsersName.indexOf(user.name) !== -1) {
               cb('in game have same nickname')
              } else {
                client.del(socket.id)
                client.sadd(`room:${data.room}:name`, user.name)
                client.expire(`room:${data.room}:name`, 60*60*2)
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
                    client.expire(socket.id,  60 * 60 * 2)
                    client.set(`room:${data.room}:user:${socket.id}`, socket.id, redis.print)
                    client.expire(`room:${data.room}:user:${socket.id}`,  60 * 60 * 2)
                    socket.join(data.room)
                    users.getAllUsers(`room:${data.room}:user:*`, data.room, io)
                    cb(user)
                  })
              }
            })
          }
        })
      })
    }
    if (data.isOrganizer) {
      client.del(socket.id)
      client.sadd(`room:${data.room}:name`, user.name)
      client.expire(`room:${data.room}:name`, 60*60*2)
      client.hmset(socket.id,
        'id', socket.id,
        'name', user.name,
        'room', user.room,
        'team', user.team,
        'players', user.players,
        'isOrganizer', user.isOrganizer,
        'isActive', false,
        function (err, res) {
          if (err) console.log(err)
          client.expire(socket.id,  60 * 60 * 2)
          client.set(`room:${data.room}:user:${socket.id}`, socket.id, redis.print)
          client.expire(`room:${data.room}:user:${socket.id}`,  60 * 60 * 2)
          socket.join(data.room)
          io.to(data.room).emit('updateUsers', user)
          cb(user)
        })
    }
  })

  socket.on('setUserTeam', (dataFromClient, cbToClient) => {
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
        client.expire(dataFromClient.user.id,  60 * 60 * 2)
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
    client.expire(`room:${dataFromClient.room}:game-status`,  60 * 60 * 2)
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
    client.expire('FOUR_WORDS_WHITE',  60 * 60 * 2)
    client.expire('FOUR_WORDS_BLACK',  60 * 60 * 2)

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
          client.expire(`room:${dataFromClient.room}:team:white:users`, 60*60*2)
          socket.join(teamWhite)
          socket.emit('setFourWords', FOUR_WORDS_WHITE)
        } else {
          client.sadd(`room:${dataFromClient.room}:team:black:users`, res.id)
          client.expire(`room:${dataFromClient.room}:team:black:users`, 60*60*2)
          socket.join(teamBlack)
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
      client.expire(`room:${dataFromClient[0][0].room}:roundNumber`,  60 * 60 * 2)
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
              client.expire(keys[whiteActiveIndex],  60 * 60 * 2)
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
                    client.expire(
                      `room:${dataFromClient[0][0].room}:team:white:round:${ROUND}:threeCorrectSecretNumbers`,
                       60 * 60 * 2)
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
              client.expire(keys[blackActiveIndex],  60 * 60 * 2)
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
                    client
                      .expire(
                        `room:${dataFromClient[0][0].room}:team:black:round:${ROUND}:threeCorrectSecretNumbers`,
                         60 * 60 * 2)
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
      client.expire(`room:${dataFromClient[1].room}:team:white:round:${ROUND}:association`, 60*60*2)
      isWhiteBtnPress = true
    } else {
      // client.set(`room:${dataFromClient[0][0].room}:isBlackBtnPress`, 'true', redis.print)
      client.zadd(`room:${dataFromClient[1].room}:team:black:round:${ROUND}:association`,
        1, dataFromClient[0][0],
        2, dataFromClient[0][1],
        3, dataFromClient[0][2])
      client.expire(`room:${dataFromClient[1].room}:team:black:round:${ROUND}:association`, 60*60*2)
      isBlackBtnPress = true
    }
    if (isWhiteBtnPress && isBlackBtnPress) {
      isBlackBtnPress = false
      isWhiteBtnPress = false
      io.to(dataFromClient[1].room).emit('setActiveTeam', isBlackBtnPress)
      client.zrange(`room:${dataFromClient[1].room}:team:white:round:${ROUND}:association`, 0, -1, function (e, res) {
        if (e) console.log(e)
        io.to(dataFromClient[1].room).emit('setThreeWhiteWords', res)
        cbToClient()
      })
    } else {
      if (isWhiteBtnPress) {
        io.to(`${dataFromClient[1].room}-white`).emit('setActiveTeam', isWhiteBtnPress, 'wait your opponent')
      } else {
        io.to(`${dataFromClient[1].room}-black`).emit('setActiveTeam', isBlackBtnPress, 'wait your opponent')
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
          client.expire(`room:${dataFromClient[1].room}:team:white:round:${ROUND}:threeTryToGuessNumbers`,
                         60 * 60 * 2)
          if (threeCorrectSecretNumbers === dataFromClient[0]) {
            isTryWhiteToGuessCorrect = true
          } else  {
            isTryWhiteToGuessCorrect = false
            whiteCounterHindrance++
          }
          client.set(`room:${dataFromClient[1].room}:team:white:isTryToGuessCorrect`,
            isTryWhiteToGuessCorrect)
          client.expire(`room:${dataFromClient[1].room}:team:white:isTryToGuessCorrect`,  60 * 60 * 2)
          client.set(`room:${dataFromClient[1].room}:team:white:whiteCounterHindrance`,
            whiteCounterHindrance)
          client.expire(`room:${dataFromClient[1].room}:team:white:whiteCounterHindrance`,  60 * 60 * 2)
        } else {
          // client.set(`room:${dataFromClient[0][0].room}:isBlackBtnPress`, 'true', redis.print)
          isBlackBtnPress = true
          client.set(
            `room:${dataFromClient[1].room}:team:black:round:${ROUND}:threeTryToGuessNumbers`,
            dataFromClient[0])
          client.expire(`room:${dataFromClient[1].room}:team:black:round:${ROUND}:threeTryToGuessNumbers`,
                         60 * 60 * 2)
          if (threeCorrectSecretNumbers === dataFromClient[0]) {
            isTryBlackToGuessCorrect = true
            blackCounterInterception++
          } else {
            isTryBlackToGuessCorrect = false
          }
          client.set(`room:${dataFromClient[1].room}:team:black:isTryToGuessCorrect`,
            isTryBlackToGuessCorrect)
          client.expire(`room:${dataFromClient[1].room}:team:black:isTryToGuessCorrect`,  60 * 60 * 2)
          client.set(`room:${dataFromClient[1].room}:team:black:blackCounterInterception`,
            blackCounterInterception)
          client.expire(`room:${dataFromClient[1].room}:team:black:blackCounterInterception`,  60 * 60 * 2)
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
                      cbToClient()
                    })
                })
            })
          })
        } else {
          if (isWhiteBtnPress) {
            io.to(`${dataFromClient[1].room}-white`).emit('setActiveTeam', isWhiteBtnPress, 'wait your opponent')
          } else {
            io.to(`${dataFromClient[1].room}-black`).emit('setActiveTeam', isBlackBtnPress, 'wait your opponent')
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
          client.expire(`room:${dataFromClient[1].room}:team:white:round:${ROUND}:tryToGuessBlackNumbers`,
                         60 * 60 * 2)
          if (threeCorrectSecretNumbers === dataFromClient[0]) {
            isTryWhiteToGuessCorrect = true
            whiteCounterInterception++
          } else  {
            isTryWhiteToGuessCorrect = false
          }
          client.set(`room:${dataFromClient[1].room}:team:white:isTryToGuessCorrect`,
            isTryWhiteToGuessCorrect)
          client.expire(`room:${dataFromClient[1].room}:team:white:isTryToGuessCorrect`,  60 * 60 * 2)
          client.set(`room:${dataFromClient[1].room}:team:white:whiteCounterInterception`,
            whiteCounterInterception)
          client.expire(`room:${dataFromClient[1].room}:team:white:whiteCounterInterception`,  60 * 60 * 2)
        } else {
          // client.set(`room:${dataFromClient[0][0].room}:isBlackBtnPress`, 'true', redis.print)
          isBlackBtnPress = true
          client.set(
            `room:${dataFromClient[1].room}:team:black:round:${ROUND}:tryToGuessBlackNumbers`,
            dataFromClient[0])
          client.expire(`room:${dataFromClient[1].room}:team:black:round:${ROUND}:tryToGuessBlackNumbers`,
                         60 * 60 * 2)
          if (threeCorrectSecretNumbers === dataFromClient[0]) {
            isTryBlackToGuessCorrect = true
          } else {
            isTryBlackToGuessCorrect = false
            blackCounterHindrance++
          }
          client.set(`room:${dataFromClient[1].room}:team:black:isTryToGuessCorrect`,
            isTryBlackToGuessCorrect)
          client.expire(`room:${dataFromClient[1].room}:team:black:isTryToGuessCorrect`,  60 * 60 * 2)
          client.set(`room:${dataFromClient[1].room}:team:black:blackCounterHindrance`,
            blackCounterHindrance)
          client.expire(`room:${dataFromClient[1].room}:team:black:blackCounterHindrance`,  60 * 60 * 2)
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
                      cbToClient()
                      let  finishGame = isGameFinish(blackCounterHindrance, whiteCounterInterception,
                        whiteCounterHindrance, blackCounterInterception)
                      if (finishGame || ROUND===8) {
                        if (ROUND===8) {
                          if (finishGame===0) {
                            finishGame = isGameFinish(blackCounterHindrance+1, whiteCounterInterception+1,
                              whiteCounterHindrance+1, blackCounterInterception+1)
                          }
                          if (finishGame===0) {
                            finishGame = 'superRound'
                          }
                        }
                        endGame()
                        if (finishGame === 'blackWin') {
                          client.set(`room:${dataFromClient[1].room}:whoIsWinner`, 'black')
                          client.expire(`room:${dataFromClient[1].room}:whoIsWinner`, 60 * 60 * 2)
                          io.to(dataFromClient[1].room).emit('whoIsWinner', 'black')
                        } else if (finishGame === 'whiteWin') {
                          client.set(`room:${dataFromClient[1].room}:whoIsWinner`, 'white')
                          client.expire(`room:${dataFromClient[1].room}:whoIsWinner`, 60 * 60 * 2)
                          io.to(dataFromClient[1].room).emit('whoIsWinner', 'white')
                        } else {
                          client.set(`room:${dataFromClient[1].room}:whoIsWinner`, 'superRound')
                          client.expire(`room:${dataFromClient[1].room}:whoIsWinner`, 60 * 60 * 2)
                          io.to(dataFromClient[1].room).emit('whoIsWinner', 'superRound')
                        }
                      }
                      console.log(finishGame)
                    })
                })
            })
          })
        } else {
          if (isWhiteBtnPress) {
            io.to(`${dataFromClient[1].room}-white`)
              .emit('setActiveTeam', isWhiteBtnPress, 'wait your opponent')
          } else {
            io.to(`${dataFromClient[1].room}-black`)
              .emit('setActiveTeam', isBlackBtnPress, 'wait your opponent')
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
      client.expire(activeUser.id, 60 * 60 * 2)
    })
    console.log('finish')
    users.getAllUsers(`room:${dataFromClient[1].room}:user:*`, dataFromClient[1].room, io)
    cbToClient()
  })

  // addResultToList

  socket.on('addResultToList', (dataFromClient, cbToClient) => {
    io.to(dataFromClient[1]).emit('listGameWhiteSide', dataFromClient[0])
    cbToClient()
  })

  // end addResultToList

  // addResultToListBlack

  socket.on('addResultToListBlack', (dataFromClient, cbToClient) => {
    io.to(dataFromClient[1]).emit('listGameBlackSide', dataFromClient[0])
    cbToClient()
  })

  // end addResultToListBlack

  // end finish Round

  // end round

  // sendMessage

  socket.on('sendMessage', (dataFromClient, cbToClient) => {
    let arr = []
    arr.push(dataFromClient[1])
    let obj = { name: dataFromClient[0].name, message: arr}
    io.to(`${dataFromClient[0].room}-${dataFromClient[0].team}`)
      .emit('sendMessage', obj)
    cbToClient()
  })

  // end sendMessage

  socket.on('disconnecting', () => {
    console.log(socket.id)
    console.log('disconnectionnnn')
    console.log(socket.rooms) // the Set contains at least the socket ID
  });
  socket.on('disconnect',  () => {
    endGame()
    client.hgetall(socket.id, function (e, res){
      if (e) console.log(e)
      console.log(res)
      if (res) {
        io.to(res.room).emit('allDataNull')
      }
      socket.emit('allDataNull')
    })
  })
});

const PORT = process.env.PORT || 3001;
server.listen(PORT);
