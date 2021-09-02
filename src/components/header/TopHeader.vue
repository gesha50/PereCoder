<template>
  <q-header reveal :reveal-offset="10" elevated class="text-black container" height-hint="98">
    <q-toolbar>
      <q-btn class="mobile_only"  @click="$emit('drawer')" color="white" text-color="primary" round icon="menu" />
      <q-avatar class="q-mx-md q-my-sm">
        <img src="../../statics/logo.png">
      </q-avatar>
      <q-space></q-space>
      <q-btn
        class="q-mx-lg"
        label="Home"
        @click="goHome"
      />
      <q-select  @input="changedLang(lang)" filled v-model="lang" :options="options" />
    </q-toolbar>
  </q-header>
</template>

<script>
export default {
  name: "TopHeader",
  data() {
    return {
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
