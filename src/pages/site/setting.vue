<template>
  <div class="row justify-center">
    <q-card
      class="login-form"
      :style="$q.platform.is.mobile ? { width: '60%' } : { width: '50%' }"
    >
      <div class="row no-wrap items-center">
        <q-btn
          icon="fas fa-arrow-left"
          to="/"
        />
        <div class="col text-h6 ellipsis text-center">
          {{ $t('btn.setting') }}
        </div>
      </div>
      <div class="flex justify-center column">
        <q-btn
          :label="$q.dark.isActive ? 'nights theme' : 'day theme'"
          :text-color="$q.dark.isActive ? 'white' : 'black'"
          color="grey-6"
          @click="$q.dark.toggle()"
          :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'"
        />
        <div style="border-radius: 10px" class="bg-warning">
          <q-select @input="changedLang(lang)" filled v-model="lang" :options="options" />
        </div>
        <div style="border-radius: 10px" class="bg-green-3">
          <q-select @input="changedDictionary(dictionary)" filled v-model="dictionary" :options="optionsForDictionary" />
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "setting",
  data () {
    return {
      notifications: [],
      lang: this.$store.getters["header/getLang"],
      options: [
        'en-us',
        'ru',
      ],
      dictionary: this.$store.getters['socket/dictionary'],
      optionsForDictionary: [
        'classic',
        'bible',
      ],
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
      this.$store.dispatch('header/setLang', val)
    },
    changedDictionary(val) {
      this.$store.dispatch('socket/setDictionary', val)
    },
  },
}
</script>

<style scoped>
.login-form {
  position: absolute;
  max-width: 500px;
  top: calc(50% - 250px)
}
</style>
