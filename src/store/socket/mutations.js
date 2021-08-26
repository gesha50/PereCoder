
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
  state.isGameRun = data
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

export function  SOCKET_setActiveTeam (state, data) {
  console.log('SOCKET_setActiveTeam')
  state.isTeamReady = data[0]
  state.gameMessage = data[1]
}

export function setUser (state, user) {
  state.user = user
}

export function setUserTeam (state, obj) {
  // state.users[obj.key].team = obj.team
  console.log(data)
  if (!!data.length) {
    state.users = data
  } else {
    state.users.push(data)
  }
}

export function  SOCKET_changeNumberOne (state, data) {
  console.log('SOCKET_changeNumberOne')
  state.firstNumber = data
}

export function  SOCKET_changeNumberTwo (state, data) {
  console.log('SOCKET_changeNumberTwo')
  state.secondNumber = data
}

export function  SOCKET_changeNumberThree (state, data) {
  console.log('SOCKET_changeNumberThree')
  state.thirdNumber = data
}

export function resetNumbers (state) {
  state.firstNumber = null
  state.secondNumber = null
  state.thirdNumber = null
}
