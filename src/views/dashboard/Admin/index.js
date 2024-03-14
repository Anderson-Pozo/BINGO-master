import { useEffect, useState } from 'react';
// material-ui
import { Grid } from '@mui/material';
// data
import { gridSpacing } from 'store/constant';
//Firebase
import { countAdminUser, countCards, countGames, countUser } from 'config/firebaseEvents';
//Components
import TotalCard from 'components/cards/TotalCard';
import TotalYellowCard from 'components/cards/TotalYellowCard';
import EarningCard from 'components/cards/EarningCard';
import EarningBlueCard from 'components/cards/EarningBlueCard';
import EarningRedCard from 'components/cards/EarningRedCard';
import EarningGreenCard from 'components/cards/EarningGreenCard';

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalAdminUsers, setTotalAdminUsers] = useState(null);
  const [totalCards, setTotalCards] = useState(null);
  const [totalGames, setTotalGames] = useState(null);

  useEffect(() => {
    countUser().then((count) => {
      setTotalUsers(count);
    });
    countAdminUser().then((count) => {
      setTotalAdminUsers(count);
    });
    countCards().then((count) => {
      setTotalCards(count);
    });
    countGames().then((count) => {
      setTotalGames(count);
    });
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item sm={6} xs={6} md={6} lg={3}>
            <TotalCard total={totalUsers} detail="Usuarios" />
          </Grid>
          <Grid item sm={6} xs={6} md={6} lg={3}>
            <TotalCard total={totalAdminUsers} detail="Administradores" />
          </Grid>
          <Grid item sm={6} xs={6} md={6} lg={3}>
            <TotalYellowCard total={totalGames} detail="Eventos" />
          </Grid>
          <Grid item sm={6} xs={6} md={6} lg={3}>
            <TotalYellowCard total={totalCards} detail="Cartillas" />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={6} hidden>
            <EarningCard total={0} detail="Ingresos" />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={6} hidden>
            <EarningBlueCard total={0} detail="Beneficio" />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={6} hidden>
            <EarningGreenCard total={0} detail="Pagado" />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={6} hidden>
            <EarningRedCard total={0} detail="Pendiente" />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
