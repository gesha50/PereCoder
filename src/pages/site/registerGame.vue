<template>
  <div class="row justify-center">
    <q-card
      class="login-form q-mt-xl"
      :style="$q.platform.is.mobile ? { width: '60%' } : { width: '50%' }"
    >
      <p style="display: none">{{isGameRun}}</p>
      <div class="no-wrap items-center">
        <div class="text-h6 ellipsis text-center">
          Register Game
        </div>
        room: {{currentUser.room}}
        <p>капитан распределяет игроков на команды</p>
      </div>
      <div class="row">
        <q-card
          class="user q-ma-sm"
          :class="user.team"
          v-for="(user, i) in allUsers"
          :key="i"
        >
          <q-card-section class="q-ma-sm">
            <div class="text-h6">{{user.name}}</div>
            <div class="text-subtitle2">Your team: {{user.team}}</div>
            <div class="row justify-around" v-if="currentUser.isOrganizer">
              <q-btn label="white" color="white" text-color="black" @click="setUserTeam({team: 'white', user: user, i})" />
              <q-btn label="black" color="black" @click="setUserTeam({team: 'black', user: user, i})" />
            </div>
          </q-card-section>
        </q-card>
      </div>
      <q-card-section class="column">
        <q-btn v-if="currentUser.isOrganizer" label="start game!" color="green" @click="startGame" />
        <p v-if="message">{{message}}</p>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
// блокирует перезагрузку страницы
window.onbeforeunload = function(e) {
  let dialogText = 'Dialog text here';
  e.returnValue = dialogText;
  return dialogText;
};
import {mapActions} from "vuex";

export default {
  name: "registerGame",
  data() {
    return {
      color: 'white',
      message: '',
    }
  },
  computed: {
    currentUser() {
      return this.$store.getters["socket/user"]
    },
    allUsers() {
      return this.$store.getters["socket/users"]
    },
    isGameRun() {
      return this.$store.getters["socket/isGameRun"]
    }
  },
  update() {
    console.log('update')
    if (this.isGameRun) {
      this.redirect()
    }
  },
  beforeUpdate() {
    console.log(this.isGameRun)
    if (this.isGameRun) {
      console.log(this.isGameRun)
      this.redirect()
    }
  },
  methods: {
    ...mapActions({
      setUserTeam: 'socket/setUserTeam'
    }),
    setUserTeam(obj) {
      this.$socket.emit('setUserTeam', obj, dataFromServer =>{
        console.log(dataFromServer)
      })
    },
    getId(){
      this.$socket.emit('getIdUser', this.currentUser, dataFromServer => {
        console.log(this.currentUser)
        console.log(dataFromServer)
      })
    },
    startGame() {
      if (this.currentUser.players === this.allUsers.length) {
        this.$socket.emit('startGame', this.currentUser, dataFromServer => {
          console.log(dataFromServer)
        })
      } else {
        this.message = `You need ${this.currentUser.players} players to start game. But now only ${this.allUsers.length}`
      }
    },
    redirect(){
      this.$router.push('/go/game')
    }
  },
  sockets: {
    connect: function () {
      console.log('socket connected')
    }
  },
}
</script>

<style lang="scss" scoped>
.user {
  width: 44%;
}
.black {
  background: $dark;
  color: $grey-1;
}
.white {
  background: $grey-1;
  color: $dark;
}
</style>
