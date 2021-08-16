<template>
  <q-page padding>
    <h1>joinToGame</h1>
    <q-input class="q-mb-md" filled v-model="nickname" label="Nickname" dense />
    <q-input class="q-mb-md" filled v-model="room" label="Room number" dense />
    <q-btn label="play"  />
  </q-page>
</template>

<script>
export default {
  name: "joinToGame",
  data() {
    return {
      nickname: '',
      room: '',
    }
  }
}
</script>

<style scoped>

</style>
