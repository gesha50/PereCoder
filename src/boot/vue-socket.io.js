
import VueSocketIO from 'vue-socket.io'

export default async ({ Vue, store }) => {
  Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://localhost:3001',
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
    },
  }))
}
