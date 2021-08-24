<template>
  <q-page padding>
    <h1>joinToGame</h1>
    <q-input class="q-mb-md" filled v-model="nickname" label="Nickname" dense />
    <q-input class="q-mb-md" filled v-model="room" label="Room number" dense />
    <q-btn label="GO" @click="goToRegistration" />
  </q-page>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "joinToGame",
  data() {
    return {
      nickname: '',
      room: null,
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
        room: this.room,
        isOrganizer: false,
        isActive: false
      }, data => {
        if (typeof data == 'string') {
          console.error(data)
          alert(data)
          return
        }
        this.setUser({
          id: data.id,
          name: this.nickname,
          team: 'white',
          players: this.players,
          room: this.room,
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
