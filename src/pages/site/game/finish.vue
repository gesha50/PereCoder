<template>
<q-page padding>
  <h6>finish</h6>
  <div> Win:  {{whoIsWinner}}</div>
  <q-btn
    label="Home"
    @click="goHome"
  />
</q-page>
</template>

<script>
export default {
  name: "finish",
  computed: {
    whoIsWinner() {
      return this.$store.getters["socket/whoIsWinner"]
    },
  },
  methods: {
    goHome() {
      this.$store.dispatch('socket/allDataNull')
      this.$router.push('/')
    },
  },
}
</script>

<style scoped>

</style>
