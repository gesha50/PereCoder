<template>
  <q-page padding>
    <h1>newGame</h1>
    <q-input class="q-mb-md" filled v-model="nickname" label="Your nickname" dense />
    <q-input class="q-mb-md" filled v-model="players" label="How much players?" dense />
    <p>room: {{room}}</p>
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
      room: null,
    }
  },
  mounted() {
    // получить уникальный код комнаты с сервера
    this.$socket.emit('getRoomCode', '', dataFromServer => {
      console.log(dataFromServer)
      this.room = dataFromServer
    })
  },
  methods: {
    ...mapActions({
      setUser: 'socket/setUser'
    }),
    newGame() {
      // this.$socket.emit('test', dataToServer, dataFromServer => {})

      this.$socket.emit('registerNewGame', {
        name: this.nickname,
        players: this.players,
        team: 'black',
        room: this.room,
        isOrganizer: true,
        isActive: false
      }, data => {
        if (typeof data == 'string') {
          console.error(data)
        }
        this.setUser({
          id: data.id,
          name: this.nickname,
          team: 'black',
          players: this.players,
          room: this.room,
          isOrganizer: true,
          isActive: false
        })
        this.$router.push(`register-game/${this.room}`)
      })
    }
  }
}
</script>

<style scoped>

</style>
