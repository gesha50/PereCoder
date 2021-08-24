<template>
  <q-page padding>
    <q-btn label="message" @click="newMes" />
    <q-btn label="new game" to="/new" />
    <q-btn label="join to game" to="join" />
    <q-btn label="setting" to="/setting" />
    <q-btn label="rules" to="rules" />
  </q-page>
</template>

<script>

export default {
  name: "index",
  data() {
    return {
      // counter: this.$q.localStorage.getItem('counter'),
    }
  },
  methods: {
    newMes() {
      // console.log(this.$socket)
      this.$socket.emit('createMessage', {
        text: 'from client'
      }, dataFromServer => {
        console.log(dataFromServer)
      })
    }
  },
}
</script>

<style lang="scss">

</style>
