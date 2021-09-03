<template>
  <q-header reveal :reveal-offset="10" elevated class="text-black container" height-hint="98">
    <q-toolbar>
      <q-btn class="mobile_only"  @click="$emit('drawer')" color="white" text-color="primary" round icon="menu" />
      <q-avatar class="q-mx-md q-my-sm">
        <img src="../../statics/logo.png">
      </q-avatar>
      <q-space></q-space>
      <q-btn
        v-if="currentRoutePath !== '/'"
        class="q-mx-lg"
        label="Home"
        @click="confirm = true"
      />
      <q-select  @input="changedLang(lang)" filled v-model="lang" :options="options" />
    </q-toolbar>
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="red" text-color="white" />
          <span class="q-ml-sm">You are really go out from game?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Go Home" color="red" v-close-popup @click="goHome" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-header>
</template>

<script>
export default {
  name: "TopHeader",
  data() {
    return {
      confirm: false,
      tab: '',
      lang: this.$store.getters["header/getLang"],
      options: [
        'en-us',
        'ru',
      ]
    }
  },
  created() {
    this.$i18n.locale = this.lang
  },
  updated() {
    this.$i18n.locale = this.lang
  },
  computed: {
    currentRoutePath() {
      return this.$route.path;
    }
  },
  methods: {
    changedLang(val) {
      console.log(val)
      this.$store.dispatch('header/setLang', val)
    },
    goHome() {
      this.$store.dispatch('socket/allDataNull')
      this.$router.push('/')
    },
  },
}
</script>

<style lang="scss">
.q-header {
  background: rgba(255, 255, 255, 1) !important;
}
.q-tab__label {
  font-family: 'RedHatDisplay-Black';
}
.self-stretch {
  align-self: center;
}
</style>
