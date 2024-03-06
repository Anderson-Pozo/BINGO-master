export function generateBsection() {
  const b = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  var num = Math.floor(Math.random() * (15 - 1 + 1)) + 1;
  if (b.includes(num)) {
    generateBsection();
  }
  return num;
}
