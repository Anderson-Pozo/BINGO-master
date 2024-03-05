export function BallDraw() {
  let ballDrawnNumber = [];
  let ballDrawnLetter = [];
  let letter = null;

  let repeat = 0;
  let ballLetter;
  let ballNumber = 1 * Math.floor(Math.random() * 75);

  for (var index = 0; index < 75; index++) {
    if (ballNumber == ballDrawnNumber[index] && ballLetter == ballDrawnLetter[index]) {
      repeat++;
    }
  }
  if (repeat == 0) {
    if (ballNumber < 15) {
      letter = 'B';
      ballDrawnLetter.push('B');
      ballDrawnNumber.push(ballNumber);
    } else if (ballNumber >= 15 && ballNumber <= 30) {
      letter = 'I';
      ballDrawnLetter.push('I');
      ballDrawnNumber.push(ballNumber);
    } else if (ballNumber >= 31 && ballNumber <= 45) {
      letter = 'N';
      ballDrawnLetter.push('N');
      ballDrawnNumber.push(ballNumber);
    } else if (ballNumber >= 46 && ballNumber <= 60) {
      letter = 'G';
      ballDrawnLetter.push('G');
      ballDrawnNumber.push(ballNumber);
    } else if (ballNumber >= 61 && ballNumber <= 75) {
      letter = 'O';
      ballDrawnLetter.push('O');
      ballDrawnNumber.push(ballNumber);
    }
  } else {
    //ballNumber = 1 * Math.floor(Math.random() * 75);
    ballNumber = 0;
    letter = 'NA';
  }
  repeat = 0;
  return letter + '-' + ballNumber;
}
