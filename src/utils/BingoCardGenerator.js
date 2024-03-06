export function BingoCard() {
  var matrix = [];
  var b = [];
  var i = [];
  var n = [];
  var g = [];
  var o = [];

  for (var a = 0; a < 5; a++) {
    b[a] = Math.floor(Math.random() * (15 - 1) + 1);
  }

  for (var outer = 0; outer < b.length; outer++) {
    for (var inner = 0; inner < b.length; inner++) {
      if (inner != outer && b[outer] == b[inner]) {
        b[outer] = Math.floor(Math.random() * (15 - 1) + 1);
      }
    }
  }
  matrix.push(b);

  for (var a1 = 0; a1 < 5; a1++) {
    i[a1] = Math.floor(Math.random() * (30 - 16) + 16);
  }

  for (var outer1 = 0; outer1 < i.length; outer1++) {
    for (var inner1 = 0; inner1 < i.length; inner1++) {
      if (inner1 != outer1 && i[outer1] == i[inner1]) {
        i[outer1] = Math.floor(Math.random() * (30 - 16) + 16);
      }
    }
  }
  matrix.push(i);

  for (var a2 = 0; a2 < 5; a2++) {
    n[a2] = Math.floor(Math.random() * (45 - 31) + 31);
  }

  for (var outer2 = 0; outer2 < n.length; outer2++) {
    for (var inner2 = 0; inner2 < n.length; inner2++) {
      if (inner2 != outer2 && n[outer2] == n[inner2]) {
        n[outer2] = Math.floor(Math.random() * (45 - 31) + 31);
      }
    }
  }
  matrix.push(n);

  for (var a3 = 0; a3 < 5; a3++) {
    g[a3] = Math.floor(Math.random() * (60 - 46) + 46);
  }

  for (var outer3 = 0; outer3 < g.length; outer3++) {
    for (var inner3 = 0; inner3 < g.length; inner3++) {
      if (inner3 != outer3 && g[outer3] == g[inner3]) {
        g[outer3] = Math.floor(Math.random() * (60 - 46) + 46);
      }
    }
  }
  matrix.push(g);

  for (var a4 = 0; a4 < 5; a4++) {
    o[a4] = Math.floor(Math.random() * (75 - 61) + 61);
  }

  for (var outer4 = 0; outer4 < o.length; outer4++) {
    for (var inner4 = 0; inner4 < o.length; inner4++) {
      if (inner4 != outer4 && o[outer4] == o[inner4]) {
        o[outer4] = Math.floor(Math.random() * (75 - 61) + 61);
      }
    }
  }
  matrix.push(o);

  return matrix;

  /*drawCard = () => {
    return `<div>
        <table>
            <tr>
                <th>B</th>
                <th>I</th>
                <th>N</th>
                <th>G</th>
                <th>O</th>
            </tr>
            <tr>
                <td id="${matrix[0][0]}">${matrix[0][0]}</td>
                <td id="${matrix[1][0]}">${matrix[1][0]}</td>
                <td id="${matrix[2][0]}">${matrix[2][0]}</td>
                <td id="${matrix[3][0]}">${matrix[3][0]}</td>
                <td id="${matrix[4][0]}">${matrix[4][0]}</td>
            </tr>
            <tr>
                <td id="${matrix[0][1]}">${matrix[0][1]}</td>
                <td id="${matrix[1][1]}">${matrix[1][1]}</td>
                <td id="${matrix[2][1]}">${matrix[2][1]}</td>
                <td id="${matrix[3][1]}">${matrix[3][1]}</td>
                <td id="${matrix[4][1]}">${matrix[4][1]}</td>
            </tr>
            <tr>
                <td id="${matrix[0][2]}">${matrix[0][2]}</td>
                <td id="${matrix[1][2]}">${matrix[1][2]}</td>
                <td id="${matrix[2][2]}" style="background: black;><p id="free>FREE</p></td>
                <td id="${matrix[3][2]}">${matrix[3][2]}</td>
                <td id="${matrix[4][2]}">${matrix[4][2]}</td>
            </tr>
            <tr>
                <td id="${matrix[0][3]}">${matrix[0][3]}</td>
                <td id="${matrix[1][3]}">${matrix[1][3]}</td>
                <td id="${matrix[2][3]}">${matrix[2][3]}</td>
                <td id="${matrix[3][3]}">${matrix[3][3]}</td>
                <td id="${matrix[4][3]}">${matrix[4][3]}</td>
            </tr>
            <tr>
                <td id="${matrix[0][4]}">${matrix[0][4]}</td>
                <td id="${matrix[1][4]}">${matrix[1][4]}</td>
                <td id="${matrix[2][4]}">${matrix[2][4]}</td>
                <td id="${matrix[3][4]}">${matrix[3][4]}</td>
                <td id="${matrix[4][4]}">${matrix[4][4]}</td>
            </tr>
        </table>
    </div>`;
  };*/
}
