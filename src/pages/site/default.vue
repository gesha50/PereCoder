<template>
  <div class="row justify-center">
    <q-card
      class="login-form"
      :style="$q.platform.is.mobile ? { width: '60%' } : { width: '80%' }"
    >
      <q-img src="/statics/images/label_1.jpg"></q-img>

        <div class="no-wrap items-center">
          <div class="col text-h6 ellipsis text-center">
            {{$t('index.welcome')}}
          </div>
        </div>
      <q-card-section class="column">
        <q-btn color="purple" class="q-my-sm" :label="$t('btn.newGame')" to="/new" />
        <q-btn color="deep-orange" class="q-my-sm" :label="$t('btn.joinToGame')" to="join" />
        <q-btn color="brown-5" class="q-my-sm" :label="$t('btn.setting')" to="/setting" />
        <q-btn color="secondary" class="q-my-sm" :label="$t('btn.rules')" to="rules" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "default"
}
</script>

<style lang="scss" scoped>
.login-form {
  position: absolute;
  max-width: 500px;
  top: calc(50% - 250px)
}
</style>
