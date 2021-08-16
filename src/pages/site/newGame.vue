<template>
  <q-page padding>
    <h1>newGame</h1>
    <q-input class="q-mb-md" filled v-model="nickname" label="Your nickname" dense />
    <q-input class="q-mb-md" filled v-model="players" label="How much players?" dense />
    <q-btn label="play" @click="newGame" />
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: "newGame",
  data() {
    return {
      nickname: '',
      players: 4,
    }
  },
  methods: {
    ...mapActions({
      setUser: 'socket/setUser'
    }),
    newGame() {
      // this.$socket.emit('test', dataToServer, dataFromServer => {})
      // получить уникальный код комнаты с сервера
      const room = 1111
      this.$socket.emit('registerNewGame', {
        name: this.nickname,
        players: this.players,
        team: 'black',
        room: room,
      }, data => {
        if (typeof data == 'string') {
          console.error(data)
        }
        console.log(data)
        this.setUser({
          id: data.userId,
          name: this.nickname,
          team: 'black',
          players: this.players,
          room: room,
        })
        this.$router.push('register-game')
      })
    }
  }
}
</script>

<style scoped>

</style>
