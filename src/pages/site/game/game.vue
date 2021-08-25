<template>
  <q-page padding>
    <h1>Страница игры!</h1>
    <p
      v-for="(word, i) in this.$store.getters['socket/FOUR_GAME_WORDS']"
      :key="i"
    >{{word}}</p>
    <div>
      <div v-if="secretCode.length" class="bg-blue-grey-2" >
        code:
        <p class="inline-block" v-for="(num,i) in secretCode" :key="i">{{num}}</p>

        <div class="q-pa-md" style="max-width: 400px">

          <q-form
            @submit="onSubmit"
            @reset="onReset"
            class="q-gutter-md"
          >
            <q-input
              filled
              v-model="firstWord"
              label="first association"
              hint="use secret code numbers!!!"
            />
            <q-input
              filled
              v-model="secondWord"
              label="second association"
            />
            <q-input
              filled
              v-model="thirdWord"
              label="third association"
            />

            <div>
              <q-btn label="Submit" type="submit" color="primary"/>
              <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
          </q-form>

        </div>

      </div>
      <div v-else>
        <p>{{gameMessage}}</p>
      </div>
    </div>
    <div v-if="step === 0">
      <q-btn color="orange" :label="'Start ' + roundNumber + ' Round'" @click="startRound" />
    </div>
  </q-page>
</template>

<script>
export default {
  name: "game",
  data() {
    return {
      firstWord: null,
      secondWord: null,
      thirdWord: null,
      isPlayer: false,
      isActive: this.$store.state.socket.user.isActive
    }
  },
  updated() {
    console.log('updated')
  },
  computed: {
    step() {
      return this.$store.getters["socket/step"]
    },
    gameMessage() {
      return this.$store.getters["socket/gameMessage"]
    },
    secretCode() {
      return this.$store.getters["socket/threeNumbers"]
    },
    currentUser() {
      return this.$store.getters["socket/user"]
    },
    roundNumber() {
      return 1
    },
    allUsers() {
      return this.$store.getters["socket/users"]
    },
  },
  created() {
    this.$socket.emit('joinToGameStart', this.currentUser, dataFromServer => {
      console.log(dataFromServer)
    })
  },
  methods: {
    startRound() {
      this.$socket.emit('startRound', this.allUsers, dataFromServer => {
        console.log(dataFromServer)
        this.message = dataFromServer
      })
    },
    onSubmit () {
      this.$socket.emit('readyThreeWords', [this.firstWord,this.secondWord,this.thirdWord], dataFromServer => {
        console.log(dataFromServer)
      })
    },
    onReset () {
      this.firstWord = null
      this.secondWord = null
      this.thirdWord = null
    }
  }
}
</script>

<style scoped>

</style>
