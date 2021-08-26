<template>
  <q-page padding>
    <h4>Страница игры!</h4>
    <div>Your team: {{currentUser.team}}</div>
    <p
      v-for="(word, i) in this.$store.getters['socket/FOUR_GAME_WORDS']"
      :key="i"
    >{{word}}</p>
    <div v-if="step === 0">
        <q-btn :disable="isBtnActive" color="orange" :label="'Start ' + roundNumber + ' Round'" @click="startRound" />
      {{gameMessage}}
    </div>
    <div v-else-if="step === 1">
      <div v-if="secretCode.length" class="bg-blue-grey-2" >
        !!! Secret code:
        <p class="inline-block" v-for="(num,i) in secretCode" :key="i">{{num}}</p>

        <div class="q-pa-md" style="max-width: 400px">

          <q-form
            @submit="onSubmit"
            @reset="onReset"
            class="q-gutter-md"
          >
            <q-input
              :disable="isBtnActive"
              filled
              v-model="firstWord"
              label="first association"
              hint="use secret code numbers!!!"
            />
            <q-input
              :disable="isBtnActive"
              filled
              v-model="secondWord"
              label="second association"
            />
            <q-input
              :disable="isBtnActive"
              filled
              v-model="thirdWord"
              label="third association"
            />

            <div>
              <q-btn :disable="isBtnActive" label="Submit" type="submit" color="primary"/>
              <q-btn :disable="isBtnActive" label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
              <p v-if="isBtnActive">{{gameMessage}}</p>
            </div>
          </q-form>

        </div>

      </div>
      <div v-else>
        <p>{{gameMessage}}</p>
      </div>
    </div>
    <div v-else-if="step === 2" class="bg-orange">
      <div class="flex justify-between">
        <div>White team association:</div>
        <div v-if="currentUser.team === 'white'"> It`s your team association! You should to guess this! </div>
        <div v-else>If you guess this It`s very cool!!!</div>
      </div>
      <pre class="inline-block" v-for="(assoc, i) in threeWhiteAssociation" :key="i">{{assoc+' | '}}</pre>
      <q-form
        @submit="sendTryToGuessSecretCode"
        @reset="onReset2"
        class="q-gutter-md"
      >
        <q-input
          :disable="(currentUser.isActive && currentUser.team === 'white') || isBtnActive"
          @input="updateValue1($event)"
          class="inline-block"
          filled
          style="max-width: 70px"
          type="number"
          :value="firstNumber"
        />
        <q-input
          :disable="(currentUser.isActive && currentUser.team === 'white') || isBtnActive"
          @input="updateValue2($event)"
          class="inline-block"
          filled
          style="max-width: 70px"
          type="number"
          :value="secondNumber"
        />
        <q-input
          :disable="(currentUser.isActive && currentUser.team === 'white') || isBtnActive"
          @input="updateValue3($event)"
          class="inline-block"
          filled
          style="max-width: 70px"
          type="number"
          :value="thirdNumber"
        />
        <div>
          <q-btn
            :disable="(currentUser.isActive && currentUser.team === 'white') || isBtnActive"
            label="Submit" type="submit" color="primary"/>
          <q-btn
            :disable="(currentUser.isActive && currentUser.team === 'white') || isBtnActive"
            label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
          <p v-if="isBtnActive">{{gameMessage}}</p>
        </div>
      </q-form>
    </div>
    <div v-else-if="step === 3">
      <div>
        <p>White team:</p>
        <p v-if="isTryWhiteToGuessCorrect === 'true'"> correct </p>
        <p v-else> mistake!!! </p>
      </div>
      <div>
        <p>Black team:</p>
        <p v-if="isTryBlackToGuessCorrect  === 'true'"> Bravo correct !! </p>
        <p v-else> mistake </p>
      </div>
    </div>
    <div v-else-if="step === 4">
      like step 2
    </div>
    <div v-else-if="step === 5">
      like step 3
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
    console.log(this.threeWhiteAssociation)
  },
  computed: {
    isBtnActive() {
      if (this.isTeamReady) {
        return true
      }
      return false
    },
    isTryWhiteToGuessCorrect () {
      return this.$store.getters["socket/isTryWhiteToGuessCorrect"]
    },
    isTryBlackToGuessCorrect () {
      return this.$store.getters["socket/isTryBlackToGuessCorrect"]
    },
    firstNumber () {
      return this.$store.getters["socket/firstNumber"]
    },
    secondNumber () {
      return this.$store.getters["socket/secondNumber"]
    },
    thirdNumber () {
      return this.$store.getters["socket/thirdNumber"]
    },
    threeWhiteAssociation () {
      return this.$store.getters["socket/threeWhiteAssociation"]
    },
    threeBlackAssociation () {
      return this.$store.getters["socket/threeBlackAssociation"]
    },
    isTeamReady() {
      return this.$store.getters["socket/isTeamReady"]
    },
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
      this.$socket.emit('startRound', [this.allUsers, this.currentUser], dataFromServer => {
        console.log(dataFromServer)
      })
    },
    onSubmit () {
      this.$socket.emit('readyThreeWords',
        [[this.firstWord,this.secondWord,this.thirdWord], this.currentUser],
        dataFromServer => {
          console.log(dataFromServer)
        })
    },
    onReset () {
      this.firstWord = null
      this.secondWord = null
      this.thirdWord = null
    },
    sendTryToGuessSecretCode() {
      this.$socket.emit('tryToGuessSecretCode',
        [[Number(this.firstNumber),Number(this.secondNumber),Number(this.thirdNumber)], this.currentUser],
        dataFromServer => {
          console.log(dataFromServer)
        })
    },
    onReset2 () {
      this.$store.dispatch('socket/resetNumbers')
    },
    updateValue1(val) {
      this.$socket.emit('changeNumberOne', [val, this.currentUser], dataFromServer => {
        console.log(dataFromServer)
      })
    },
    updateValue2(val) {
      this.$socket.emit('changeNumberTwo', [val, this.currentUser], dataFromServer => {
        console.log(dataFromServer)
      })
    },
    updateValue3(val) {
      this.$socket.emit('changeNumberThree', [val, this.currentUser], dataFromServer => {
        console.log(dataFromServer)
      })
    },
  }
}
</script>

<style scoped>

</style>
