<template>
  <q-card
    class="login-form"
    :style="$q.platform.is.mobile ? { width: '60%' } : { width: '50%' }"
  >
    <div class="row no-wrap items-center">
      <div class="col text-h6 ellipsis text-center">
        Setting
      </div>
    </div>
    <q-card-section class="column">
      Game rules
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "rules"
}
</script>

<style scoped>

</style>
