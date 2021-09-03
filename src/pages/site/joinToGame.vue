<template>
  <q-card
    class="login-form"
    :style="$q.platform.is.mobile ? { width: '60%' } : { width: '50%' }"
  >
    <q-img src="/statics/images/label_4.png"></q-img>
    <div class="no-wrap items-center">
      <div class="text-h6 ellipsis text-center">
        Join to game
      </div>
    </div>
    <q-card-section class="column">
      <q-input class="q-mb-md" filled v-model="nickname" color="accent" label="Nickname" dense />
      <q-input class="q-mb-md" filled v-model="room" color="accent" label="Room number" dense />
      <q-btn :disable="isCorrect" color="accent" label="GO" @click="goToRegistration" />
      <div class="text-accent">{{error}}</div>
    </q-card-section>
  </q-card>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "joinToGame",
  data() {
    return {
      error: '',
      nickname: '',
      room: null,
    }
  },
  computed: {
    isCorrect() {
      if (this.nickname) {
        if (this.room) {
          return false
        } else {
          this.error = 'Please write room number'
          return true
        }
      } else {
        this.error = 'Please write nickname'
        return true
      }
    }
  },
  methods: {
    ...mapActions({
      setUser: 'socket/setUser'
    }),
    goToRegistration() {
      this.$socket.emit('registerNewGame', {
        name: this.nickname,
        team: 'white',
        room: this.room.toString(),
        isOrganizer: false,
        isActive: false
      }, data => {
        if (typeof data == 'string') {
          console.error(data)
          alert(data)
          return
        }
        console.log(data)
        this.setUser({
          id: data.id,
          name: this.nickname,
          team: 'white',
          players: this.players,
          room: this.room.toString(),
          isOrganizer: false,
          isActive: false
        })
        this.$router.push(`register-game/${this.room}`)
      })
    },
  },
}
</script>

<style scoped>

</style>
