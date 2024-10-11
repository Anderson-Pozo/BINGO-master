import PropTypes from 'prop-types';
import { useNavigate, createSearchParams } from 'react-router-dom';
// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Button, ButtonGroup, Grid, Typography } from '@mui/material';
// project imports
import MainCard from 'components/cards/MainCard';
// assets
import { IconCalendar, IconFileDollar, IconPlayCard } from '@tabler/icons';

const EventCard = ({ name, date, bg, id, transmition }) => {
  const theme = useTheme();
  let navigate = useNavigate();
  const CardWrapper = styled(MainCard)(() => ({
    backgroundColor: bg,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative'
  }));
  return (
    <CardWrapper border={false} content={false}>
      <Box sx={{ p: 2 }}>
        <Grid container direction="column">
          <Grid item>
            <Grid container>
              <Grid item lg={2}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.largeAvatar,
                    backgroundColor: '#FFF',
                    mt: 1
                  }}
                >
                  <IconCalendar />
                </Avatar>
              </Grid>
              <Grid item lg={10}>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: 500, ml: 2, mr: 1, mt: 1.75, mb: 0.75, color: '#FFF' }}>
                  {name}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems="center">
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Typography textAlign={'center'} sx={{ fontSize: '0.9rem', fontWeight: 500, mr: 2, mt: 1, mb: 0.75, color: '#FFF' }}>
                  Fecha evento: {date}
                </Typography>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <ButtonGroup fullWidth sx={{ mt: 1 }}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<IconFileDollar />}
                    sx={{
                      background: '#FFF',
                      color: '#00adef',
                      '&:hover': {
                        backgroundColor: '#00adef',
                        color: '#FFF'
                      }
                    }}
                    onClick={() => {
                      navigate({
                        pathname: '/app/card-selector',
                        search: createSearchParams({ id: id, name: name, date: date, transmition: transmition }).toString()
                      });
                    }}
                  >
                    <span style={{ fontSize: 10 }}>COMPRAR</span>
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<IconPlayCard />}
                    sx={{
                      background: '#FFF',
                      color: '#00adef',
                      '&:hover': {
                        backgroundColor: '#00adef',
                        color: '#FFF'
                      }
                    }}
                    onClick={() => {
                      navigate({
                        pathname: '/app/play-bingo',
                        search: createSearchParams({ id: id, name: name, date: date, transmition: transmition }).toString()
                      });
                    }}
                  >
                    <span style={{ fontSize: 10 }}>JUGAR</span>
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </CardWrapper>
  );
};

EventCard.propTypes = {
  name: PropTypes.string,
  date: PropTypes.string,
  bg: PropTypes.string,
  id: PropTypes.string,
  transmition: PropTypes.string
};

export default EventCard;
