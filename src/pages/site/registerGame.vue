<template>
  <q-page padding>
    <h1>registerGame</h1>
    <p>капитан распределяет игроков на команды</p>
    <q-card
      class="bg-light-blue-3 q-mb-md"
      v-for="(user, i) in this.$store.getters['socket/users']"
      :key="i"
    >
      {{i+1}}
      <p>{{user.name}}</p>
      <p>Your team: {{user.team}}</p>
      <q-btn label="white" color="white" text-color="black" @click="setUserTeam({team: 'white', key: user.id})" />
      <q-btn label="black" color="black" @click="setUserTeam({team: 'black', key: user.id})" />
    </q-card>
    <q-btn label="start game!" color="green" />

    <q-btn color="red" label="who are you?" @click="getId" />

  </q-page>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "registerGame",
  data() {
    return {
      color: 'white'
    }
  },
  methods: {
    // ...mapActions({
    //   setUserTeam: 'socket/setUserTeam'
    // }),
    setUserTeam(obj) {
      this.$socket.emit('setUserTeam', obj, cb =>{})
    },
    getId(){
      this.$socket.emit('getIdUser', '', dataFromServer => {
        console.log(dataFromServer)
      })
    }
  },
}
</script>

<style scoped>

</style>
