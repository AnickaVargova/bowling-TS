"use strict";

import {
  newGame,
  getCurrentState,
  getScore,
  isGameFinished,
  throwBowl,
} from "./bowlingScorer";

newGame();

throwBowl(1);
throwBowl(2);
throwBowl(5);
throwBowl(5);
throwBowl(3);

console.log(getCurrentState());
console.log(isGameFinished());
console.log(getScore());
