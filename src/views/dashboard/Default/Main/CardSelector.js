import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import validator from 'validator';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  ButtonBase,
  Grid,
  Modal,
  Typography,
  ButtonGroup,
  Button,
  OutlinedInput,
  InputAdornment,
  Tooltip
} from '@mui/material';
import MessageDark from 'components/message/MessageDark';
import CircularProgress from '@mui/material/CircularProgress';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import PayPalButton from './PayPalButton';
import { createDocument, getGameCardsByEvent } from 'config/firebaseEvents';
import { IconBrandPaypal, IconCreditCard } from '@tabler/icons';
import { uiStyles } from './styles';
import { generateId } from 'utils/idGenerator';
//Notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth';
import { authentication } from 'config/firebase';
import { fullDate } from 'utils/validations';
import { collUserCards } from 'store/collections';
import StateTickets from 'components/StateTickets';

const CardSelector = () => {
  //let navigate = useNavigate();
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const name = searchParams.get('name');
  const date = searchParams.get('date');
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [cards, setCards] = useState([]);
  const [openCard, setOpenCard] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const [cardN, setCardN] = useState(0);
  const [total, setTotal] = useState(0);
  const [bN, setBN] = useState([]);
  const [iN, setIN] = useState([]);
  const [nN, setNN] = useState([]);
  const [gN, setGN] = useState([]);
  const [oN, setON] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  ////CARD PAYMENT
  const [openPayment, setOpenPayment] = useState(false);
  const [openPayPal, setOpenPayPal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [focus, setFocus] = useState('');

  useEffect(() => {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        setUserId(user.uid);
        setUserName(user.displayName);
      }
    });
    getGameCardsByEvent(id).then((data) => {
      setCards(data);
    });
  }, [id]);

  const handleCloseCard = () => {
    setOpenCard(false);
  };

  const handleSelect = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((selected) => selected.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleInputFocus = (e) => {
    setFocus(e.target.name);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'number':
        if (value.length <= 16 && /^\d*$/.test(value)) {
          setCardNumber(value);
        }
        break;
      case 'cardName':
        setCardName(value);
        break;
      case 'expiry':
        var formattedExpiry = value.replace(/[^0-9]/g, ''); // Permitir solo números
        if (formattedExpiry.length === 2 && expiry.length < 3) {
          formattedExpiry += '/'; // Insertar la barra después de MM
        }
        setExpiry(formattedExpiry);
        break;
      case 'cvc':
        if (value.length <= 3 && /^\d*$/.test(value)) {
          setCvc(value);
        }
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar los campos antes de enviar al backend
    if (!validator.isCreditCard(cardNumber)) {
      toast.warn('Número de tarjeta no es válido!', { position: toast.POSITION.TOP_RIGHT });
      return;
    }
    if (!validator.isLength(cvc, { min: 3, max: 4 })) {
      toast.warn('CVC no es válido!', { position: toast.POSITION.TOP_RIGHT });
      return;
    }
    if (!validator.isLength(expiry, { min: 4, max: 4 })) {
      toast.warn('Vencimiento no es válido!', { position: toast.POSITION.TOP_RIGHT });
      return;
    }

    // Preparar los datos para enviar al backend
    const paymentData = {
      cardNumber,
      name,
      expiry,
      cvc
    };
    setOpenLoader(true);
    selectedItems.forEach((item) => {
      console.log(`Ítem agregado: ${item.num} - Precio: $30`);
      const ide = generateId(10);
      const object = {
        b: item.b,
        bingoNumbers: item.bingoNumbers,
        createAt: fullDate(),
        eventDate: item.eventDate,
        eventId: item.eventId,
        eventName: item.eventName,
        g: item.g,
        i: item.i,
        id: ide,
        idCard: item.id,
        n: item.n,
        num: item.num,
        o: item.o,
        order: item.order,
        state: 0,
        userId: userId,
        userName: userName
      };
      console.log(object);
      const idReg = generateId(10);
      createDocument(collUserCards, idReg, object);
    });
    setTimeout(() => {
      console.log('Enviando datos de pago', paymentData);
      setOpenLoader(false);
    }, 3000);
    // fetch('/api/pay', { method: 'POST', body: JSON.stringify(paymentData) ... })
  };

  const handleOpenPayment = () => {
    setOpenPayment(true);
  };
  const handleClosePayment = () => {
    setOpenPayment(false);
  };

  const handleOpenPayPal = () => {
    setOpenPayPal(true);
  };
  const handleClosePayPal = () => {
    setOpenPayPal(false);
  };

  return (
    <div>
      <ToastContainer />
      <MessageDark message={name} submessage={date} />
      <h3 hidden>{id}</h3>
      {cards.length > 0 ? (
        <Grid container direction="column" sx={{ mt: 1 }}>
          <Grid item>
            <Typography id="modal-modal-title" variant="h5" component="h4" align="center" sx={{ mt: 1, mb: 1 }}>
              Selecciona las Cartillas que deseas comprar
            </Typography>
            <StateTickets />
            <Grid container spacing={0.3}>
              <Grid item lg={12} md={12} sm={12}>
                <Box sx={{ width: '100%', height: '100%', backgroundColor: '#242526', borderRadius: 4, padding: 2 }}>
                  <Grid container direction="column">
                    <Grid item>
                      <Grid container spacing={0.5}>
                        {cards.map((item) => {
                          const buttonColor = item.state === 0 ? '#525252' : selectedItems.includes(item) ? 'green' : '#00adef';
                          return (
                            <Grid key={item.id} item lg={0.5} md={0.5} sm={1} xs={1}>
                              <ButtonBase
                                sx={{ borderRadius: 8, cursor: item.state === 1 ? 'pointer' : 'not-allowed' }}
                                disabled={item.state == 1 ? false : true}
                              >
                                <Avatar
                                  variant="rounded"
                                  color="inherit"
                                  sx={{
                                    ...theme.typography.commonAvatar,
                                    ...theme.typography.mediumAvatar,
                                    transition: 'all .2s ease-in-out',
                                    backgroundColor: buttonColor,
                                    width: 28,
                                    height: 28,
                                    color: '#FFF',
                                    '&[aria-controls="menu-list-grow"],&:hover': {
                                      background: theme.palette.secondary.light,
                                      color: '#FFF'
                                    }
                                  }}
                                  onClick={() => {
                                    handleSelect(item);
                                  }}
                                >
                                  <span style={{ color: '#FFF', fontSize: 12 }}>{item.order}</span>
                                </Avatar>
                              </ButtonBase>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item lg={12} md={12} sm={12}>
                <div>
                  <Box sx={{ width: '100%', height: '100%', backgroundColor: '#FFF', borderRadius: 4, padding: 2, mt: 1 }}>
                    <Typography id="modal-modal-title" variant="h5" component="h4" sx={{ textAlign: 'center', mt: 1, mb: 1 }}>
                      Resumen de cartillas seleccionadas
                    </Typography>
                    <Grid container spacing={1}>
                      {selectedItems.map((item) => (
                        <Grid key={item.id} item lg={0.5} md={0.5} sm={1} xs={1}>
                          <Tooltip title="Clic para ver cartilla">
                            <Avatar
                              variant="rounded"
                              color="inherit"
                              sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                transition: 'all .2s ease-in-out',
                                backgroundColor: '#00adef',
                                width: 40,
                                height: 40,
                                color: '#FFF',
                                '&[aria-controls="menu-list-grow"],&:hover': {
                                  background: theme.palette.secondary.light,
                                  color: '#FFF'
                                }
                              }}
                              onClick={() => {
                                setCardN(item.num);
                                setBN(item.b);
                                setIN(item.i);
                                setNN(item.n);
                                setGN(item.g);
                                setON(item.o);
                                setOpenCard(true);
                              }}
                            >
                              <span style={{ color: '#FFF', fontSize: 15 }}>{item.num}</span>
                            </Avatar>
                          </Tooltip>
                        </Grid>
                      ))}
                    </Grid>
                    <center>
                      <Tooltip title="Pagar con Paymentez">
                        <Button
                          color="primary"
                          disabled={selectedItems.length === 0}
                          startIcon={<IconCreditCard />}
                          variant="contained"
                          style={{ color: '#FFF', height: 40, marginTop: 20 }}
                          onClick={() => {
                            handleOpenPayment();
                            setTotal(selectedItems.reduce((total, item) => total + Number(item.price), 0));
                          }}
                        >
                          <p>PAGAR ${selectedItems.reduce((total, item) => total + Number(item.price), 0)}</p>
                        </Button>
                      </Tooltip>
                      <Tooltip title="Pagar con PayPal">
                        <Button
                          color="primary"
                          disabled={selectedItems.length === 0}
                          startIcon={<IconBrandPaypal />}
                          variant="contained"
                          style={{ color: '#FFF', height: 40, marginTop: 20, marginLeft: 10 }}
                          onClick={() => {
                            handleOpenPayPal();
                            setTotal(selectedItems.reduce((total, item) => total + Number(item.price), 0));
                          }}
                        >
                          <p>PayPal ${selectedItems.reduce((total, item) => total + Number(item.price), 0)}</p>
                        </Button>
                      </Tooltip>
                    </center>
                  </Box>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid container style={{ marginTop: 20 }}>
          <Grid item xs={12}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <MessageDark message={'No existen cartillas para este evento!'} submessage="" />
            </Grid>
          </Grid>
        </Grid>
      )}
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
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 3 }}>
                  <center>
                    <ButtonGroup>
                      <Button
                        variant="contained"
                        style={{ color: '#FFF', height: 40 }}
                        onClick={() => {
                          setOpenCard(false);
                        }}
                      >
                        Cerrar
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
        open={openPayment}
        onClose={handleClosePayment}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={uiStyles.modalPayment}>
          <Typography id="modal-modal-title" variant="h3" component="h3" align="center">
            Pagar <b>$ </b> {total}
          </Typography>
          <div style={{ marginTop: 20 }}>
            <center>
              <div id="PaymentForm">
                <Cards number={cardNumber} name={name} expiry={expiry} cvc={cvc} focused={focus} />
                <form id="card-form" onSubmit={handleSubmit}>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    {/* Número de Tarjeta */}
                    <Grid item xs={12}>
                      <OutlinedInput
                        name="number"
                        value={cardNumber}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        placeholder="Número de tarjeta"
                        inputProps={{ maxLength: 16 }}
                        startAdornment={<InputAdornment position="start">💳</InputAdornment>}
                        fullWidth
                      />
                    </Grid>

                    {/* Nombre en la Tarjeta */}
                    <Grid item xs={12}>
                      <OutlinedInput
                        name="cardName"
                        value={cardName}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        placeholder="Nombre en la tarjeta"
                        fullWidth
                      />
                    </Grid>

                    {/* Fecha de Expiración */}
                    <Grid item xs={6}>
                      <OutlinedInput
                        name="expiry"
                        value={expiry}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        placeholder="MM/AA"
                        inputProps={{ maxLength: 5 }}
                        fullWidth
                      />
                    </Grid>

                    {/* CVC */}
                    <Grid item xs={6}>
                      <OutlinedInput
                        name="cvc"
                        value={cvc}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        placeholder="CVC"
                        type="password"
                        inputProps={{ maxLength: 3 }}
                        fullWidth
                      />
                    </Grid>

                    {/* Botón de Pago */}
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        style={{
                          backgroundColor: '#009ee3',
                          height: 40,
                          borderRadius: 5,
                          padding: 12,
                          color: '#FFF',
                          marginTop: 0
                        }}
                      >
                        Pagar
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </div>
            </center>
          </div>
        </Box>
      </Modal>
      <Modal open={openPayPal} onClose={handleClosePayPal} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.modalPayment}>
          <Typography id="modal-modal-title" variant="h3" component="h3" align="center">
            Pagar <b>$ </b> {total}
          </Typography>
          <div style={{ marginTop: 20 }}>
            <center>
              <PayPalScriptProvider
                options={{
                  'client-id': 'AaPgorgNdJSFjdNLhd-TYYEjHyILNwarVBEM3PAtDFHaq92n0JEYhAHyxcFprWJ28NF3TqEp65Y5p4wO'
                }}
              >
                <center>
                  <div style={{ width: '100%' }}>
                    <PayPalButton invoice={name + ' / ' + date} totalValue={total} />
                  </div>
                </center>
              </PayPalScriptProvider>
            </center>
          </div>
        </Box>
      </Modal>
      <Modal open={openLoader} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <center>
          <Box sx={uiStyles.loader}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>
    </div>
  );
};

export default CardSelector;
