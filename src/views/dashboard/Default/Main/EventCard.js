import PropTypes from 'prop-types';
// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';
// project imports
import MainCard from 'components/cards/MainCard';
// assets
import { IconCalendar } from '@tabler/icons';

const EventCard = ({ name, date, bg, id }) => {
  const theme = useTheme();
  const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: bg,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      width: 210,
      height: 210,
      background: 'rgba(255,255,255,0.7)',
      borderRadius: '50%',
      top: -85,
      right: -95,
      [theme.breakpoints.down('sm')]: {
        top: -105,
        right: -140
      }
    }
  }));
  return (
    <CardWrapper border={false} content={false}>
      <Box sx={{ p: 2.25 }}>
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
                <Typography sx={{ fontSize: '1.3rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75, color: '#FFF' }}>
                  Próximo Evento
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems="center">
              <Grid item lg={12}>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75, color: '#FFF' }}>{name}</Typography>
              </Grid>
              <Grid item lg={12}>
                <Typography sx={{ fontSize: '1rem', fontWeight: 500, mr: 1, mt: 1, mb: 1, color: '#FFF' }}>{date}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sx={{ mt: 1 }}>
            <Button
              variant="contained"
              size="large"
              style={{ background: '#FFF', color: '#00adef' }}
              onClick={() => {
                console.log(id);
              }}
            >
              Compra tus Cartillas
            </Button>
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
  id: PropTypes.string
};

export default EventCard;
