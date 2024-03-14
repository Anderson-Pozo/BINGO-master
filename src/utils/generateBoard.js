import { bingoValues } from 'store/constant';

export function bingoBBalls() {
  const b = [];
  for (var x = bingoValues.B_START; x <= bingoValues.B_END; x++) {
    b.push(x);
  }
  return b;
}

export function bingoIBalls() {
  const i = [];
  for (var y = bingoValues.I_START; y <= bingoValues.I_END; y++) {
    i.push(y);
  }
  return i;
}

export function bingoNBalls() {
  const n = [];
  for (var z = bingoValues.N_START; z <= bingoValues.N_END; z++) {
    n.push(z);
  }
  return n;
}

export function bingoGBalls() {
  const g = [];
  for (var j = bingoValues.G_START; j <= bingoValues.G_END; j++) {
    g.push(j);
  }
  return g;
}

export function bingoOBalls() {
  const o = [];
  for (var k = bingoValues.O_START; k <= bingoValues.O_END; k++) {
    o.push(k);
  }
  return o;
}
