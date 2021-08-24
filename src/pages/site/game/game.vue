<template>
  <q-page padding>
    <h1>Страница игры!</h1>
    <p
      v-for="(word, i) in this.$store.getters['socket/FOUR_GAME_WORDS']"
      :key="i"
    >{{word}}</p>

    <q-btn color="orange" :label="'Start ' + roundNumber + ' Round'" @click="startRound" />

  </q-page>
</template>

<script>
export default {
  name: "game",
  computed: {
    currentUser() {
      return this.$store.getters["socket/user"]
    },
    roundNumber() {
      return 1
    },
    allUsers() {
      return this.$store.getters["socket/users"]
    },
  },
  created() {
    this.$socket.emit('joinToGameStart', this.currentUser, dataFromServer => {
      console.log(dataFromServer)
    })
  },
  methods: {
    startRound() {
      this.$socket.emit('startRound', this.allUsers, dataFromServer => {
        console.log(dataFromServer)
      })
    },
  }
}
</script>

<style scoped>

</style>
