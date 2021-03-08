export {};
const { describe, test } = require("@jest/globals");
const {
  newGame,
  getCurrentState,
  getScore,
  isGameFinished,
  throwBowl,
} = require("./bowlingScorer");

const testSet0 = [
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
];
//150
const testSet1 = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
//300
const testSet2 = [9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0];
//90
const testSet3 = [9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9];

const testSet4 = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
const testSet5 = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
const testSet6 = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
const testSet7 = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 12];
const testSet8 = [5, 5, 10, 5, 5, 10, 5, 5, 10, 5, 5, 10, 5, 5, 10, 5, 5];
//200
const testSet9 = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 12];
const testSet10 = [9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 2];
const testSet11 = [
  9,
  0,
  9,
  0,
  9,
  0,
  9,
  0,
  9,
  0,
  9,
  0,
  9,
  0,
  9,
  0,
  9,
  0,
  9,
  1,
  11,
];

const testSequence = (sequence:number[]) => {
  newGame();

  for (let item of sequence) {
    throwBowl(item);
  }
  return getScore();
};

const testGameFinished = (sequence:number[]) => {
  newGame();
  for (let item of sequence) {
    throwBowl(item);
  }
  return isGameFinished();
};

const testCurrentState = (arr:number[]) => {
  newGame();
  for (let item of arr) {
    throwBowl(item);
  }
  return getCurrentState();
};

describe("testScore", () => {
  test("10 pairs with spares and a final", () => {
    expect(testSequence(testSet0)).toBe(150);
  });
  test("maximum sequence", () => {
    expect(testSequence(testSet1)).toBe(300);
  });
  test("ordinary sequence", () => {
    expect(testSequence(testSet2)).toBe(90);
  });
  test("sequence with mixed spares and strikes", () => {
    expect(testSequence(testSet8)).toBe(200);
  });
});

describe("gameFinished", () => {
  test("10 pairs with spares and a final", () => {
    expect(testGameFinished(testSet0)).toBe(true);
  });
  test("maximum sequence", () => {
    expect(testGameFinished(testSet1)).toBe(true);
  });
  test("ordinary sequence ", () => {
    expect(testGameFinished(testSet2)).toBe(true);
  });
  test("incomplete ordinary sequence", () => {
    expect(testGameFinished(testSet3)).toBe(false);
  });
  test("incomplete maximum sequence", () => {
    expect(testGameFinished(testSet4)).toBe(false);
  });
  test("10 pairs with spares without a final", () => {
    expect(testGameFinished(testSet5)).toBe(false);
  });
});

describe("currentState", () => {
  test("simple sequence", () => {
    expect(testCurrentState([2, 3, 4, 5])).toEqual([
      { frameId: 1, rolledPins: [2, 3], frameScore: 5 },
      { frameId: 2, rolledPins: [4, 5], frameScore: 9 },
    ]);
  });
  test("sequence with a spare", () => {
    expect(testCurrentState([5, 5, 3, 6])).toEqual([
      {
        frameId: 1,
        rolledPins: [5, 5],
        frameScore: 10,
        spareBonus: 3,
      },
      { frameId: 2, rolledPins: [3, 6], frameScore: 9 },
    ]);
  });
  test("sequence with a strike", () => {
    expect(testCurrentState([10, 3, 6])).toEqual([
      {
        frameId: 1,
        rolledPins: [10],
        frameScore: 10,
        strikeBonus: 9,
      },
      { frameId: 2, rolledPins: [3, 6], frameScore: 9 },
    ]);
  });
  test("sequence with two subsequent strikes", () => {
    expect(testCurrentState([10, 10, 3, 6])).toEqual([
      {
        frameId: 1,
        rolledPins: [10],
        frameScore: 10,
        strikeBonus: 13,
      },
      {
        frameId: 2,
        rolledPins: [10],
        frameScore: 10,
        strikeBonus: 9,
      },
      { frameId: 3, rolledPins: [3, 6], frameScore: 9 },
    ]);
  });
});

describe("error messages", () => {
  test("sequence exceeding maximum length", () => {
    expect(() => testCurrentState(testSet6)).toThrow("Game is over.");
  });
  test("maximum number of pins exceeded - simple frame", () => {
    expect(() => testCurrentState([3, 8])).toThrow(
      "Maximum number of pins is exceeded."
    );
  });
  test("maximum number of pins exceeded - maximum sequence", () => {
    expect(() => testCurrentState(testSet7)).toThrow(
      "Maximum number of pins is exceeded."
    );
  });

  test("maximum number of pins exceeded - incomplete maximum sequence, last frame, second throw", () => {
    expect(() => testCurrentState(testSet9)).toThrow(
      "Maximum number of pins is exceeded."
    );
  });
  test("maximum number of pins exceeded - ordinary sequence", () => {
    expect(() => testCurrentState(testSet10)).toThrow(
      "Maximum number of pins is exceeded."
    );
  });
  test("maximum number of pins exceeded - sequence with spare in tenth frame", () => {
    expect(() => testCurrentState(testSet11)).toThrow(
      "Maximum number of pins is exceeded."
    );
  });
});
