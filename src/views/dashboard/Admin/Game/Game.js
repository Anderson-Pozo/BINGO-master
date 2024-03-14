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
import { bingoValues } from 'store/constant';
import { bingoBBalls, bingoIBalls, bingoNBalls, bingoGBalls, bingoOBalls } from 'utils/generateBoard';
import { titles } from './Game.texts';

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
  let b = bingoBBalls();
  let i = bingoIBalls();
  let n = bingoNBalls();
  let g = bingoGBalls();
  let o = bingoOBalls();

  const handleNextBall = () => {
    randomNumber(bingoValues.INIT, bingoValues.LIMIT);
  };

  const randomNumber = (min, max) => {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    if (bingoNumbers.includes(num)) {
      randomNumber(min, max);
    } else {
      setBingoNumbers((bingoNumbers) => [...bingoNumbers, num]);
      if (cont > 0) {
        handlePrev(number, letter);
      }
      setNumber(num);
      handleSelectBall(num);
      if (num <= bingoValues.B_END) {
        setLetter(titles.b);
        setResultBingo(resultBingo + '-' + titles.b + num);
      } else if (num >= bingoValues.I_START && num <= bingoValues.I_END) {
        setLetter(titles.i);
        setResultBingo(resultBingo + '-' + titles.i + num);
      } else if (num >= bingoValues.N_START && num <= bingoValues.N_END) {
        setLetter(titles.n);
        setResultBingo(resultBingo + '-' + titles.n + num);
      } else if (num >= bingoValues.G_START && num <= bingoValues.G_END) {
        setLetter(titles.g);
        setResultBingo(resultBingo + '-' + titles.g + num);
      } else if (num >= bingoValues.O_START && num <= bingoValues.O_END) {
        setLetter(titles.o);
        setResultBingo(resultBingo + '-' + titles.o + num);
      }
      setCont(cont + 1);
      if (cont == bingoValues.LIMIT - 1) {
        setVisible(false);
      }
    }
  };

  const handlePrev = (n, l) => {
    setPrevNumber(n);
    setPrevLetter(l);
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
      toast.success(titles.successSave, { position: toast.POSITION.TOP_RIGHT });
      setOpenLoader(false);
      window.location.reload();
    }, 3000);
  };

  return (
    <Box sx={uiStyles.box}>
      <ToastContainer />
      <center>
        <ButtonGroup aria-label="Basic button group">
          <Button variant="contained" style={uiStyles.btnMain} onClick={handleNextBall} disabled={visible ? false : true}>
            {titles.next}
          </Button>
          <Button variant="outlined" style={uiStyles.btnCount}>
            <h2>{cont}</h2>
          </Button>
          <Button variant="contained" style={uiStyles.btnMain} onClick={handleReset}>
            {titles.restart}
          </Button>
        </ButtonGroup>
      </center>
      <Grid container style={{ marginTop: 10 }}>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={6} md={6} sm={6} xs={6} sx={uiStyles.bgPanelBallActual}>
              <center>
                <div style={uiStyles.ball}>
                  <h1>{letter}</h1>
                  <h1>{number}</h1>
                </div>
              </center>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6} sx={uiStyles.bgPanelBallAnte}>
              <center>
                <div style={uiStyles.ball}>
                  <h1>{prevLetter}</h1>
                  <h1>{prevNumber}</h1>
                </div>
              </center>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6} sx={uiStyles.panelBall}>
              <center>
                <span style={uiStyles.panelText}>{titles.actual}</span>
              </center>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6} sx={uiStyles.panelBall}>
              <center>
                <span style={uiStyles.panelText}>{titles.ante}</span>
              </center>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={1} md={1} sm={1} xs={1} sx={uiStyles.leftCell}>
              <h3 style={uiStyles.cellLetter}>{titles.b}</h3>
            </Grid>
            <Grid item lg={10} md={10} sm={10} xs={10} sx={uiStyles.midCol}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  {b.map((item) => (
                    <Grid id={'btn' + item} key={item} item lg={1} md={1} sm={1} xs={1} sx={uiStyles.midCell}>
                      <h4 style={uiStyles.cellItem}>{item}</h4>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={1} md={1} sm={1} xs={1} sx={uiStyles.leftCell}>
              <h3 style={uiStyles.cellLetter}>{titles.b}</h3>
            </Grid>

            <Grid item lg={1} md={1} sm={1} xs={1} sx={uiStyles.leftCell}>
              <h3 style={uiStyles.cellLetter}>{titles.i}</h3>
            </Grid>
            <Grid item lg={10} md={10} sm={10} xs={10} sx={uiStyles.midCol}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  {i.map((item) => (
                    <Grid id={'btn' + item} key={item} item lg={1} md={1} sm={1} xs={1} sx={uiStyles.midCell}>
                      <h4 style={uiStyles.cellItem}>{item}</h4>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={1} md={1} sm={1} xs={1} sx={uiStyles.leftCell}>
              <h3 style={uiStyles.cellLetter}>{titles.i}</h3>
            </Grid>

            <Grid item lg={1} md={1} sm={1} xs={1} sx={uiStyles.leftCell}>
              <h3 style={uiStyles.cellLetter}>{titles.n}</h3>
            </Grid>
            <Grid item lg={10} md={10} sm={10} xs={10} sx={uiStyles.midCol}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  {n.map((item) => (
                    <Grid id={'btn' + item} key={item} item lg={1} md={1} sm={1} xs={1} sx={uiStyles.midCell}>
                      <h4 style={uiStyles.cellItem}>{item}</h4>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={1} md={1} sm={1} xs={1} sx={uiStyles.leftCell}>
              <h3 style={uiStyles.cellLetter}>{titles.n}</h3>
            </Grid>

            <Grid item lg={1} md={1} sm={1} xs={1} sx={uiStyles.leftCell}>
              <h3 style={uiStyles.cellLetter}>{titles.g}</h3>
            </Grid>
            <Grid item lg={10} md={10} sm={10} xs={10} sx={uiStyles.midCol}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  {g.map((item) => (
                    <Grid id={'btn' + item} key={item} item lg={1} md={1} sm={1} xs={1} sx={uiStyles.midCell}>
                      <h4 style={uiStyles.cellItem}>{item}</h4>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={1} md={1} sm={1} xs={1} sx={uiStyles.leftCell}>
              <h3 style={uiStyles.cellLetter}>{titles.g}</h3>
            </Grid>

            <Grid item lg={1} md={1} sm={1} xs={1} sx={uiStyles.leftCell}>
              <h3 style={uiStyles.cellLetter}>{titles.o}</h3>
            </Grid>
            <Grid item lg={10} md={10} sm={10} xs={10} sx={uiStyles.midCol}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  {o.map((item) => (
                    <Grid id={'btn' + item} key={item} item lg={1} md={1} sm={1} xs={1} sx={uiStyles.midCell}>
                      <h4 style={uiStyles.cellItem}>{item}</h4>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={1} md={1} sm={1} xs={1} sx={uiStyles.leftCell}>
              <h3 style={uiStyles.cellLetter}>{titles.o}</h3>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: 10 }}>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Box sx={{ background: '#FFF', p: 1, borderRadius: 5, pl: 2, pr: 2 }}>
                <h3>{titles.backTitle}</h3>
                <h4>{resultBingo}</h4>
              </Box>
            </Grid>
            {cont == bingoValues.LIMIT ? (
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box sx={{ background: '#179cdc', p: 2, borderRadius: 5, pl: 3, pr: 3 }}>
                  <center>
                    <h3 style={{ color: '#FFF' }}>{titles.endBoard}</h3>
                    <ButtonGroup aria-label="Basic button group">
                      <Button variant="outlined" style={uiStyles.endBtn} onClick={handleSaveBoard} startIcon={<IconDeviceFloppy />}>
                        {titles.saveBoard}
                      </Button>
                      <Button variant="outlined" style={uiStyles.endBtn} onClick={handleReset} startIcon={<IconCirclePlus />}>
                        {titles.newBoard}
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
