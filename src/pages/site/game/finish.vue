<template>
<q-page class="flex flex-center">
  <Particles
    id="tsparticles"
    :particlesInit="particlesInit"
    :particlesLoaded="particlesLoaded"
    :options="finishScreen"
  />
  <q-card
    class="login-form"
    :style="$q.platform.is.mobile ? { width: '60%' } : { width: '40%' }"
  >
    <div class="no-wrap items-center">
      <div class="col text-h6 ellipsis text-center">
        END GAME
      </div>
    </div>
    <q-card-section class="column">
      <div> Win:  {{whoIsWinner}}</div>
      <q-btn
        label=Home
        @click=goHome
      />
    </q-card-section>
  </q-card>
</q-page>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'finish',
  computed: {
    ...mapGetters({
      finishScreen: 'style/finishScreen',
    }),
    whoIsWinner() {
      return this.$store.getters['socket/whoIsWinner']
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

<style lang=scss>
#tsparticles {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
}
</style>
