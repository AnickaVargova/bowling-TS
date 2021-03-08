export {};
const {
  maxNumberOfPins,
  VERBOSE,
}: { maxNumberOfPins: number; VERBOSE: boolean } = require("./config");
let scoreTable: {
  frameId: number;
  rolledPins: number[];
  frameScore: number;
  spareBonus?: number;
  strikeBonus?: number;
}[] = [];

const newGame = () => {
  if (VERBOSE) {
    console.log("Game started.");
  }
  scoreTable = [];
};

const getCurrentState = () => scoreTable;

const getScore = () => {
  let score = 0;
  if (scoreTable.length === 0) {
    return score;
  }

  score = scoreTable
    .map(
      (current) =>
        current.frameScore +
        (current.spareBonus || 0) +
        (current.strikeBonus || 0)
    )
    .reduce((total, current) => total + current, 0);

  let scoreWithoutCurrentFrameBonus = Boolean(
    isSpare(getCurrent()) ||
      (isStrike(getCurrent()) && !isStrike(getPrevious()))
  );
  let scoreWithoutTwoFrameBonuses = Boolean(
    isStrike(getCurrent()) && isStrike(getPrevious())
  );
  let scoreWithoutPreviousFrameBonus = Boolean(
    getCurrent()?.rolledPins.length === 1 && isStrike(getPrevious())
  );

  if (VERBOSE) {
    if (!isGameFinished()) {
      if (scoreWithoutCurrentFrameBonus) {
        console.log(
          `Your current score is ${score}. It doesn't include the bonus for the last frame.`
        );
      } else if (scoreWithoutTwoFrameBonuses) {
        console.log(
          `Your current score is ${score}. The strike bonus for the last two frames is not complete.`
        );
      } else if (scoreWithoutPreviousFrameBonus) {
        console.log(
          `Your current score is ${score}. The strike bonus for the previous frame is not complete.`
        );
      } else console.log(`Your current score is ${score}.`);
    } else {
      console.log(`Your total score is ${score}.`);
    }
  }
  return score;
};

const isGameFinished = () =>
  scoreTable.length === 10 &&
  ((!isSpare(getCurrent()) &&
    !isStrike(getCurrent()) &&
    getCurrent().rolledPins.length === 2) ||
    getCurrent().rolledPins.length === 3);

const getCurrent = () => scoreTable[scoreTable.length - 1];

const getPrevious = () => scoreTable[scoreTable.length - 2];

const getBeforePrevious = () => scoreTable[scoreTable.length - 3];

const setFrameNumber = () => scoreTable.length + 1;

const isSpare = (frame: {
  frameId: number;
  rolledPins: number[];
  frameScore: number;
  spareBonus?: number;
  strikeBonus?: number;
}) => frame?.rolledPins.length === 2 && frame.frameScore === maxNumberOfPins;

const isStrike = (frame: {
  frameId: number;
  rolledPins: number[];
  frameScore: number;
  spareBonus?: number;
  strikeBonus?: number;
}) => frame?.rolledPins?.[0] === maxNumberOfPins;

const throwBowl = (count: number) => {
  let isTenth = Boolean(scoreTable.length === 10);

  if (isGameFinished()) {
    throw new Error("Game is over.");
  }
  if (
    isTenth ||
    (getCurrent()?.rolledPins.length < 2 && !isStrike(getCurrent()))
  ) {
    getCurrent().rolledPins.push(count);
    getCurrent().frameScore += count;
  } else {
    let frame: { frameId: number; rolledPins: number[]; frameScore: number } = {
      frameId: setFrameNumber(),
      rolledPins: [count],
      frameScore: count,
    };

    scoreTable.push(frame);

    if (isSpare(getPrevious())) {
      getPrevious().spareBonus = count;
    }

    if (isStrike(getPrevious()) && isStrike(getBeforePrevious())) {
      getBeforePrevious().strikeBonus += count;
    }

    if (isStrike(getPrevious()) && getCurrent()?.rolledPins.length <= 2) {
      getPrevious().strikeBonus
        ? (getPrevious().strikeBonus += count)
        : (getPrevious().strikeBonus = count);
    }

    if (
      getCurrent()?.rolledPins?.[0] > maxNumberOfPins ||
      (getCurrent()?.rolledPins.length === 2 &&
        ((!(isTenth && isStrike(getCurrent())) &&
          getCurrent()?.frameScore > maxNumberOfPins) ||
          (isStrike(getCurrent()) &&
            getCurrent()?.frameScore > 2 * maxNumberOfPins))) ||
      (isTenth &&
        ((isStrike(getCurrent()) &&
          getCurrent()?.frameScore > 3 * maxNumberOfPins) ||
          (getCurrent().rolledPins[0] + getCurrent().rolledPins[1] ===
            maxNumberOfPins &&
            getCurrent()?.frameScore > 2 * maxNumberOfPins)))
    ) {
      throw new Error("Maximum number of pins is exceeded.");
    }
  }
};

module.exports = {
  newGame,
  getCurrentState,
  getScore,
  isGameFinished,
  throwBowl,
};
