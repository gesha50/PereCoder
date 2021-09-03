<template>
  <q-page padding>
    <h1>registerGame</h1>
    <p>{{isGame}}</p>
    <p>капитан распределяет игроков на команды</p>
    <q-card
      class="bg-light-blue-3 q-mb-md"
      v-for="(user, i) in allUsers"
      :key="i"
    >
      {{i+1}}
      <p>{{user.name}}</p>
      <p>{{user.id}}</p>
      <p>Your team: {{user.team}}</p>
      <q-btn label="white" color="white" text-color="black" @click="setUserTeam({team: 'white', user: user, i})" />
      <q-btn label="black" color="black" @click="setUserTeam({team: 'black', user: user, i})" />
    </q-card>
    <q-btn v-if="currentUser.isOrganizer" label="start game!" color="green" @click="startGame" />
    <p v-if="message">{{message}}</p>

    <q-btn color="red" label="who are you?" @click="getId" />

  </q-page>
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
    isGame() {
      return this.$store.getters["socket/isGameRun"]
    }
  },
  beforeUpdate() {
    if (this.isGame) {
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
      this.$router.push('/game')
    }
  },
  sockets: {
    connect: function () {
      console.log('socket connected')
    }
  },
}
</script>

<style scoped>

</style>
