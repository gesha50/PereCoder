<template>
  <div class="row justify-center">
    <q-card
      class="login-form  q-mt-xl"
      :style="$q.platform.is.mobile ? { width: '60%' } : { width: '50%' }"
    >
      <div class="row no-wrap items-center">
        <div class="col text-h6 ellipsis text-center">
          Game rules
        </div>
      </div>
      <q-card-section class="column">
        Game rules
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "rules"
}
</script>

<style lang="scss">
.login-form {
  position: absolute;
  max-width: 500px;
  top: calc(50% - 250px)
}
</style>
