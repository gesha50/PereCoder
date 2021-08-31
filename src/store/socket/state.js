export default function () {
  return {
    ROUND: 0,
    user: null,
    users: [],
    message: [],
    FOUR_GAME_WORDS: [],
    isGameRun: false,
    threeNumbers: [],
    gameMessage: null,
    step: 0,
    isTeamReady: false,
    threeWhiteAssociation: null,
    threeBlackAssociation: null,
    firstNumberWhite: null,
    secondNumberWhite: null,
    thirdNumberWhite: null,
    isTryBlackToGuessCorrect: false,
    isTryWhiteToGuessCorrect: false,
    blackCounterHindrance: 0,
    blackCounterInterception: 0,
    whiteCounterHindrance: 0,
    whiteCounterInterception: 0,
    firstNumberBlack: null,
    secondNumberBlack: null,
    thirdNumberBlack: null,

    correctFirstNumber: null,
    correctSecondNumber: null,
    correctThirdNumber: null,

    listGameWhiteSide: [],
    listGameBlackSide: [],

    associationsForWhiteSecretWords: [[],[],[],[]],
    associationsForBlackSecretWords: [[],[],[],[]],

    whoIsWinner: null,
  }
}
