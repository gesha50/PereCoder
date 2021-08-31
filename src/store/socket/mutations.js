
export function SOCKET_newMessage (state, data) {
  console.log(data)
  state.message.push(data)
}

export function SOCKET_setFourWords (state, data) {
  console.log(data)
  state.FOUR_GAME_WORDS = data
}

export function SOCKET_updateUsers (state, data) {
  console.log(data)
  if (!!data.length) {
    state.users = data
  } else {
    state.users.push(data)
  }
}

export function SOCKET_setGameStatus (state, data) {
  state.isGameRun = data[0]
  state.ROUND = data[1]
}

export function SOCKET_setRound (state, data) {
  console.log(data)
  state.ROUND = data
}

export function  SOCKET_setTeam (state, data) {
  state.users[data[1]].team = data[0]
}

export function  SOCKET_setPersonalTeam (state, data) {
  state.user.team = data
}

export function  SOCKET_threeNumbers (state, data) {
  console.log('SOCKET_threeNumbers')
  state.threeNumbers = data
  state.user.isActive = true
}

export function  SOCKET_messageToNotActive (state, data) {
  console.log('messageToNotActive')
  state.gameMessage = data
  state.step = 1
}

export function  SOCKET_setThreeWhiteWords (state, data) {
  console.log('SOCKET_setThreeWhiteWords')
  state.threeWhiteAssociation = data
  state.step = 2
}

export function  SOCKET_setThreeBlackWords (state, data) {
  console.log('SOCKET_setThreeBlackWords')
  state.threeBlackAssociation = data
  state.step = 4
}

export function  SOCKET_middleRoundResult (state, data) {
  console.log('SOCKET_middleRoundResult')
  state.isTryBlackToGuessCorrect = data[0]
  state.isTryWhiteToGuessCorrect = data[1]
  state.blackCounterInterception = data[2]
  state.whiteCounterHindrance = data[3]

  let correctArr = JSON.parse(data[4])
  state.correctFirstNumber = correctArr[0]
  state.correctSecondNumber = correctArr[1]
  state.correctThirdNumber = correctArr[2]

  let whiteArr = JSON.parse(data[5])

  state.firstNumberWhite = whiteArr[0]
  state.secondNumberWhite = whiteArr[1]
  state.thirdNumberWhite = whiteArr[2]

  let blackArr = JSON.parse(data[6])
  state.firstNumberBlack = blackArr[0]
  state.secondNumberBlack = blackArr[1]
  state.thirdNumberBlack = blackArr[2]

  state.step = 3
}

export function SOCKET_finishRoundResult (state, data) {
  console.log('SOCKET_finishRoundResult')
  console.log(data)

  state.isTryBlackToGuessCorrect = data[0]
  state.isTryWhiteToGuessCorrect = data[1]
  state.blackCounterHindrance = data[2]
  state.whiteCounterInterception = data[3]

  let correctArr = JSON.parse(data[4])
  state.correctFirstNumber = correctArr[0]
  state.correctSecondNumber = correctArr[1]
  state.correctThirdNumber = correctArr[2]

  let whiteArr = JSON.parse(data[5])

  state.firstNumberWhite = whiteArr[0]
  state.secondNumberWhite = whiteArr[1]
  state.thirdNumberWhite = whiteArr[2]

  let blackArr = JSON.parse(data[6])
  state.firstNumberBlack = blackArr[0]
  state.secondNumberBlack = blackArr[1]
  state.thirdNumberBlack = blackArr[2]

  state.step = 5
}

export function  SOCKET_setActiveTeam (state, data) {
  console.log('SOCKET_setActiveTeam')
  state.isTeamReady = data[0]
  state.gameMessage = data[1]
}

export function setUser (state, user) {
  state.user = user
}

export function setUserTeam (state, obj) {
  console.log(data)
  if (!!data.length) {
    state.users = data
  } else {
    state.users.push(data)
  }
}

export function  SOCKET_changeNumberOne (state, data) {
  console.log('SOCKET_changeNumberOne')
  if (data[1] === 'white') {
    state.firstNumberWhite = data[0]
  } else {
    state.firstNumberBlack = data[0]
  }
}

export function  SOCKET_changeNumberTwo (state, data) {
  console.log('SOCKET_changeNumberTwo')
  if (data[1] === 'white') {
    state.secondNumberWhite = data[0]
  } else {
    state.secondNumberBlack = data[0]
  }
}

export function  SOCKET_changeNumberThree (state, data) {
  console.log('SOCKET_changeNumberThree')
  if (data[1] === 'white') {
    state.thirdNumberWhite = data[0]
  } else {
    state.thirdNumberBlack = data[0]
  }
}

export function SOCKET_nullNumbers (state, team) {
  if (team === 'white') {
    state.firstNumberWhite = null
    state.secondNumberWhite = null
    state.thirdNumberWhite = null
  } else if (team === 'black') {
    state.firstNumberBlack = null
    state.secondNumberBlack = null
    state.thirdNumberBlack = null
  } else {
    state.firstNumberWhite = null
    state.secondNumberWhite = null
    state.thirdNumberWhite = null
    state.firstNumberBlack = null
    state.secondNumberBlack = null
    state.thirdNumberBlack = null
  }
}

export function  SOCKET_isActiveUserFalse (state) {
  console.log('SOCKET_isActiveUserFalse')
  state.user.isActive = false
}

export function  SOCKET_whoIsWinner (state, data) {
  console.log('SOCKET_whoIsWinner')
  state.whoIsWinner = data
}

export function  SOCKET_listGameWhiteSide (state, data) {
  console.log('SOCKET_listGameWhiteSide')
  console.log(data)
  state.listGameWhiteSide.push(data)

  state.associationsForWhiteSecretWords[data.threeCorrectNumbers[0]-1].push(data.threeWords[0])
  state.associationsForWhiteSecretWords[data.threeCorrectNumbers[1]-1].push(data.threeWords[1])
  state.associationsForWhiteSecretWords[data.threeCorrectNumbers[2]-1].push(data.threeWords[2])
}

export function  SOCKET_listGameBlackSide (state, data) {
  console.log('SOCKET_listGameBlackSide')
  state.listGameBlackSide.push(data)

  state.associationsForBlackSecretWords[data.threeCorrectNumbers[0]-1].push(data.threeWords[0])
  state.associationsForBlackSecretWords[data.threeCorrectNumbers[1]-1].push(data.threeWords[1])
  state.associationsForBlackSecretWords[data.threeCorrectNumbers[2]-1].push(data.threeWords[2])
}


