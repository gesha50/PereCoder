<template>
  <q-card
    class="login-form"
    :style="$q.platform.is.mobile ? { width: '60%' } : { width: '50%' }"
  >
    <q-img src="/statics/images/label_4.png"></q-img>
    <div class="row justify-around no-wrap items-center">
      <div class="text-h6 ellipsis text-center">
        New game
      </div>
      <div>room: <strong>{{room}}</strong></div>
    </div>
    <q-card-section class="column">
      <q-input class="q-mb-md" filled v-model="nickname" label="Your nickname" color="accent" dense />
      <q-input class="q-mb-md" filled v-model="players" label="How much players?" color="accent" dense />
      <q-btn :disable="(!(players>=4 && players<=12)) || !nickname.length" color="accent" label="play" @click="newGame" />
      <div class="text-accent" v-if="!(players>=4 && players<=12)">You need players from 4 to 12</div>
    </q-card-section>
  </q-card>
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
