<template>
  <q-page class="">
    <div
      id="particles-js"
      :class="$q.dark.isActive ? 'dark_gradient' : 'normal_gradient'"
    ></div>
    <q-btn
      v-if="currentRoutePath !== '/'"
      class="btnHome bg-warning absolute-top-left"
      label="Home"
      @click="confirm = true"
    />
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
  name: "forGame",
  data() {
    return {
      confirm: false,
    }
  },
  methods: {
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
      location.reload()
    },
  },
  computed:{
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
