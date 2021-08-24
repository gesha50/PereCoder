
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
  state.user.team = data[0]
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
