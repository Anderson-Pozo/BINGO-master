import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import EarningCard from './Main/EarningCard';
import PopularCard from './Main/PopularCard';
import { genConst, gridSpacing } from 'store/constant';
import SubscriptionState from 'components/message/SubscriptionState';

//Firebase
import { countBusinessByUserId, countTotalIncomes } from 'config/firebaseEvents';

//Custom Hook
import { useGetSubscriptionState } from 'hooks/useGetSubscriptionState';
import { msgSubState } from 'store/message';
import SubCard from './Main/SubCard';
import TotalBusiness from './Main/TotalBusiness';
import { useGetUserId } from 'hooks/useGetUserId';

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [totalIncomes, setTotalIncomes] = useState(null);
  const [totalBusiness, setTotalBusiness] = useState(null);
  const stateSub = useGetSubscriptionState();
  const userId = useGetUserId();

  useEffect(() => {
    setLoading(false);
    countBusinessByUserId(userId).then((count) => {
      setTotalBusiness(count);
    });

    countTotalIncomes().then((count) => {
      setTotalIncomes(count);
    });
  }, [userId]);

  return (
    <>
      {stateSub == genConst.CONST_SUB_STATE_ACTIVE ? (
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item lg={4} md={12} sm={12} xs={12}>
                <EarningCard isLoading={isLoading} totalIncomes={totalIncomes} />
              </Grid>
              <Grid item lg={4} md={12} sm={12} xs={12}>
                <SubCard isLoading={isLoading} state={stateSub} />
              </Grid>
              <Grid item lg={4} md={12} sm={12} xs={12}>
                <TotalBusiness isLoading={isLoading} count={totalBusiness} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} hidden>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} md={4}>
                <PopularCard isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <SubscriptionState message={msgSubState} submessage={''} />
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Dashboard;
