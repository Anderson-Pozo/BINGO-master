import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Grid, Modal, Typography, Pagination, Stack } from '@mui/material';
import MessageDark from 'components/message/MessageDark';
import CircularProgress from '@mui/material/CircularProgress';
import { getGameCardsByEvent, getGameCardsByEventPaginated, checkCardAvailability } from 'config/firebaseEvents';
import { uiStyles } from './styles';
//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth';
import { authentication } from 'config/firebase';
import StateTickets from 'components/StateTickets';
import BingoCard from 'components/bingo/BingoCard';
import CustomModal from 'components/Modal';
import ItemBingo from 'components/bingo/ItemBingo';
import PayPhoneButton from './PayphoneButton';

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
  const [bingoNumbers, setBingoNumbers] = useState({ bN: [], iN: [], nN: [], gN: [], oN: [] });
  const [selectedItems, setSelectedItems] = useState([]);

  // Pagination states
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const rowsPerPage = 48;

  useEffect(() => {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        setUserId(user.uid);
        setUserName(user.displayName);
      }
    });

    const fetchCards = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const { cards: fetchedCards, totalCount } = await getGameCardsByEventPaginated(id, page, rowsPerPage);
        setCards(fetchedCards);
        setTotalPages(Math.ceil(totalCount / rowsPerPage));
      } catch (error) {
        console.error('Error fetching cards:', error);
        toast.error('Error al cargar las cartillas');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [id, page]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1); // MUI Pagination is 1-indexed, but our API is 0-indexed
  };

  const handleSelect = async (item) => {
    if (selectedItems.some((selected) => selected.id === item.id)) {
      setSelectedItems(selectedItems.filter((selected) => selected.id !== item.id));
      return;
    }

    // Verificar disponibilidad antes de seleccionarla
    setCheckingAvailability(true);
    try {
      const { available, message } = await checkCardAvailability(item.id);

      if (available) {
        setSelectedItems([...selectedItems, item]);
      } else {
        toast.info(message || 'Esta cartilla no está disponible');
        // Actualizar el estado de la cartilla en la lista local
        const updatedCards = cards.map((card) => {
          if (card.id === item.id) {
            return { ...card, state: 0 }; // Marcar como no disponible
          }
          return card;
        });

        setCards(updatedCards);
      }
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Helper function to check if a card is selected by ID
  const isCardSelected = (cardId) => {
    return selectedItems.some((item) => item.id === cardId);
  };

  const totalToPay = selectedItems.reduce((total, item) => total + Number(item.price), 0);
  const selectedTickets = selectedItems.map((item) => item.num).join('-');
  const invoiceData = {
    userId: userId,
    userName: userName,
    reference: `Cartillas: ${selectedTickets}`,
    cards: selectedItems,
    eventId: id
  };

  return (
    <div>
      <ToastContainer />
      <MessageDark message={name} submessage={date} />
      <h3 hidden>{id}</h3>
      {cards.length > 0 || loading ? (
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
                      {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                          <CircularProgress color="info" />
                        </Box>
                      ) : (
                        <Grid container spacing={0.5}>
                          {cards.map((item) => {
                            const buttonColor = item.state === 0 ? '#525252' : isCardSelected(item.id) ? 'green' : '#00adef';
                            return (
                              <Grid key={item.id} item lg={0.5} md={0.5} sm={1} xs={1}>
                                <ButtonBase
                                  sx={{ borderRadius: 8, cursor: item.state === 1 ? 'pointer' : 'not-allowed' }}
                                  disabled={item.state == 1 ? false : true || checkingAvailability}
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
                      )}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              {totalPages > 1 && (
                <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Stack spacing={2}>
                    <Pagination
                      count={totalPages}
                      page={page + 1}
                      onChange={handlePageChange}
                      color="primary"
                      variant="outlined"
                      shape="rounded"
                      disabled={loading || checkingAvailability}
                    />
                  </Stack>
                </Grid>
              )}
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
                      <PayPhoneButton totalValue={totalToPay} invoiceData={invoiceData} disabled={selectedItems.length === 0} />
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
