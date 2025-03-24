import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Grid, Typography, Pagination, Stack, CircularProgress } from '@mui/material';
import { getGameCardsByEventPaginated, checkCardAvailability } from 'config/firebaseEvents';
import StateTickets from 'components/StateTickets';
import ItemBingo from 'components/bingo/ItemBingo';
import CustomModal from 'components/Modal';
import BingoCard from 'components/bingo/BingoCard';
import { toast } from 'react-toastify';

export const SelectCardStep = ({ event, selectedItems, setSelectedItems }) => {
  const theme = useTheme();
  const [cards, setCards] = useState([]);
  const [cardN, setCardN] = useState(0);
  const [bingoNumbers, setBingoNumbers] = useState({ bN: [], iN: [], nN: [], gN: [], oN: [] });
  const [openCard, setOpenCard] = useState(false);

  // Pagination states
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const rowsPerPage = 48;

  useEffect(() => {
    const fetchCards = async () => {
      if (!event?.ide) return;

      setLoading(true);
      try {
        const { cards: fetchedCards, totalCount } = await getGameCardsByEventPaginated(event.ide, page, rowsPerPage);
        setCards(fetchedCards);
        setTotalPages(Math.ceil(totalCount / rowsPerPage));
      } catch (error) {
        console.error('Error fetching cards:', error);
        showNotification('Error al cargar las cartillas', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [event?.ide, page]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1); // MUI Pagination is 1-indexed, but our API is 0-indexed
  };

  const handleSelect = async (item) => {
    // Check if item is already selected by ID
    const isSelected = selectedItems.some((selected) => selected.id === item.id);

    if (isSelected) {
      // Si ya está seleccionada, solo la quitamos
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

  return (
    <Grid container direction="column">
      <StateTickets />
      <Box sx={{ width: '100%', height: '100%', backgroundColor: '#242526', borderRadius: 4, padding: 2 }}>
        <Grid container direction="column">
          <Grid item>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={0.5}>
                {cards?.map((item) => {
                  // Use isCardSelected helper to determine color
                  const buttonColor = item.state === 0 ? '#525252' : isCardSelected(item.id) ? 'green' : '#00adef';
                  return (
                    <Grid key={item.id} item lg={0.5} md={0.5} sm={1} xs={1}>
                      <ButtonBase sx={{ borderRadius: 8 }} disabled={item.state == 1 ? false : true || checkingAvailability}>
                        <Avatar
                          variant="rounded"
                          color="inherit"
                          sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: buttonColor,
                            width: 30,
                            height: 30,
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
                          <span style={{ color: '#FFF', fontSize: 11.5 }}>{item.order}</span>
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
      {totalPages > 1 && (
        <Grid item sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
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
        <Box sx={{ width: '100%', height: '100%', backgroundColor: '#FFF', borderRadius: 4, padding: 2, mt: 1 }}>
          <Typography id="modal-modal-title" variant="h5" component="h4" sx={{ textAlign: 'center', mt: 1, mb: 1 }}>
            Resumen de cartillas seleccionadas
          </Typography>
          <Grid container spacing={6}>
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
        </Box>
      </Grid>
      <CustomModal open={openCard} handleClose={() => setOpenCard(false)} title={'Cartilla Número: ' + cardN} width={400}>
        <Grid container style={{ marginTop: 20 }}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <BingoCard bN={bingoNumbers.bN} iN={bingoNumbers.iN} nN={bingoNumbers.nN} gN={bingoNumbers.gN} oN={bingoNumbers.oN} />
          </Grid>
        </Grid>
      </CustomModal>
    </Grid>
  );
};

SelectCardStep.propTypes = {
  event: PropTypes.object.isRequired,
  selectedItems: PropTypes.array.isRequired,
  setSelectedItems: PropTypes.func.isRequired
};
