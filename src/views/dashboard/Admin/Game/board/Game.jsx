import React, { useEffect, useState } from 'react';
import { ButtonGroup, Button, Box, Modal, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
//Notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { checkForBingoWinner } from 'config/firebaseEvents';
import { uiStyles } from '../Game.styles';
import { bingoValues } from 'store/constant';
import { titles } from '../Game.texts';
import Confetti from 'react-confetti';
import { ShowWinner } from './ShowWinner';
import { ConfirmFinish } from './ConfirmFinish';
import { SelectEventGame } from './SelectEventGame';
import { BoardGame } from './BoardGame';
import { BoardActions } from './BoardActions';

export default function Game() {
  const [openLoader, setOpenLoader] = useState(false);
  const [showGameBoard, setShowGameBoard] = useState(false);
  const [selectedGame, setSelectedGame] = useState('');
  const [cont, setCont] = useState(0);
  const [bingoNumbers, setBingoNumbers] = useState([]);

  const [number, setNumber] = useState(0);
  const [letter, setLetter] = useState('');
  const [prevNumber, setPrevNumber] = useState(0);
  const [prevLetter, setPrevLetter] = useState('');
  const [resultBingo, setResultBingo] = useState('');

  const [games, setGames] = useState([]);
  const [winner, setWinner] = useState(null);
  const [showWinner, setShowWinner] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);
  const [checkingWinner, setCheckingWinner] = useState(false);

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
      // if (cont == bingoValues.LIMIT - 1) {
      //   setVisible(false);
      // }
    }
  };

  const handleSelectBall = (id) => {
    document.getElementById('btn' + id).style.background = '#26c4fb';
    document.getElementById('btn' + id).style.color = '#FFF';
  };

  const handlePrev = (n, l) => {
    setPrevNumber(n);
    setPrevLetter(l);
  };

  const handleReset = () => {
    window.location.reload();
  };

  const handleCloseWinner = () => {
    setShowWinner(false);
  };

  useEffect(() => {
    const checkWinner = async () => {
      setCheckingWinner(true);
      try {
        const winnerData = await checkForBingoWinner(selectedGame, bingoNumbers);
        if (winnerData) {
          setWinner(winnerData);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 10000);
        }
      } catch (error) {
        console.error('Error checking winner:', error);
      } finally {
        setCheckingWinner(false);
      }
    };

    if (bingoNumbers.length > 0) {
      checkWinner();
    }
  }, [bingoNumbers, selectedGame]);

  const currentGame = games.find((game) => game.ide === selectedGame);

  if (!showGameBoard) {
    return (
      <SelectEventGame
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
        setShowGameBoard={setShowGameBoard}
        games={games}
        setGames={setGames}
      />
    );
  }

  return (
    <>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <Box sx={uiStyles.box}>
        <ToastContainer />
        <center>
          <Typography variant="h2" style={{ color: '#04acec', fontWeight: 'bold', fontSize: 24, marginBottom: 10 }}>
            Jugando: {currentGame?.name}
          </Typography>
          <ButtonGroup aria-label="Basic button group">
            <Button variant="contained" style={uiStyles.btnMain} onClick={handleNextBall} disabled={winner !== null || checkingWinner}>
              {checkingWinner ? (
                <>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Comprobando...
                </>
              ) : (
                titles.next
              )}
            </Button>
            <Button variant="outlined" style={uiStyles.btnCount}>
              <h2>{cont}</h2>
            </Button>
            <Button variant="contained" style={uiStyles.btnMain} onClick={handleReset} disabled={checkingWinner}>
              {titles.restart}
            </Button>
          </ButtonGroup>
        </center>

        {/* Tablero de juego  */}
        <BoardGame letter={letter} number={number} prevNumber={prevNumber} prevLetter={prevLetter} />

        <BoardActions
          resultBingo={resultBingo}
          winner={winner}
          setShowConfirmFinish={setShowConfirmFinish}
          setShowWinner={setShowWinner}
          setOpenLoader={setOpenLoader}
          bingoNumbers={bingoNumbers}
          selectedGame={selectedGame}
        />
        <ShowWinner showWinner={showWinner} handleCloseWinner={handleCloseWinner} winner={winner} />
        <ConfirmFinish showConfirmFinish={showConfirmFinish} setShowConfirmFinish={setShowConfirmFinish} />
        <Modal open={openLoader} aria-labelledby="modal-loader" aria-describedby="modal-loader">
          <center>
            <Box sx={uiStyles.styleLoader}>
              <CircularProgress color="info" size={100} />
            </Box>
          </center>
        </Modal>
      </Box>
    </>
  );
}
