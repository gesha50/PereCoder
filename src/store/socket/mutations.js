
export function SOCKET_newMessage (ctx, data) {
  console.log(data)
}

export function SOCKET_updateUsers (state, data) {
  state.users = data
}

export function SOCKET_setUserTeam (state, data) {
  state.users = data
}

export function setUser (state, user) {
  state.user = user
  state.users.push(user)
}

export function setUserTeam (state, obj) {
  state.users[obj.key].team = obj.team
}
