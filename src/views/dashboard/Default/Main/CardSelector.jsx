import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import validator from 'validator';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Grid, Modal, Typography, Button, OutlinedInput, InputAdornment, Tooltip } from '@mui/material';
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
import BingoCard from 'components/bingo/BingoCard';
import CustomModal from 'components/Modal';
import ItemBingo from 'components/bingo/ItemBingo';

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
  const [bingoNumbers, setBingoNumbers] = useState({ bN: [], iN: [], nN: [], gN: [], oN: [] });
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
        var formattedExpiry = value.replace(/[^0-9]/g, '');
        if (formattedExpiry.length === 2 && expiry.length < 3) {
          formattedExpiry += '/';
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

  const handleOpenPayPal = () => {
    setOpenPayPal(true);
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
                          <ItemBingo
                            title="Clic para ver cartilla"
                            item={item}
                            setCardN={setCardN}
                            setBingoNumbers={setBingoNumbers}
                            setOpenCard={setOpenCard}
                            theme={theme}
                          />
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
      <CustomModal open={openCard} handleClose={() => setOpenCard(false)} title={'Cartilla Número: ' + cardN} width={400}>
        <Grid container style={{ marginTop: 20 }}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <BingoCard bN={bingoNumbers.bN} iN={bingoNumbers.iN} nN={bingoNumbers.nN} gN={bingoNumbers.gN} oN={bingoNumbers.oN} />
          </Grid>
        </Grid>
      </CustomModal>
      <CustomModal open={openPayment} handleClose={() => setOpenPayment(false)} title={'Pagar $ ' + total} width={400}>
        <Grid container style={{ marginTop: 20 }}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
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
          </Grid>
        </Grid>
      </CustomModal>
      <CustomModal open={openPayPal} handleClose={() => setOpenPayPal(false)} title={'Pagar $ ' + total} width={400}>
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
      </CustomModal>
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
