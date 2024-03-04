import { useEffect, useState } from 'react';
// material-ui
import { Grid } from '@mui/material';
// data
import { gridSpacing } from 'store/constant';
//Firebase
import { countActiveSubscriptions, countAdminUser, countBusiness, countUser, getTotalBenefit } from 'config/firebaseEvents';
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
  const [totalSubs, setTotalSubs] = useState(null);
  const [totalBusiness, setTotalBusiness] = useState(null);
  const [totalIncomes, setTotalIncomes] = useState(0);

  useEffect(() => {
    countUser().then((count) => {
      setTotalUsers(count);
    });
    countAdminUser().then((count) => {
      setTotalAdminUsers(count);
    });
    countActiveSubscriptions().then((count) => {
      setTotalSubs(count);
    });
    countBusiness().then((count) => {
      setTotalBusiness(count);
    });
    getTotalBenefit().then((res) => {
      setTotalIncomes(res);
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
            <TotalYellowCard total={totalSubs} detail="Subscripciones" />
          </Grid>
          <Grid item sm={6} xs={6} md={6} lg={3}>
            <TotalYellowCard total={totalBusiness} detail="Negocios" />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={6}>
            <EarningCard total={totalIncomes} detail="Ingresos" />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={6}>
            <EarningBlueCard total={0} detail="Beneficio" />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={6}>
            <EarningGreenCard total={0} detail="Pagado" />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={6}>
            <EarningRedCard total={0} detail="Pendiente" />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
