<template>
  <div>
    <div class="row justify-between no-wrap">
      <div class="q-card bg-white q-ma-lg q-pa-sm">Your team: {{currentUser.team}}
        <div>name: {{currentUser.name}}</div>
        <div v-if="step > 0" >Round # {{roundNumber}}</div>
        <div v-if="currentUser.team === 'white'">
          <div>
            <div v-if="whiteCounterHindrance===1">
              <p class="bg-dark">x</p>
            </div>
            <div v-else-if="whiteCounterHindrance===2">
              <p class="bg-dark">x</p>
              <p class="bg-dark">x</p>
            </div>
            <div v-else></div>
          </div>
          <div>
            <div v-if="whiteCounterInterception===1">
              <p class="bg-yellow-1">v</p>
            </div>
            <div v-if="whiteCounterInterception===2">
              <p class="bg-yellow-1">v</p>
              <p class="bg-yellow-1">v</p>
            </div>
            <div v-else></div>
          </div>
        </div>
        <div v-else>
          <div>
            <div v-if="blackCounterHindrance===1">
              <p class="bg-dark">x</p>
            </div>
            <div v-else-if="blackCounterHindrance===2">
              <p class="bg-dark">x</p>
              <p class="bg-dark">x</p>
            </div>
            <div v-else></div>
          </div>
          <div>
            <div v-if="blackCounterInterception===1">
              <p class="bg-yellow-1">v</p>
            </div>
            <div v-if="blackCounterInterception===2">
              <p class="bg-yellow-1">v</p>
              <p class="bg-yellow-1">v</p>
            </div>
            <div v-else></div>
          </div>
        </div>
      </div>
      <div class="fourGameWords q-card bg-red-12 q-mt-lg row items-center justify-around no-wrap">
        <div
          class="inline-block bg-purple-6 q-pa-lg q-ma-lg text-subtitle1 text-weight-bold"
          v-for="(word, i) in FOUR_GAME_WORDS"
          :key="i"
        >{{word}}</div>
      </div>
      <div class="q-card bg-white q-ma-lg q-pa-sm">
        opponent teem
      </div>
    </div>

    <div class="q-mt-xl flex justify-center" v-if="step === 0">
        <q-btn
          :disable="isBtnActive"
          color="orange"
          :label="'Start ' + (roundNumber+1) + ' Round'"
          @click="startRound"
        />
      {{gameMessage}}
    </div>
    <div v-else-if="step === 1">
      <div v-if="currentUser.isActive" class="bg-blue-grey-2" >
        !!! Secret code:
        <p class="inline-block" v-for="(num,i) in secretCode" :key="i">{{num}}</p>
        <div class="q-pa-md" style="max-width: 400px">
          <q-form
            @submit="onSubmit"
            @reset="onReset"
            class="q-gutter-md"
          >
            <div v-if="currentUser.team === 'white'">
              <q-input
                :disable="isBtnActive"
                filled
                v-model="firstWord"
                label="first association"
                hint="use secret code numbers!!!"
                :rules="[val => !!val || 'Field is required',
                      val=> FOUR_GAME_WORDS.indexOf(val) === -1 || 'This is one of main game word!',
                      val => associationsForWhiteSecretWords[secretCode[0]-1].indexOf(val)  === -1 ||
                       'You have the same association for this word']"
              />
              <q-input
                :disable="isBtnActive"
                filled
                v-model="secondWord"
                label="second association"
                :rules="[val => !!val || 'Field is required',
                        val=> FOUR_GAME_WORDS.indexOf(val) === -1 || 'This is one of main game word!',
                       val => associationsForWhiteSecretWords[secretCode[1]-1].indexOf(val) === -1 ||
                       'You have the same association for this word']"
              />
              <q-input
                :disable="isBtnActive"
                filled
                v-model="thirdWord"
                label="third association"
                :rules="[val => !!val || 'Field is required',
                      val=> FOUR_GAME_WORDS.indexOf(val) === -1 || 'This is one of main game word!',
                      val => associationsForWhiteSecretWords[secretCode[2]-1].indexOf(val) === -1 ||
                       'You have the same association for this word']"
              />
            </div>
            <div v-else>
              <q-input
                :disable="isBtnActive"
                filled
                v-model="firstWord"
                label="first association"
                hint="use secret code numbers!!!"
                :rules="[val => !!val || 'Field is required',
                      val=> FOUR_GAME_WORDS.indexOf(val) === -1 || 'This is one of main game word!',
                      val => associationsForBlackSecretWords[secretCode[0]-1].indexOf(val) === -1 ||
                       'You have the same association for this word']"
              />
              <q-input
                :disable="isBtnActive"
                filled
                v-model="secondWord"
                label="second association"
                :rules="[val => !!val || 'Field is required',
                        val=> FOUR_GAME_WORDS.indexOf(val) === -1 || 'This is one of main game word!',
                       val => associationsForBlackSecretWords[secretCode[1]-1].indexOf(val) === -1 ||
                       'You have the same association for this word']"
              />
              <q-input
                :disable="isBtnActive"
                filled
                v-model="thirdWord"
                label="third association"
                :rules="[val => !!val || 'Field is required',
                      val=> FOUR_GAME_WORDS.indexOf(val) === -1 || 'This is one of main game word!',
                      val => associationsForBlackSecretWords[secretCode[2]-1].indexOf(val) === -1 ||
                       'You have the same association for this word']"
              />
            </div>
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
        @reset="onReset2(currentUser.team)"
        class="q-gutter-md"
      >
        <div class="q-gutter-md row justify-center" v-if="currentUser.team === 'white'">
          <div>
            <q-input
              :disable="currentUser.isActive || isBtnActive"
              @input="updateValue1($event)"
              class="inline-block"
              filled
              style="max-width: 150px"
              type="number"
              :value="firstNumberWhite"
              lazy-rules
              :rules="[
               val => !!val || '* Required',
                val => val.length < 2 || 'Please use maximum 1 character',
                val => val > 0 && val < 5 || 'Please type a real number'
            ]"
            />
          </div>
          <div>
            <q-input
              :disable="currentUser.isActive || isBtnActive"
              @input="updateValue2($event)"
              class="inline-block"
              filled
              style="max-width: 150px"
              type="number"
              :value="secondNumberWhite"
              lazy-rules
              :rules="[
               val => !!val || '* Required',
                val => val.length < 2 || 'Please use maximum 1 character',
                val => val > 0 && val < 5 || 'Please type a real number'
            ]"
            />
          </div>
          <div>
            <q-input
              :disable="currentUser.isActive || isBtnActive"
              @input="updateValue3($event)"
              class="inline-block"
              filled
              style="max-width: 150px"
              type="number"
              :value="thirdNumberWhite"
              lazy-rules
              :rules="[
               val => !!val || '* Required',
                val => val.length < 2 || 'Please use maximum 1 character',
                val => val > 0 && val < 5 || 'Please type a real number'
            ]"
            />
          </div>
        </div>
        <div class="q-gutter-md row justify-center" v-else>
          <div>
            <q-input
            :disable="isBtnActive"
            @input="updateValue1($event)"
            class="inline-block"
            filled
            style="max-width: 150px"
            type="number"
            :value="firstNumberBlack"
            lazy-rules
            :rules="[
               val => !!val || '* Required',
                val => val.length < 2 || 'Please use maximum 1 character',
                val => val > 0 && val < 5 || 'Please type a real number'
            ]"
          />
          </div>
          <div>
            <q-input
              :disable="isBtnActive"
              @input="updateValue2($event)"
              class="inline-block"
              filled
              style="max-width: 150px"
              type="number"
              :value="secondNumberBlack"
              lazy-rules
              :rules="[
               val => !!val || '* Required',
                val => val.length < 2 || 'Please use maximum 1 character',
                val => val > 0 && val < 5 || 'Please type a real number'
            ]"
            />
          </div>
          <div>
            <q-input
              :disable="isBtnActive"
              @input="updateValue3($event)"
              class="inline-block"
              filled
              style="max-width: 150px"
              type="number"
              :value="thirdNumberBlack"
              lazy-rules
              :rules="[
               val => !!val || '* Required',
                val => val.length < 2 || 'Please use maximum 1 character',
                val => val > 0 && val < 5 || 'Please type a real number'
            ]"
            />
          </div>
        </div>
        <div>
          <q-btn
            :disable="(currentUser.isActive && currentUser.team === 'white') || isBtnActive || notSameNumbers"
            label="Submit" type="submit" color="primary"/>
          <q-btn
            :disable="(currentUser.isActive && currentUser.team === 'white') || isBtnActive"
            label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
          <p v-if="isBtnActive">{{gameMessage}}</p>
          <p v-if="disableMessageForSameNumbers">{{disableMessageForSameNumbers}}</p>
        </div>
      </q-form>
    </div>
    <div v-else-if="step === 3">
     <div class="bg-secondary">
       <div>
         <div>White team try this secret code:
           <p   >{{firstNumberWhite +' '+ secondNumberWhite +' '+thirdNumberWhite }}</p>
         </div>
         <p v-if="isTryWhiteToGuessCorrect === 'true'"> correct! no counter for White team </p>
         <div v-else> mistake!!!  your get counter hindrance <div class="bg-dark">x</div></div>
       </div>
       <div>
         <div>Black team try this secret code:
           <p   >{{firstNumberBlack +' '+ secondNumberBlack +' '+thirdNumberBlack }}</p>
         </div>
         <div v-if="isTryBlackToGuessCorrect  === 'true'">
           Bravo correct !! your get counter interception!
           <div class="bg-yellow-1">v</div>
         </div>
         <p v-else> mistake! no counter for Black team </p>
       </div>
       <div class="bg-red text-weight-bold text-h6">
         correct secret code team white:
         {{correctFirstNumber +' '+ correctSecondNumber + ' '+ correctThirdNumber }}
       </div>
     </div>
      <q-btn
        @click="nextThreeWords"
        :disable="isBtnActive"
        label="Next"
        color="primary"
      />
      <p v-if="isBtnActive">{{gameMessage}}</p>
    </div>
    <div v-else-if="step === 4" class="bg-orange">
      <div class="flex justify-between">
        <div>Black team association:</div>
        <div v-if="currentUser.team === 'black'"> It`s your team association! You should to guess this! </div>
        <div v-else>If you guess this It`s very cool!!!</div>
      </div>
      <pre class="inline-block" v-for="(assoc, i) in threeBlackAssociation" :key="i">{{assoc+' | '}}</pre>
      <q-form
        @submit="sendTryToGuessSecretCode2"
        @reset="onReset2(currentUser.team)"
        class="q-gutter-md"
      >
        <div class="q-gutter-md row justify-center" v-if="currentUser.team === 'white'">
          <div>
            <q-input
              :disable="isBtnActive"
              @input="updateValue1($event)"
              class="inline-block"
              filled
              style="max-width: 150px"
              type="number"
              :value="firstNumberWhite"
              lazy-rules
              :rules="[
               val => !!val || '* Required',
                val => val.length < 2 || 'Please use maximum 1 character',
                val => val > 0 && val < 5 || 'Please type a real number'
            ]"
            />
          </div>
          <div>
            <q-input
              :disable="isBtnActive"
              @input="updateValue2($event)"
              class="inline-block"
              filled
              style="max-width: 150px"
              type="number"
              :value="secondNumberWhite"
              lazy-rules
              :rules="[
               val => !!val || '* Required',
                val => val.length < 2 || 'Please use maximum 1 character',
                val => val > 0 && val < 5 || 'Please type a real number'
            ]"
            />
          </div>
          <div>
            <q-input
              :disable="isBtnActive"
              @input="updateValue3($event)"
              class="inline-block"
              filled
              style="max-width: 150px"
              type="number"
              :value="thirdNumberWhite"
              lazy-rules
              :rules="[
               val => !!val || '* Required',
                val => val.length < 2 || 'Please use maximum 1 character',
                val => val > 0 && val < 5 || 'Please type a real number'
            ]"
            />
          </div>
        </div>
        <div class="q-gutter-md row justify-center" v-else>
          <div>
            <q-input
              :disable="currentUser.isActive || isBtnActive"
              @input="updateValue1($event)"
              class="inline-block"
              filled
              style="max-width: 150px"
              type="number"
              :value="firstNumberBlack"
              lazy-rules
              :rules="[
               val => !!val || '* Required',
                val => val.length < 2 || 'Please use maximum 1 character',
                val => val > 0 && val < 5 || 'Please type a real number'
            ]"
            />
          </div>
          <div>
            <q-input
              :disable="currentUser.isActive || isBtnActive"
              @input="updateValue2($event)"
              class="inline-block"
              filled
              style="max-width: 150px"
              type="number"
              :value="secondNumberBlack"
              lazy-rules
              :rules="[
               val => !!val || '* Required',
                val => val.length < 2 || 'Please use maximum 1 character',
                val => val > 0 && val < 5 || 'Please type a real number'
            ]"
            />
          </div>
          <div>
            <q-input
              :disable="currentUser.isActive || isBtnActive"
              @input="updateValue3($event)"
              class="inline-block"
              filled
              style="max-width: 150px"
              type="number"
              :value="thirdNumberBlack"
              lazy-rules
              :rules="[
               val => !!val || '* Required',
                val => val.length < 2 || 'Please use maximum 1 character',
                val => val > 0 && val < 5 || 'Please type a real number'
            ]"
            />
          </div>
        </div>
        <div>
          <q-btn
            :disable="(currentUser.isActive && currentUser.team === 'black') || isBtnActive || notSameNumbers"
            label="Submit" type="submit" color="primary"/>
          <q-btn
            :disable="(currentUser.isActive && currentUser.team === 'black') || isBtnActive"
            label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
          <p v-if="isBtnActive">{{gameMessage}}</p>
          <p v-if="disableMessageForSameNumbers">{{disableMessageForSameNumbers}}</p>
        </div>
      </q-form>
    </div>
    <div v-else-if="step === 5">
      <div class="bg-secondary">
        <div>
          <div>White team try this secret code:
            <p   >{{firstNumberWhite +' '+ secondNumberWhite +' '+thirdNumberWhite }}</p>
          </div>
          <div v-if="isTryWhiteToGuessCorrect === 'true'">
            Bravo correct !! your get counter interception!
          <div class="bg-yellow-1">v</div>
          </div>
          <div v-else> mistake! no counter for WHITE team </div>
        </div>
        <div>
          <div>Black team try this secret code:
            <p>{{firstNumberBlack +' '+ secondNumberBlack +' '+thirdNumberBlack }}</p>
          </div>
          <div v-if="isTryBlackToGuessCorrect  === 'true'">
            Correct! no counter for White team
          </div>
          <div v-else>
            mistake!!!  your get counter hindrance
            <div class="bg-dark">x</div>
          </div>
        </div>
        <div class="bg-red text-weight-bold text-h6">
          correct secret code team white:
          {{correctFirstNumber +' '+ correctSecondNumber + ' '+ correctThirdNumber }}
        </div>
      </div>
      <q-btn
        @click="finishAndStartRound"
        :disable="isBtnActive"
        label="Next Round"
        color="primary"
      />
      <p v-if="isBtnActive">{{gameMessage}}</p>
    </div>
    <div v-else-if="isGameFinish">
      {{isGameFinish}}
    </div>
    <div class="row justify-between">
      <div>
        <div class="row justify-start" v-for="(obj,i) in listGameWhiteSide" :key="i">
          white
        <div class="q-px-md">
          <div v-for="(word, ind1) in obj.threeWords" :key="ind1">{{word}}</div>
        </div>
        <div class="q-px-md">
          <div v-if="currentUser.team==='white'">
            <div v-for="(tryNumber, ind2) in obj.threeTryNumbersW" :key="ind2">{{tryNumber}}</div>
          </div>
          <div v-else>
            <div v-for="(tryNumber, ind3) in obj.threeTryNumbersB" :key="ind3">{{tryNumber}}</div>
          </div>
        </div>
        <div>
          <div v-for="(correctNumber, ind4) in obj.threeCorrectNumbers" :key="ind4">{{correctNumber}}</div>
        </div>
      </div>
        <div
          class="row"
          v-if="associationsForWhiteSecretWords[0].length ||
              associationsForWhiteSecretWords[1].length"
        >
          <div class="q-mx-sm">
            1
            <div
              v-for="(forFirstSecretWord, i1) in associationsForWhiteSecretWords[0]"
              :key="i1"
            >
              {{forFirstSecretWord}}
            </div>
          </div>
          <div class="q-mx-sm">
            2
            <div
              v-for="(forSecondSecretWord, i2) in associationsForWhiteSecretWords[1]"
              :key="i2"
            >
              {{forSecondSecretWord}}
            </div>
          </div>
          <div class="q-mx-sm">
            3
            <div
              v-for="(forThirdSecretWord, i3) in associationsForWhiteSecretWords[2]"
              :key="i3"
            >
              {{forThirdSecretWord}}
            </div>
          </div>
          <div class="q-mx-sm">
            4
            <div
              v-for="(forFoursSecretWord, i4) in associationsForWhiteSecretWords[3]"
              :key="i4"
            >
              {{forFoursSecretWord}}
            </div>
          </div>
        </div>
      </div>
      <div v-if="allUsers.length>=4" class="absolute-bottom bg-indigo-8 chat" ref="chatMessage">
        <div class="q-pa-md  row justify-center">
          <div v-if="chat.length" style="width: 100%; max-width: 400px">
            <q-chat-message
              size="6"
              v-for="(obj, index) in chat"
              :key="index"
              :name="me(obj.name)"
              :text="obj.message"
              :sent="currentUser.name===obj.name"
            />
          </div>
          <div v-else>
            no message in chat
          </div>
        </div>
        <div class="chatMessage bg-white row no-wrap justify-end items-center">
          <q-input
            rounded
            outlined
            v-model="message"
            label="message..."
          />
          <q-btn :disable="isBlockSendMessage" class="q-mx-md" round icon="send" @click="sendMessage" />
        </div>

      </div>
      <div>
        <div class="row justify-start" v-for="(obj,i) in listGameBlackSide" :key="i">
          black
          <div class="q-px-md">
            <div v-for="(word, ind) in obj.threeWords" :key="ind">{{word}}</div>
          </div>
          <div class="q-px-md">
            <div v-if="currentUser.team==='white'">
              <div v-for="(tryNumber, ind) in obj.threeTryNumbersW" :key="ind">{{tryNumber}}</div>
            </div>
            <div v-else>
              <div v-for="(tryNumber, ind) in obj.threeTryNumbersB" :key="ind">{{tryNumber}}</div>
            </div>
          </div>
          <div>
            <div v-for="(correctNumber, ind) in obj.threeCorrectNumbers" :key="ind">{{correctNumber}}</div>
          </div>
        </div>
        <div
          class="row"
          v-if="associationsForBlackSecretWords[0].length ||
              associationsForBlackSecretWords[1].length"
        >
          <div class="q-mx-sm">
            1
            <div
              v-for="(forFirstSecretWord, i1) in associationsForBlackSecretWords[0]"
              :key="i1"
            >
              {{forFirstSecretWord}}
            </div>
          </div>
          <div class="q-mx-sm">
            2
            <div
              v-for="(forSecondSecretWord, i2) in associationsForBlackSecretWords[1]"
              :key="i2"
            >
              {{forSecondSecretWord}}
            </div>
          </div>
          <div class="q-mx-sm">
            3
            <div
              v-for="(forThirdSecretWord, i3) in associationsForBlackSecretWords[2]"
              :key="i3"
            >
              {{forThirdSecretWord}}
            </div>
          </div>
          <div class="q-mx-sm">
            4
            <div
              v-for="(forFoursSecretWord, i4) in associationsForBlackSecretWords[3]"
              :key="i4"
            >
              {{forFoursSecretWord}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "game",
  data() {
    return {
      disableMessageForSameNumbers: null,
      firstWord: null,
      secondWord: null,
      thirdWord: null,
      isPlayer: false,
      isActive: this.$store.state.socket.user.isActive,
      message: '',
    }
  },
  watch: {
    chat() {
      setTimeout(()=>{
        this.$refs.chatMessage.scrollTop = this.$refs.chatMessage.scrollHeight
      })
    }
  },
  beforeUpdate() {
    if (this.isGameFinish) {
      this.redirect()
    }
  },
  updated() {
    console.log('updated')
  },
  computed: {
    notSameNumbers() {
      if (this.currentUser.team === 'white') {
        if (this.firstNumberWhite === this.secondNumberWhite ||
          this.thirdNumberWhite === this.secondNumberWhite ||
          this.firstNumberWhite === this.thirdNumberWhite) {
          this.disableMessageForSameNumbers = 'not same numbers please'
          return true
        }
        this.disableMessageForSameNumbers = null
        return false
      }
      if (this.firstNumberBlack === this.secondNumberBlack ||
        this.thirdNumberBlack === this.secondNumberBlack ||
        this.firstNumberBlack === this.thirdNumberBlack) {
        this.disableMessageForSameNumbers = 'not same numbers please'
        return true
      }
      this.disableMessageForSameNumbers = null
      return false
    },
    isBtnActive() {
      if (this.isTeamReady) {
        return true
      }
      return false
    },
    FOUR_GAME_WORDS () {
      return this.$store.getters['socket/FOUR_GAME_WORDS']
    },
    chat() {
      return this.$store.getters["socket/chat"]
    },
    isBlockSendMessage() {
      if (this.currentUser.team === 'white') {
        if (this.step === 4) {
          return false
        } else  {
          return this.currentUser.isActive
        }
      } else {
        if (this.step === 2) {
          return false
        } else  {
          return this.currentUser.isActive
        }
      }
    },
    associationsForBlackSecretWords() {
      return this.$store.getters["socket/associationsForBlackSecretWords"]
    },
    associationsForWhiteSecretWords() {
      return this.$store.getters["socket/associationsForWhiteSecretWords"]
    },
    listGameWhiteSide() {
      return this.$store.getters["socket/listGameWhiteSide"]
    },
    listGameBlackSide() {
      return this.$store.getters["socket/listGameBlackSide"]
    },
    isGameFinish() {
      return this.$store.getters["socket/whoIsWinner"]
    },
    blackCounterHindrance () {
      return this.$store.getters["socket/blackCounterHindrance"]
    },
    blackCounterInterception () {
      return this.$store.getters["socket/blackCounterInterception"]
    },
    whiteCounterHindrance () {
      return this.$store.getters["socket/whiteCounterHindrance"]
    },
    whiteCounterInterception () {
      return this.$store.getters["socket/whiteCounterInterception"]
    },
    isTryWhiteToGuessCorrect () {
      return this.$store.getters["socket/isTryWhiteToGuessCorrect"]
    },
    isTryBlackToGuessCorrect () {
      return this.$store.getters["socket/isTryBlackToGuessCorrect"]
    },
    firstNumberWhite () {
      return this.$store.getters["socket/firstNumberWhite"]
    },
    secondNumberWhite () {
      return this.$store.getters["socket/secondNumberWhite"]
    },
    thirdNumberWhite () {
      return this.$store.getters["socket/thirdNumberWhite"]
    },
    firstNumberBlack () {
      return this.$store.getters["socket/firstNumberBlack"]
    },
    secondNumberBlack () {
      return this.$store.getters["socket/secondNumberBlack"]
    },
    thirdNumberBlack () {
      return this.$store.getters["socket/thirdNumberBlack"]
    },
    correctFirstNumber () {
      return this.$store.getters["socket/correctFirstNumber"]
    },
    correctSecondNumber () {
      return this.$store.getters["socket/correctSecondNumber"]
    },
    correctThirdNumber () {
      return this.$store.getters["socket/correctThirdNumber"]
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
      return this.$store.getters["socket/round"]
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
    me(name) {
      if (name===this.currentUser.name) {
        return 'me'
      }
      return name
    },
    startRound() {
      this.$socket.emit('startRound', [this.allUsers, this.currentUser], dataFromServer => {
        console.log(dataFromServer)
      })
    },
    sendMessage() {
      if (this.message === '') return
      this.$socket.emit('sendMessage', [this.currentUser, this.message], dataFromServer => {
        console.log(dataFromServer)
      })
      this.message = ''
    },
    finishAndStartRound() {
      this.$socket.emit('isActiveUserFalse', this.currentUser, dataFromServer => {
        console.log(dataFromServer)
      })
      this.$socket.emit('finishRound', [this.allUsers, this.currentUser], dataFromServer => {
        console.log(dataFromServer)
        this.$socket.emit('startRound', [this.allUsers, this.currentUser], dataFromServer => {
          console.log(dataFromServer)
        })
      })
    },
    writeResultToListMiddle() {
      let threeTryNumbersArrW = [this.firstNumberWhite, this.secondNumberWhite, this.thirdNumberWhite]

      let threeTryNumbersArrB = [this.firstNumberBlack, this.secondNumberBlack, this.thirdNumberBlack]

      let threeWordsArr = this.threeWhiteAssociation
      let obj = {
        threeWords: threeWordsArr,
        threeTryNumbersW: threeTryNumbersArrW,
        threeTryNumbersB: threeTryNumbersArrB,
        threeCorrectNumbers: [this.correctFirstNumber,this.correctSecondNumber,this.correctThirdNumber],
      }
      this.$socket.emit('addResultToList', [obj, this.currentUser.room], dataFromServer=>{
        console.log(dataFromServer)
      })
    },
    writeResultToListEnd() {
      let threeTryNumbersArrW = [this.firstNumberWhite, this.secondNumberWhite, this.thirdNumberWhite]
      let threeTryNumbersArrB = [this.firstNumberBlack, this.secondNumberBlack, this.thirdNumberBlack]
      let threeWordsArr = this.threeBlackAssociation
      let obj = {
        threeWords: threeWordsArr,
        threeTryNumbersW: threeTryNumbersArrW,
        threeTryNumbersB: threeTryNumbersArrB,
        threeCorrectNumbers: [this.correctFirstNumber,this.correctSecondNumber,this.correctThirdNumber],
      }
      this.$socket.emit('addResultToListBlack', [obj, this.currentUser.room], dataFromServer=>{
        console.log(dataFromServer)
      })
    },
    onSubmit () {
      this.$socket.emit('readyThreeWords',
        [[this.firstWord,this.secondWord,this.thirdWord], this.currentUser],
        dataFromServer => {
          console.log(dataFromServer)
        })
      this.onReset2('all')
      setTimeout(()=>{
        this.firstWord = null
        this.secondWord = null
        this.thirdWord = null
      },20000)
    },
    nextThreeWords () {
      this.$socket.emit('nextThreeWords', this.currentUser,
        dataFromServer => {
          console.log(dataFromServer)
        })
      this.onReset2('all')
    },
    onReset () {
      this.firstWord = null
      this.secondWord = null
      this.thirdWord = null
    },
    sendTryToGuessSecretCode2() {
      let arr = []
      if (this.currentUser.team === 'black') {
        arr = [Number(this.firstNumberBlack),Number(this.secondNumberBlack),Number(this.thirdNumberBlack)]
      } else {
        arr = [Number(this.firstNumberWhite),Number(this.secondNumberWhite),Number(this.thirdNumberWhite)]
      }
      this.$socket.emit('nextTryToGuessSecretCode',
        [arr, this.currentUser],
        dataFromServer => {
          setTimeout(() => {
            this.writeResultToListEnd()
          },1000)
        })
    },

    sendTryToGuessSecretCode() {
      let arr = []
      if (this.currentUser.team === 'white') {
        arr = [Number(this.firstNumberWhite),Number(this.secondNumberWhite),Number(this.thirdNumberWhite)]
      } else {
        arr = [Number(this.firstNumberBlack),Number(this.secondNumberBlack),Number(this.thirdNumberBlack)]
      }
      this.$socket.emit('tryToGuessSecretCode',
        [arr, this.currentUser],
        dataFromServer => {
          setTimeout(() => {
            this.writeResultToListMiddle()
          },1000)
        })
    },
    onReset2 (team) {
      this.$socket.emit('nullNumbers', [team, this.currentUser], dataFromServer => {
        console.log(dataFromServer)
      })
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
    redirect(){
      this.$router.push('/finish')
    }
  }
}
</script>

<style lang="scss">
.fourGameWords {
  width: 80%;
  margin: 0 auto;
}

.chatMessage {
  .q-field {
    width: 100%;
    .q-field__inner {
      .q-field__control {
        height: 36px !important;
        .q-field__control-container {
          .q-field__label {
            top: 6px !important;
          }
          .q-field__native {
            padding-top: 20px !important;
          }
        }
      }
    }
  }
}

.chat {
  border-radius: 10px;
  overflow-y: auto;
  max-height: 250px;
  min-width: 300px;
  max-width: 500px;
  margin: 0 auto;
  &__input{
    width: 75%;
    float: right;
  }
}
</style>
