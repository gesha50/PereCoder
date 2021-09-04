<template>
  <q-page class="flex flex-center">
    <Particles
      :class="$q.dark.isActive ? 'dark_gradient' : 'normal_gradient'"
      id="particles-js"
      :options="getStyle"
    />
    <q-btn
      color="white"
      class="absolute-top-right"
      flat
      round
      @click="$q.dark.toggle()"
      :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'"
    />
    <q-btn
      v-if="currentRoutePath !== '/'"
      class="q-mx-lg absolute-bottom-left"
      label="Home"
      @click="confirm = true"
    />
    <div class="absolute-top-left">
        <q-select @input="changedLang(lang)" filled v-model="lang" :options="options" />
    </div>
    <router-view></router-view>
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
  </q-page>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      confirm: false,
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
      this.$store.dispatch('header/setLang', val)
    },
    newMes() {
      // console.log(this.$socket)
      this.$socket.emit('createMessage', {
        text: 'from client'
      }, dataFromServer => {
        console.log(dataFromServer)
      })
    },
    goHome() {
      this.$store.dispatch('socket/allDataNull')
      this.$router.push('/')
    },
  },
  computed:{
    getStyle() {
      return this.$store.getters['style/getStyle']
    },
    currentRoutePath() {
      return this.$route.path;
    }
  },
}
</script>

<style lang="scss">
#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
}
.normal_gradient {
  background: linear-gradient(145deg, rgb(74, 94, 137) 15%, #b61924 70%);
}
.dark_gradient {
  background: linear-gradient(145deg, rgb(11, 26, 61) 15%, #4c1014 70%);
}
</style>
