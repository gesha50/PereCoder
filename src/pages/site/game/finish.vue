<template>
<q-page padding>
  <h6>finish</h6>
  <div>{{whoIsWinner}}</div>
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
}
</script>

<style scoped>

</style>
