<template>
  <q-page padding>
    <q-btn label="message" @click="newMes" />
    <q-btn label="new game" to="/new" />
    <q-btn label="join to game" to="join" />
    <q-btn label="setting" to="/setting" />
    <q-btn label="rules" to="rules" />
    <div class="q-pa-md row justify-center">
    </div>
  </q-page>
</template>

<script>

export default {
  name: "index",
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
