import React, { useState } from 'react';
import { ButtonGroup, Grid, Button, Box, Modal } from '@mui/material';
import { IconCirclePlus, IconDeviceFloppy } from '@tabler/icons';
import { generateId } from 'utils/idGenerator';
import CircularProgress from '@mui/material/CircularProgress';
//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createDocument } from 'config/firebaseEvents';
import { collBoards } from 'store/collections';
import { fullDate } from 'utils/validations';
import { uiStyles } from './Game.styles';

export default function Game() {
  const [openLoader, setOpenLoader] = useState(false);
  const [number, setNumber] = useState(0);
  const [letter, setLetter] = useState('');
  const [cont, setCont] = useState(0);
  const [bingoNumbers, setBingoNumbers] = useState([]);
  const [visible, setVisible] = useState(true);
  const [prevNumber, setPrevNumber] = useState(0);
  const [prevLetter, setPrevLetter] = useState('');
  const [resultBingo, setResultBingo] = useState('');

  const b = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const i = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
  const n = [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
  const g = [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
  const o = [61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75];

  const handleNextBall = () => {
    randomNumber(1, 75);
  };

  const randomNumber = (min, max) => {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    if (bingoNumbers.includes(num)) {
      //console.log('Repetido: ' + num);
      randomNumber(min, max);
    } else {
      setBingoNumbers((bingoNumbers) => [...bingoNumbers, num]);
      if (cont > 0) {
        handlePrev(number, letter);
      }
      setNumber(num);
      handleSelectBall(num);
      if (num <= 15) {
        setLetter('B');
        setResultBingo(resultBingo + '-' + 'B' + num);
      } else if (num >= 16 && num <= 30) {
        setLetter('I');
        setResultBingo(resultBingo + '-' + 'I' + num);
      } else if (num >= 31 && num <= 45) {
        setLetter('N');
        setResultBingo(resultBingo + '-' + 'N' + num);
      } else if (num >= 46 && num <= 60) {
        setLetter('G');
        setResultBingo(resultBingo + '-' + 'G' + num);
      } else if (num >= 61 && num <= 75) {
        setLetter('O');
        setResultBingo(resultBingo + '-' + 'O' + num);
      }
      setCont(cont + 1);
      if (cont == 74) {
        setVisible(false);
      }
    }
  };

  const handlePrev = (n, l) => {
    setPrevNumber(n);
    setPrevLetter(l);
  };

  const handleSizeCont = () => {
    console.log('Tamaño:', bingoNumbers.length);
  };

  const handleReset = () => {
    window.location.reload();
  };

  const handleSelectBall = (id) => {
    document.getElementById('btn' + id).style.background = '#26c4fb';
    document.getElementById('btn' + id).style.color = '#FFF';
  };

  const handleSaveBoard = () => {
    setOpenLoader(true);
    const ide = generateId(10);
    const object = {
      id: ide,
      createAt: fullDate(),
      result: resultBingo
    };
    setTimeout(() => {
      createDocument(collBoards, ide, object);
      toast.success('Tablero guardado correctamente!', { position: toast.POSITION.TOP_RIGHT });
      setOpenLoader(false);
      window.location.reload();
    }, 3000);
  };

  return (
    <Box sx={uiStyles.box}>
      <ToastContainer />
      <center>
        <ButtonGroup aria-label="Basic button group">
          <Button
            variant="contained"
            style={{ color: '#FFF', height: 40, width: 160 }}
            onClick={handleNextBall}
            disabled={visible ? false : true}
          >
            SIGUIENTE
          </Button>
          <Button variant="outlined" style={{ color: '#179cdc', height: 40, width: 100 }} onClick={handleSizeCont}>
            <h2>{cont}</h2>
          </Button>
          <Button variant="contained" style={{ color: '#FFF', height: 40, width: 160 }} onClick={handleReset}>
            REINICIAR
          </Button>
        </ButtonGroup>
      </center>
      <Grid container style={{ marginTop: 10 }}>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={6} md={6} sm={6} xs={6} sx={{ bgcolor: '#179cdc', borderTopLeftRadius: 20 }}>
              <center>
                <div
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#FFF',
                    color: '#179cdc',
                    width: 120,
                    height: 120,
                    borderRadius: 70,
                    padding: 10,
                    margin: 10
                  }}
                >
                  <h1>{letter}</h1>
                  <h1>{number}</h1>
                </div>
              </center>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6} sx={{ bgcolor: '#04acec', borderTopRightRadius: 10 }}>
              <center>
                <div
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#FFF',
                    color: '#179cdc',
                    width: 120,
                    height: 120,
                    borderRadius: 70,
                    padding: 10,
                    margin: 10
                  }}
                >
                  <h1>{prevLetter}</h1>
                  <h1>{prevNumber}</h1>
                </div>
              </center>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6} sx={{ bgcolor: '#696969', height: 40 }}>
              <center>
                <span style={{ color: '#FFF', fontWeight: 'bold' }}>ACTUAL</span>
              </center>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6} sx={{ bgcolor: '#696969', height: 40 }}>
              <center>
                <span style={{ color: '#FFF', fontWeight: 'bold' }}>ANTERIOR</span>
              </center>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid
              item
              lg={1}
              md={1}
              sm={1}
              xs={1}
              sx={{
                background: '#179cdc',
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '0.2px solid #EFEFEF'
              }}
            >
              <h3 style={{ fontSize: 20, color: '#FFF' }}>B</h3>
            </Grid>
            <Grid
              item
              lg={10}
              md={10}
              sm={10}
              xs={10}
              sx={{
                background: '#FFF',
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  {b.map((item) => (
                    <Grid
                      id={'btn' + item}
                      key={item}
                      item
                      lg={1}
                      md={1}
                      sm={1}
                      xs={1}
                      sx={{
                        background: '#FFF',
                        height: 30,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '0.2px solid #EFEFEF'
                      }}
                    >
                      <h4 style={{ color: '#179cdc' }}>{item}</h4>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              lg={1}
              md={1}
              sm={1}
              xs={1}
              sx={{
                background: '#179cdc',
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '0.2px solid #EFEFEF'
              }}
            >
              <h3 style={{ fontSize: 20, color: '#FFF' }}>B</h3>
            </Grid>

            <Grid
              item
              lg={1}
              md={1}
              sm={1}
              xs={1}
              sx={{
                background: '#179cdc',
                height: 60,
                borderTopLeftRadius: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '0.2px solid #EFEFEF'
              }}
            >
              <h3 style={{ fontSize: 20, color: '#FFF' }}>I</h3>
            </Grid>
            <Grid
              item
              lg={10}
              md={10}
              sm={10}
              xs={10}
              sx={{ background: '#FFF', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  {i.map((item) => (
                    <Grid
                      id={'btn' + item}
                      key={item}
                      item
                      lg={1}
                      md={1}
                      sm={1}
                      xs={1}
                      sx={{
                        background: '#FFF',
                        height: 30,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '0.2px solid #EFEFEF'
                      }}
                    >
                      <h4 style={{ color: '#179cdc' }}>{item}</h4>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              lg={1}
              md={1}
              sm={1}
              xs={1}
              sx={{
                background: '#179cdc',
                height: 60,
                borderTopRightRadius: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '0.2px solid #EFEFEF'
              }}
            >
              <h3 style={{ fontSize: 20, color: '#FFF' }}>I</h3>
            </Grid>

            <Grid
              item
              lg={1}
              md={1}
              sm={1}
              xs={1}
              sx={{
                background: '#179cdc',
                height: 60,
                borderTopLeftRadius: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '0.2px solid #EFEFEF'
              }}
            >
              <h3 style={{ fontSize: 20, color: '#FFF' }}>N</h3>
            </Grid>
            <Grid
              item
              lg={10}
              md={10}
              sm={10}
              xs={10}
              sx={{ background: '#FFF', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  {n.map((item) => (
                    <Grid
                      id={'btn' + item}
                      key={item}
                      item
                      lg={1}
                      md={1}
                      sm={1}
                      xs={1}
                      sx={{
                        background: '#FFF',
                        height: 30,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '0.2px solid #EFEFEF'
                      }}
                    >
                      <h4 style={{ color: '#179cdc' }}>{item}</h4>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              lg={1}
              md={1}
              sm={1}
              xs={1}
              sx={{
                background: '#179cdc',
                height: 60,
                borderTopRightRadius: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '0.2px solid #EFEFEF'
              }}
            >
              <h3 style={{ fontSize: 20, color: '#FFF' }}>N</h3>
            </Grid>

            <Grid
              item
              lg={1}
              md={1}
              sm={1}
              xs={1}
              sx={{
                background: '#179cdc',
                height: 60,
                borderTopLeftRadius: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '0.2px solid #EFEFEF'
              }}
            >
              <h3 style={{ fontSize: 20, color: '#FFF' }}>G</h3>
            </Grid>
            <Grid
              item
              lg={10}
              md={10}
              sm={10}
              xs={10}
              sx={{ background: '#FFF', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  {g.map((item) => (
                    <Grid
                      id={'btn' + item}
                      key={item}
                      item
                      lg={1}
                      md={1}
                      sm={1}
                      xs={1}
                      sx={{
                        background: '#FFF',
                        height: 30,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '0.2px solid #EFEFEF'
                      }}
                    >
                      <h4 style={{ color: '#179cdc' }}>{item}</h4>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              lg={1}
              md={1}
              sm={1}
              xs={1}
              sx={{
                background: '#179cdc',
                height: 60,
                borderTopRightRadius: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '0.2px solid #EFEFEF'
              }}
            >
              <h3 style={{ fontSize: 20, color: '#FFF' }}>G</h3>
            </Grid>

            <Grid
              item
              lg={1}
              md={1}
              sm={1}
              xs={1}
              sx={{
                background: '#179cdc',
                height: 60,
                borderBottomLeftRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '0.2px solid #EFEFEF'
              }}
            >
              <h3 style={{ fontSize: 20, color: '#FFF' }}>O</h3>
            </Grid>
            <Grid
              item
              lg={10}
              md={10}
              sm={10}
              xs={10}
              sx={{ background: '#FFF', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  {o.map((item) => (
                    <Grid
                      id={'btn' + item}
                      key={item}
                      item
                      lg={1}
                      md={1}
                      sm={1}
                      xs={1}
                      sx={{
                        background: '#FFF',
                        height: 30,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '0.2px solid #EFEFEF'
                      }}
                    >
                      <h4 style={{ color: '#179cdc' }}>{item}</h4>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              lg={1}
              md={1}
              sm={1}
              xs={1}
              sx={{
                background: '#179cdc',
                height: 60,
                borderBottomRightRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '0.2px solid #EFEFEF'
              }}
            >
              <h3 style={{ fontSize: 20, color: '#FFF' }}>O</h3>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: 10 }}>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Box sx={{ background: '#FFF', p: 1, borderRadius: 5, pl: 2, pr: 2 }}>
                <h3>Orden Números Sorteados</h3>
                <h4>{resultBingo}</h4>
              </Box>
            </Grid>
            {cont == 75 ? (
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box sx={{ background: '#179cdc', p: 2, borderRadius: 5, pl: 3, pr: 3 }}>
                  <center>
                    <h3 style={{ color: '#FFF' }}>PARTIDA TERMINADA</h3>
                    <ButtonGroup aria-label="Basic button group">
                      <Button
                        variant="contained"
                        style={{ width: 200, height: 60, color: '#FFF' }}
                        onClick={handleSaveBoard}
                        startIcon={<IconDeviceFloppy />}
                      >
                        Guardar Tablero
                      </Button>
                      <Button
                        variant="contained"
                        style={{ width: 200, height: 60, color: '#FFF' }}
                        onClick={handleReset}
                        startIcon={<IconCirclePlus />}
                      >
                        Nueva Partida
                      </Button>
                    </ButtonGroup>
                  </center>
                </Box>
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Modal open={openLoader} aria-labelledby="modal-loader" aria-describedby="modal-loader">
        <center>
          <Box sx={uiStyles.styleLoader}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>
    </Box>
  );
}
