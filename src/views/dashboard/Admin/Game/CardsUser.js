import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import {
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  Typography,
  Grid,
  OutlinedInput,
  ButtonGroup,
  ButtonBase,
  Modal
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { createDocument, getGameCardsByEvent, getGamesList, getUsersList, updateDocument } from 'config/firebaseEvents';
import EventCard from 'views/dashboard/Admin/Game/EventCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IconCards, IconCheck, IconX } from '@tabler/icons';
import { uiStyles } from './Game.styles';
import { searchingData } from 'utils/search';
import User1 from 'assets/images/profile/profile-picture-6.jpg';
import { genConst } from 'store/constant';
import { titles } from './Game.texts';
import { fullDate } from 'utils/validations';
import { generateId } from 'utils/idGenerator';
import { collCards, collUserCards } from 'store/collections';

export default function CardsUser() {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeStep, setActiveStep] = useState(0);
  const [eventId, setEventId] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState('');
  const [openCard, setOpenCard] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const [bN, setBN] = useState([]);
  const [iN, setIN] = useState([]);
  const [nN, setNN] = useState([]);
  const [gN, setGN] = useState([]);
  const [oN, setON] = useState([]);
  const [cardN, setCardN] = useState(0);
  const [idCard, setIdCard] = useState(0);
  const [bingo, setBingo] = useState([]);

  const handleStep1 = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleStep2 = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleStep3 = () => {
    console.log(3);
  };

  const steps = [
    {
      label: 'Evento ' + eventName,
      description: 'Selecciona el evento al cual quieres asignar usuario.',
      onClick: handleStep1
    },
    {
      label: 'Usuario ' + userName,
      description: 'Selecciona el usuario al cual quieres asignar cartillas.',
      onClick: handleStep2
    },
    {
      label: 'Asignar Cartillas ',
      description: 'Selecciona una o más cartillas para asignar al usuario seleccionado.',
      onClick: handleStep3
    }
  ];

  const maxSteps = steps.length;

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    getGamesList().then((data) => {
      setEvents(data);
    });
    getUsersList().then((usrs) => {
      setUsers(usrs);
    });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleCloseCard = () => {
    setOpenCard(false);
  };

  console.log(eventId);

  return (
    <Box sx={{ maxWidth: '100%', flexGrow: 1 }}>
      <ToastContainer />
      <Paper
        square
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 50,
          pl: 2,
          bgcolor: 'background.default',
          borderRadius: 3
        }}
      >
        <Typography style={{ fontSize: 18, fontWeight: 'bold' }}>{steps[activeStep].label}</Typography>
      </Paper>
      <Box sx={{ height: '100%', maxWidth: '100%', width: '100%', p: 2 }}>{steps[activeStep].description}</Box>
      <Box sx={{ height: '100%', maxWidth: '100%', width: '100%', p: 2 }}>
        {activeStep === 0 ? (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                {events.map((item, key) => (
                  <Grid key={key} item lg={3} md={3} sm={6} xs={12}>
                    <div
                      onClick={() => {
                        setEventId(item.ide);
                        setEventName(item.name);
                        setEventDate(item.startDate);
                      }}
                      aria-hidden="true"
                      style={{ cursor: 'pointer' }}
                    >
                      <EventCard name={item.name} date={item.startDate} bg={'#00adef'} />
                    </div>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        ) : activeStep === 1 ? (
          <Box>
            <Box sx={{ mt: -3, mb: 1 }}>
              <OutlinedInput
                id={'search'}
                type="text"
                name={'search'}
                onChange={(ev) => setSearch(ev.target.value)}
                placeholder={'Buscar por nombre o apellido'}
                style={{ width: '100%' }}
              />
            </Box>
            <Paper sx={uiStyles.paper}>
              <TableContainer sx={{ maxHeight: '100%' }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell key="id-name" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                        {'Nombre'}
                      </TableCell>
                      <TableCell key="id-email" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                        {'Email'}
                      </TableCell>
                      <TableCell key="id-actions" align="center" style={{ minWidth: 75, fontWeight: 'bold' }}>
                        {'Acciones'}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users
                      .filter(searchingData(search))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((r) => (
                        <TableRow hover key={r.id}>
                          <TableCell align="left">
                            <ButtonGroup>
                              <Avatar src={r.avatar || User1} color="inherit" style={{ width: 32, height: 32 }} />
                              <span style={{ margin: 6 }}>{r.name + ' ' + r.lastName}</span>
                            </ButtonGroup>
                          </TableCell>
                          <TableCell align="left">{r.email}</TableCell>
                          <TableCell align="center">
                            <ButtonGroup variant="contained">
                              <Button
                                style={{ backgroundColor: genConst.CONST_UPDATE_COLOR }}
                                onClick={() => {
                                  setUserId(r.id);
                                  setUserName(r.name + ' ' + r.lastName);
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
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Box>
        ) : (
          <Box sx={{ width: '100%', height: '100%', backgroundColor: '#242526', borderRadius: 4, padding: 2 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container spacing={0.5}>
                  {cards.map((item) => (
                    <Grid key={item.id} item lg={0.5} md={0.5} sm={1} xs={1}>
                      <ButtonBase sx={{ borderRadius: 8 }} disabled={item.state == 1 ? false : true}>
                        <Avatar
                          variant="rounded"
                          color="inherit"
                          sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: item.state == 1 ? '#00adef' : '#525252',
                            width: 30,
                            height: 30,
                            color: '#FFF',
                            '&[aria-controls="menu-list-grow"],&:hover': {
                              background: theme.palette.secondary.light,
                              color: '#FFF'
                            }
                          }}
                          onClick={() => {
                            setIdCard(item.id);
                            setCardN(item.num);
                            setBingo(item.bingoNumbers);
                            setBN(item.b);
                            setIN(item.i);
                            setNN(item.n);
                            setGN(item.g);
                            setON(item.o);
                            setOpenCard(true);
                          }}
                        >
                          <span style={{ color: '#FFF', fontSize: 11.5 }}>{item.order}</span>
                        </Avatar>
                      </ButtonBase>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
      <MobileStepper
        variant="text"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        sx={{ borderRadius: 3 }}
        nextButton={
          <Button
            size="small"
            onClick={() => {
              if (activeStep === 0) {
                if (eventName === '' || eventName === null) {
                  toast.info('Seleccione algun evento!', { position: toast.POSITION.TOP_RIGHT });
                } else {
                  steps[activeStep].onClick();
                }
              }

              if (activeStep === 1) {
                if (userName === '' || userName === null) {
                  toast.info('Seleccione un usuario!', { position: toast.POSITION.TOP_RIGHT });
                } else {
                  steps[activeStep].onClick();
                  getGameCardsByEvent(eventId).then((data) => {
                    setCards(data);
                  });
                }
              }

              if (activeStep === 2) {
                if (userId === '' || userId === null) {
                  toast.info('Seleccione un usuario!', { position: toast.POSITION.TOP_RIGHT });
                } else {
                  steps[activeStep].onClick();
                }
              }
            }}
            disabled={activeStep === maxSteps - 1}
          >
            Siguiente
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            Regresar
          </Button>
        }
      />
      <Modal open={openCard} onClose={handleCloseCard} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.modalCardStyles}>
          <Typography id="modal-modal-title" variant="h3" component="h2" sx={{ textAlign: 'center' }}>
            Cartilla Número: 0000{cardN}
          </Typography>
          <Grid container style={{ marginTop: 20 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
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
                          item == 0 ? (
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
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 3 }}>
                  <center>
                    <ButtonGroup>
                      <Button
                        startIcon={<IconCards />}
                        variant="contained"
                        style={{ color: '#FFF', height: 40 }}
                        onClick={() => {
                          setOpenLoader(true);
                          const ide = generateId(10);
                          const object = {
                            id: ide,
                            idCard: idCard,
                            num: cardN,
                            eventId: eventId,
                            eventName: eventName,
                            eventDate: eventDate,
                            order: parseInt(cardN),
                            b: bN,
                            i: iN,
                            n: nN,
                            g: gN,
                            o: oN,
                            bingoNumbers: bingo,
                            state: 0,
                            createAt: fullDate(),
                            userId: userId,
                            userName: userName
                          };
                          const updateObject = {
                            state: 0,
                            updateAt: fullDate()
                          };
                          updateDocument(collCards, idCard, updateObject);
                          createDocument(collUserCards, ide, object);
                          setTimeout(() => {
                            setOpenLoader(false);
                            toast.success('Asignación realizada!', { position: toast.POSITION.TOP_RIGHT });
                            setOpenCard(false);
                          }, 2000);
                        }}
                      >
                        Comprar
                      </Button>
                      <Button
                        startIcon={<IconX />}
                        variant="outlined"
                        style={{ color: '#00adef', height: 40 }}
                        onClick={() => {
                          setOpenCard(false);
                        }}
                      >
                        Cancelar
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
