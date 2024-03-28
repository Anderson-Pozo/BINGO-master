import { useSearchParams } from 'react-router-dom';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Grid, Modal, Typography, ButtonGroup, Button } from '@mui/material';
import MessageDark from 'components/message/MessageDark';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { createDocument, getGameCards, updateDocument } from 'config/firebaseEvents';
import { IconCards, IconShoppingCart, IconX } from '@tabler/icons';
import { uiStyles } from './styles';
import { fullDate } from 'utils/validations';
import { onAuthStateChanged } from 'firebase/auth';
import { generateId } from 'utils/idGenerator';
import { authentication } from 'config/firebase';
import { collCards, collUserCards } from 'store/collections';
//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CardSelector = () => {
  //let navigate = useNavigate();
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const name = searchParams.get('name');
  const date = searchParams.get('date');
  const [cards, setCards] = useState([]);
  const [openCard, setOpenCard] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const [cardN, setCardN] = useState(0);
  const [idCard, setIdCard] = useState(0);
  const [bingo, setBingo] = useState([]);
  const [userId, setUserId] = useState('');
  const [bN, setBN] = useState([]);
  const [iN, setIN] = useState([]);
  const [nN, setNN] = useState([]);
  const [gN, setGN] = useState([]);
  const [oN, setON] = useState([]);

  useEffect(() => {
    onAuthStateChanged(authentication, async (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
    getGameCards().then((data) => {
      setCards(data);
    });
  }, []);

  const reloadData = () => {
    getGameCards().then((data) => {
      setCards(data);
    });
  };

  const handleCloseCard = () => {
    setOpenCard(false);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', backgroundColor: '#FFF', borderRadius: 4, padding: 2 }}>
      <ToastContainer />
      <MessageDark message={name} submessage={date} />
      <h3 hidden>{id}</h3>
      <Grid container direction="column" sx={{ mt: 1 }}>
        <Grid item>
          <Grid container spacing={0.3}>
            <Grid item lg={12} md={12} sm={12}>
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
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Modal open={openCard} onClose={handleCloseCard} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.modalStyles}>
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
                        startIcon={<IconShoppingCart />}
                        variant="outlined"
                        style={{ color: '#00adef', height: 40 }}
                        onClick={() => {
                          console.log('clic');
                        }}
                      >
                        Agregar
                      </Button>
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
                            eventId: id,
                            eventName: name,
                            eventDate: date,
                            order: parseInt(cardN),
                            b: bN,
                            i: iN,
                            n: nN,
                            g: gN,
                            o: oN,
                            bingoNumbers: bingo,
                            state: 0,
                            createAt: fullDate(),
                            userId: userId
                          };
                          const updateObject = {
                            state: 0,
                            updateAt: fullDate()
                          };
                          updateDocument(collCards, idCard, updateObject);
                          createDocument(collUserCards, ide, object);
                          setTimeout(() => {
                            setOpenLoader(false);
                            reloadData();
                            toast.success('Compra realizada!', { position: toast.POSITION.TOP_RIGHT });
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
          <Box sx={uiStyles.loader}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>
    </Box>
  );
};

export default CardSelector;
