
export function setUser ({commit}, user) {
  commit('setUser', user)
}

export function setUserTeam ({commit}, obj) {
  commit('setUserTeam', obj)
}

export function resetNumbers ({commit}) {
  commit('resetNumbers')
}

export function allDataNull ({commit}) {
  commit('allDataNull')
}

export function setDictionary ({ commit }, value) {
  commit('setDictionary', value)
}

