import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Modal,
  OutlinedInput,
  Paper,
  Toolbar,
  Typography
} from '@mui/material';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';
import { uiStyles } from './Game.styles';
import { countCardsByEvent, createDocument, deleteDocument, getGameCardsByEvent, getGamesList } from 'config/firebaseEvents';
import { collCards } from 'store/collections';
import CircularProgress from '@mui/material/CircularProgress';
//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IconArrowLeft, IconCalendar, IconCards, IconCheck, IconCircleX, IconEye, IconPlus, IconSearch, IconTrash } from '@tabler/icons';
import MessageDark from 'components/message/MessageDark';
import { titles } from './Game.texts';
import { bingoValues, genConst } from 'store/constant';
import { searchingCard, searchingGameData } from 'utils/search';
import { generateUniqueBingoCards } from 'utils/generateUniqueBingoCards';

export default function CardGame() {
  const theme = useTheme();
  const [bN, setBN] = useState([]);
  const [iN, setIN] = useState([]);
  const [nN, setNN] = useState([]);
  const [gN, setGN] = useState([]);
  const [oN, setON] = useState([]);
  const [event, setEvent] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventPrice, setEventPrice] = useState(0);
  const [cards, setCards] = useState([]);
  const [cardNumber, setCardNumber] = useState(0);
  const [cardN, setCardN] = useState(0);
  const [openLoader, setOpenLoader] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pageC, setPageC] = useState(0);
  const [rowsPerPageC, setRowsPerPageC] = useState(10);
  const [search, setSearch] = useState('');
  const [openCard, setOpenCard] = useState(false);
  const [openCreateCard, setOpenCreateCard] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [gameList, setGameList] = useState([]);
  const [isEvent, setIsEvent] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchEvent, setSearchEvent] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePageC = (event, newPage) => {
    setPageC(newPage);
  };

  const handleChangeRowsPerPageC = (event) => {
    setRowsPerPageC(+event.target.value);
    setPageC(0);
  };

  const handleOpenCard = () => {
    setOpenCard(true);
  };
  const handleCloseCard = () => {
    setOpenCard(false);
  };

  const handleOpenCreateCard = () => {
    setOpenCreateCard(true);
  };
  const handleCloseCreateCard = () => {
    setOpenCreateCard(false);
  };

  useEffect(() => {
    getGamesList().then((data) => {
      setGameList(data);
    });
  }, []);

  const reloadData = () => {
    getGameCardsByEvent(event).then((data) => {
      setCards(data);
      countCardsByEvent(event).then((count) => {
        setCardNumber(count);
      });
    });
  };

  const handleDelete = (id) => {
    setOpenLoader(true);
    deleteDocument(collCards, id);
    setTimeout(() => {
      setOpenLoader(false);
      toast.success(titles.successCardDelete, { position: toast.POSITION.TOP_RIGHT });
      reloadData(event);
    }, 1000);
  };

  const handleGenerateCards = () => {
    if (quantity > 0) {
      setOpenLoader(true);
      const cards = generateUniqueBingoCards(quantity, event, eventName, eventPrice, cardNumber);
      for (let index = 0; index < quantity; index++) {
        createDocument(collCards, cards[index].id, cards[index]);
      }
      setTimeout(() => {
        setOpenLoader(false);
        toast.success(titles.successCardCreate, { position: toast.POSITION.TOP_RIGHT });
        setOpenCreateCard(false);
        reloadData();
      }, parseInt(quantity) * 50);
    } else {
      toast.info('Debe ingresar una cantidad de cartillas para crearlas!', { position: toast.POSITION.TOP_RIGHT });
    }
  };

  return (
    <Box sx={uiStyles.box}>
      <ToastContainer />
      <AppBar position="static" style={uiStyles.appbar}>
        <Toolbar>
          {isEvent ? (
            <IconButton color="inherit" onClick={() => setIsEvent(false)}>
              <IconArrowLeft color="#FFF" />
            </IconButton>
          ) : (
            <IconCalendar color="#FFF" />
          )}
          {isEvent ? (
            <IconButton color="inherit" onClick={() => handleOpenCreateCard()}>
              <IconPlus color="#FFF" />
            </IconButton>
          ) : (
            <></>
          )}
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: '#FFF' }} align="center">
            Generar Cartillas
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => {
              setShowSearch(!showSearch);
            }}
          >
            <IconSearch color="#FFF" />
          </IconButton>
        </Toolbar>
      </AppBar>
      {showSearch &&
        (!isEvent ? (
          <Box sx={{ flexGrow: 0 }}>
            {gameList.length > 0 ? (
              <OutlinedInput
                id={'search'}
                type="text"
                name={'search'}
                onChange={(ev) => setSearchEvent(ev.target.value)}
                placeholder={'Buscar por nombre'}
                style={{ width: '100%', marginTop: 10 }}
              />
            ) : (
              <></>
            )}
          </Box>
        ) : (
          <Box sx={uiStyles.box2}>
            <OutlinedInput
              id="searchField"
              type="text"
              name="searchField"
              onChange={(ev) => setSearch(ev.target.value)}
              placeholder={titles.searchPlace}
              style={{ width: '100%', marginTop: 10 }}
            />
          </Box>
        ))}
      {isEvent ? (
        <></>
      ) : (
        <>
          {gameList.length > 0 ? (
            <Paper style={{ marginTop: 10 }}>
              <TableContainer sx={{ maxHeight: '100%' }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell key="id-id" align="left" style={{ minWidth: 70, fontWeight: 'bold' }}>
                        {titles.tableCell0}
                      </TableCell>
                      <TableCell key="id-evento" align="left" style={{ minWidth: 200, fontWeight: 'bold' }}>
                        {titles.tableCell1}
                      </TableCell>
                      <TableCell key="id-date" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                        {titles.tableCell2}
                      </TableCell>
                      <TableCell key="id-state" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                        {titles.tableCell4}
                      </TableCell>
                      <TableCell key="id-actions" align="center" style={{ minWidth: 75, fontWeight: 'bold' }}>
                        {titles.tableCellActions}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {gameList
                      .filter(searchingGameData(searchEvent))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((r) => (
                        <TableRow hover key={r.id}>
                          <TableCell align="left">{r.ide}</TableCell>
                          <TableCell align="left">{r.name}</TableCell>
                          <TableCell align="left">{r.startDate}</TableCell>
                          <TableCell align="left">
                            {r.state === 1 ? (
                              <span style={{ color: genConst.CONST_SUCCESS_COLOR, fontWeight: 'bold' }}>{bingoValues.STATE_EV_ACT}</span>
                            ) : (
                              <span style={{ color: genConst.CONST_ERROR_COLOR, fontWeight: 'bold' }}>{bingoValues.STATE_EV_INC}</span>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <ButtonGroup variant="contained">
                              <Button
                                style={{ backgroundColor: genConst.CONST_CREATE_COLOR }}
                                onClick={() => {
                                  setEvent(r.ide);
                                  setEventName(r.name);
                                  setIsEvent(true);
                                  setEventPrice(r.price);
                                  setOpenLoader(true);
                                  getGameCardsByEvent(r.ide).then((data) => {
                                    setCards(data);
                                    countCardsByEvent(r.ide).then((count) => {
                                      setCardNumber(count);
                                    });
                                  });
                                  setTimeout(() => {
                                    setOpenLoader(false);
                                  }, 1000);
                                }}
                              >
                                <IconCheck color="#FFF" />
                              </Button>
                            </ButtonGroup>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                labelRowsPerPage={titles.maxRecords}
                component="div"
                count={gameList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          ) : (
            <Grid container style={{ marginTop: 20 }}>
              <Grid item xs={12}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <MessageDark message={titles.loading} submessage="" />
                </Grid>
              </Grid>
            </Grid>
          )}
        </>
      )}
      {isEvent ? (
        <div style={{ marginTop: 10 }}>
          {cards.length > 0 ? (
            <Paper sx={uiStyles.paper}>
              <TableContainer sx={{ maxHeight: '100%' }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell key="id-col1" align="left" style={{ minWidth: 40, fontWeight: 'bold' }}>
                        {'Card ID'}
                      </TableCell>
                      <TableCell key="id-col2" align="left" style={{ minWidth: 40, fontWeight: 'bold' }}>
                        {'Número'}
                      </TableCell>
                      <TableCell key="id-col3" align="left" style={{ minWidth: 40, fontWeight: 'bold' }}>
                        {'Precio'}
                      </TableCell>
                      <TableCell key="id-col4" align="left" style={{ minWidth: 40, fontWeight: 'bold' }}>
                        {'Estado'}
                      </TableCell>
                      <TableCell key="id-col5" align="left" style={{ minWidth: 40, fontWeight: 'bold' }}>
                        {'Fecha'}
                      </TableCell>
                      <TableCell key="id-actions" align="center" style={{ minWidth: 60, fontWeight: 'bold' }}>
                        {'Acciones'}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cards
                      .filter(searchingCard(search))
                      .slice(pageC * rowsPerPageC, pageC * rowsPerPageC + rowsPerPageC)
                      .map((r) => (
                        <TableRow hover key={r.id}>
                          <TableCell align="left">{r.id}</TableCell>
                          <TableCell align="left">{r.num}</TableCell>
                          <TableCell align="left">
                            <b>$ </b>
                            {r.price}
                          </TableCell>
                          <TableCell align="left">
                            {r.state == bingoValues.STATE_AVAILABLE ? (
                              <span style={{ color: genConst.CONST_SUCCESS_COLOR, fontWeight: 'bold' }}>
                                {bingoValues.STATE_DESC_AVAILABLE}
                              </span>
                            ) : (
                              <span style={{ color: genConst.CONST_ERROR_COLOR, fontWeight: 'bold' }}>
                                {bingoValues.STATE_DESC_NOT_AVAILABLE}
                              </span>
                            )}
                          </TableCell>
                          <TableCell align="left">{r.createAt}</TableCell>
                          <TableCell align="center">
                            <ButtonGroup variant="contained">
                              <Button
                                style={{ backgroundColor: genConst.CONST_UPDATE_COLOR, color: '#FFF' }}
                                onClick={() => {
                                  handleOpenCard();
                                  setCardN(r.num);
                                  setBN(r.b);
                                  setIN(r.i);
                                  setNN(r.n);
                                  setGN(r.g);
                                  setON(r.o);
                                }}
                              >
                                <IconEye />
                              </Button>
                              <Button
                                style={{ backgroundColor: genConst.CONST_DELETE_COLOR, color: '#FFF' }}
                                onClick={() => {
                                  handleDelete(r.id);
                                }}
                              >
                                <IconTrash />
                              </Button>
                            </ButtonGroup>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100, 200, 500, 1000]}
                labelRowsPerPage={titles.rowsPerPage}
                component="div"
                count={cards.length}
                rowsPerPage={rowsPerPageC}
                page={pageC}
                onPageChange={handleChangePageC}
                onRowsPerPageChange={handleChangeRowsPerPageC}
              />
            </Paper>
          ) : (
            <Grid container style={{ marginTop: 20 }}>
              <Grid item xs={12}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <MessageDark message={titles.noCardsFound} submessage="" />
                </Grid>
              </Grid>
            </Grid>
          )}
        </div>
      ) : (
        <></>
      )}

      <Modal open={openCard} onClose={handleCloseCard} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.modalStylesDelete}>
          <Typography id="modal-modal-title" variant="h3" component="h3" align="center">
            Cartilla: 0000{cardN}
          </Typography>
          <div style={{ marginTop: 20 }}>
            <center>
              <ButtonGroup aria-label="Basic button group" orientation="vertical">
                <Button variant="contained" style={{ color: '#FFF', fontWeight: 'bold', height: 55, width: 55, borderRadius: 0 }}>
                  B
                </Button>
                {bN.map((item, key) => (
                  <Button key={'b' + key} variant="outlined" style={{ height: 55, width: 55, borderRadius: 0 }}>
                    {item}
                  </Button>
                ))}
              </ButtonGroup>
              <ButtonGroup aria-label="Basic button group" orientation="vertical">
                <Button variant="contained" style={{ color: '#FFF', height: 55, width: 55, borderRadius: 0 }}>
                  I
                </Button>
                {iN.map((item, key) => (
                  <Button key={'i' + key} variant="outlined" style={{ height: 55, width: 55, borderRadius: 0 }}>
                    {item}
                  </Button>
                ))}
              </ButtonGroup>
              <ButtonGroup aria-label="Basic button group" orientation="vertical">
                <Button variant="contained" style={{ color: '#FFF', height: 55, width: 55, borderRadius: 0 }}>
                  N
                </Button>
                {nN.map((item, key) =>
                  item === 'FREE' ? (
                    <Button key={'n' + key} variant="contained" style={{ height: 55, width: 55, color: '#FFF', borderRadius: 0 }}>
                      FREE
                    </Button>
                  ) : (
                    <Button key={'n' + key} variant="outlined" style={{ height: 55, width: 55, borderRadius: 0 }}>
                      {item}
                    </Button>
                  )
                )}
              </ButtonGroup>
              <ButtonGroup aria-label="Basic button group" orientation="vertical">
                <Button variant="contained" style={{ color: '#FFF', height: 55, width: 55, borderRadius: 0 }}>
                  G
                </Button>
                {gN.map((item, key) => (
                  <Button key={'g' + key} variant="outlined" style={{ height: 55, width: 55, borderRadius: 0 }}>
                    {item}
                  </Button>
                ))}
              </ButtonGroup>
              <ButtonGroup aria-label="Basic button group" orientation="vertical">
                <Button variant="contained" style={{ color: '#FFF', height: 55, width: 55, borderRadius: 0 }}>
                  O
                </Button>
                {oN.map((item, key) => (
                  <Button key={'o' + key} variant="outlined" style={{ height: 55, width: 55, borderRadius: 0 }}>
                    {item}
                  </Button>
                ))}
              </ButtonGroup>
            </center>
          </div>
          <Grid container style={{ marginTop: 20 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <ButtonGroup>
                      <Button
                        variant="contained"
                        startIcon={<IconCircleX />}
                        size="large"
                        style={{ backgroundColor: genConst.CONST_CREATE_COLOR, color: '#FFF' }}
                        onClick={handleCloseCard}
                      >
                        {titles.buttonClose}
                      </Button>
                    </ButtonGroup>
                  </center>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Modal
        open={openCreateCard}
        onClose={handleCloseCreateCard}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={uiStyles.modalStyles}>
          <Typography id="modal-modal-title" variant="h3" component="h3" align="center">
            Generar Cartillas
          </Typography>
          <Grid container style={{ marginTop: 20 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                      <InputLabel htmlFor="quantity">
                        <span>*</span> {'Ingrese la cantidad de cartillas a generar'}
                      </InputLabel>
                      <OutlinedInput
                        id={'quantity'}
                        type="number"
                        name={'quantity'}
                        inputProps={{}}
                        onChange={(ev) => setQuantity(Number(ev.target.value))}
                      />
                    </FormControl>
                  </center>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <ButtonGroup>
                      <Button
                        startIcon={<IconCards />}
                        variant="contained"
                        style={{ color: '#FFF', height: 50, width: 180 }}
                        onClick={handleGenerateCards}
                      >
                        Generar
                      </Button>
                    </ButtonGroup>
                  </center>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Modal open={openLoader} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <center>
          <Box sx={uiStyles.modalStylesLoader}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>
    </Box>
  );
}
