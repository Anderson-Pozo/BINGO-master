export function checkBingoWin({ cardNumbers, drawnNumbers }) {
  // console.log({ cardNumbers, drawnNumbers });
  const drawnSet = new Set(drawnNumbers);
  return cardNumbers?.filter((num) => num !== 'FREE').every((num) => drawnSet.has(num));
}
