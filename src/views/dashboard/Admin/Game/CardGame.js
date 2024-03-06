import React, { useState } from 'react';
import { Box, Button, ButtonGroup, Grid } from '@mui/material';
import { uiStyles } from './Game.styles';

export default function CardGame() {
  const [bNumbers, setBNumbers] = useState([]);
  const [iNumbers, setINumbers] = useState([]);
  const [nNumbers, setNNumbers] = useState([]);
  const [gNumbers, setGNumbers] = useState([]);
  const [oNumbers, setONumbers] = useState([]);
  const [showCard, setShowCard] = useState(false);

  function generateBsection() {
    let matrix = [];
    let b = [];
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
    setBNumbers(matrix[0]);
  }

  function generateIsection() {
    let matrix = [];
    let i = [];
    for (var a = 0; a < 5; a++) {
      i[a] = Math.floor(Math.random() * (30 - 16) + 16);
    }
    for (var outer = 0; outer < i.length; outer++) {
      for (var inner = 0; inner < i.length; inner++) {
        if (inner != outer && i[outer] == i[inner]) {
          i[outer] = Math.floor(Math.random() * (30 - 16) + 16);
        }
      }
    }
    matrix.push(i);
    setINumbers(matrix[0]);
  }

  function generateNsection() {
    let matrix = [];
    let n = [];
    for (var a = 0; a < 5; a++) {
      n[a] = Math.floor(Math.random() * (45 - 31) + 31);
    }
    for (var outer = 0; outer < n.length; outer++) {
      for (var inner = 0; inner < n.length; inner++) {
        if (inner != outer && n[outer] == n[inner]) {
          n[outer] = Math.floor(Math.random() * (45 - 31) + 31);
        }
      }
    }
    matrix.push(n);
    setNNumbers(matrix[0]);
  }

  function generateGsection() {
    let matrix = [];
    let g = [];
    for (var a = 0; a < 5; a++) {
      g[a] = Math.floor(Math.random() * (60 - 46) + 46);
    }
    for (var outer = 0; outer < g.length; outer++) {
      for (var inner = 0; inner < g.length; inner++) {
        if (inner != outer && g[outer] == g[inner]) {
          g[outer] = Math.floor(Math.random() * (60 - 46) + 46);
        }
      }
    }
    matrix.push(g);
    setGNumbers(matrix[0]);
  }

  function generateOsection() {
    let matrix = [];
    let o = [];
    for (var a = 0; a < 5; a++) {
      o[a] = Math.floor(Math.random() * (75 - 61) + 61);
    }
    for (var outer = 0; outer < o.length; outer++) {
      for (var inner = 0; inner < o.length; inner++) {
        if (inner != outer && o[outer] == o[inner]) {
          o[outer] = Math.floor(Math.random() * (75 - 61) + 61);
        }
      }
    }
    matrix.push(o);
    setONumbers(matrix[0]);
  }

  const handleGetCard = () => {
    generateBsection();
    generateIsection();
    generateNsection();
    generateGsection();
    generateOsection();
    setShowCard(true);
  };

  const handleSaveCard = () => {
    const obj = {
      b: bNumbers,
      i: iNumbers,
      n: nNumbers,
      g: gNumbers,
      o: oNumbers
    };
    console.log(obj);
  };

  return (
    <Box sx={uiStyles.box}>
      <ButtonGroup>
        <Button variant="contained" style={{ color: '#FFF', height: 50, width: 160 }} onClick={handleGetCard}>
          Generar Cartilla
        </Button>
        {showCard ? (
          <Button variant="outlined" style={{ height: 50, width: 160 }} onClick={handleSaveCard}>
            Guardar Cartilla
          </Button>
        ) : (
          <></>
        )}
      </ButtonGroup>
      <br />
      <br />
      <Grid container style={{ marginTop: 10 }}>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              {showCard ? (
                <div>
                  <ButtonGroup aria-label="Basic button group" orientation="vertical">
                    <Button variant="contained" style={{ color: '#FFF', fontWeight: 'bold', height: 62, width: 62 }}>
                      B
                    </Button>
                    {bNumbers.map((item, key) => (
                      <Button key={'b' + key} variant="outlined" style={{ height: 62, width: 62 }}>
                        {item}
                      </Button>
                    ))}
                  </ButtonGroup>
                  <ButtonGroup aria-label="Basic button group" orientation="vertical">
                    <Button variant="contained" style={{ color: '#FFF', height: 62, width: 62 }}>
                      I
                    </Button>
                    {iNumbers.map((item, key) => (
                      <Button key={'i' + key} variant="outlined" style={{ height: 62, width: 62 }}>
                        {item}
                      </Button>
                    ))}
                  </ButtonGroup>
                  <ButtonGroup aria-label="Basic button group" orientation="vertical">
                    <Button variant="contained" style={{ color: '#FFF', height: 62, width: 62 }}>
                      N
                    </Button>
                    {nNumbers.map((item, key) => (
                      <Button key={'n' + key} variant="outlined" style={{ height: 62, width: 62 }}>
                        {item}
                      </Button>
                    ))}
                  </ButtonGroup>
                  <ButtonGroup aria-label="Basic button group" orientation="vertical">
                    <Button variant="contained" style={{ color: '#FFF', height: 62, width: 62 }}>
                      G
                    </Button>
                    {gNumbers.map((item, key) => (
                      <Button key={'g' + key} variant="outlined" style={{ height: 62, width: 62 }}>
                        {item}
                      </Button>
                    ))}
                  </ButtonGroup>
                  <ButtonGroup aria-label="Basic button group" orientation="vertical">
                    <Button variant="contained" style={{ color: '#FFF', height: 62, width: 62 }}>
                      O
                    </Button>
                    {oNumbers.map((item, key) => (
                      <Button key={'o' + key} variant="outlined" style={{ height: 62, width: 62 }}>
                        {item}
                      </Button>
                    ))}
                  </ButtonGroup>
                </div>
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
