import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

// we first import the module
import auth from './auth'
import style from './style'
import header from './header'
import socket from './socket'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // then we reference it
      auth,
      style,
      header,
      socket,
    },
    plugins: [createPersistedState()],
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  /*
    if we want some HMR magic for it, we handle
    the hot update like below. Notice we guard this
    code with "process.env.DEV" -- so this doesn't
    get into our production build (and it shouldn't).
  */

  if (process.env.DEV && module.hot) {
    module.hot.accept(['./auth'], () => {
      const newAuth = require('./auth').default
      Store.hotUpdate({ modules: { auth: newAuth } })
    })
    module.hot.accept(['./style'], () => {
      const newStyle = require('./style').default
      Store.hotUpdate({ modules: { style: newStyle } })
    })
    module.hot.accept(['./header'], () => {
      const newHeader = require('./header').default
      Store.hotUpdate({ modules: { header: newHeader } })
    })
    module.hot.accept(['./socket'], () => {
      const newSocket = require('./socket').default
      Store.hotUpdate({ modules: { socket: newSocket } })
    })
  }
  return Store
}
