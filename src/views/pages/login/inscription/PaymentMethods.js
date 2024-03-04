import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

// material-ui
import { Box, Button, Grid, Typography } from '@mui/material';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';

// project imports
import CreditCards from './CreditCards';

// assets
import { IconBrandPaypal, IconBuildingBank, IconCreditCard, IconDeviceMobile } from '@tabler/icons';
import { TabContext } from '@mui/lab';

import deuna from 'assets/images/deuna.png';
import paypal from 'assets/images/paypal.png';
import { genConst } from 'store/constant';

const PaymentMethods = () => {
  const [value, setValue] = useState('1');
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');
  const lastName = searchParams.get('lastName');
  const email = searchParams.get('email');
  const course = searchParams.get('course');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            variant="scrollable"
            scrollButtons
            onChange={handleChange}
            aria-label="Tabs payment methods"
            sx={{
              [`& .${tabsClasses.scrollButtons}`]: {
                '&.Mui-disabled': { opacity: 0.3 }
              }
            }}
          >
            <Tab icon={<IconCreditCard />} label="Tarjetas" value="1" />
            <Tab icon={<IconBuildingBank />} label="Depósito / Transferecnia" value="2" />
            <Tab icon={<IconDeviceMobile />} label="De Una" value="3" />
            <Tab icon={<IconBrandPaypal />} label="PayPal" value="4" />
          </Tabs>
        </Box>
        <TabPanel value="1">
          <CreditCards />
        </TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
        <TabPanel value="3">
          <center>
            <Grid container spacing={0.8}>
              <Grid item xs={12}>
                <Grid container spacing={0.8}>
                  <Grid item lg={6} md={6} sm={6} xs={6}>
                    <img src={deuna} alt="Berry" width="140" />
                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={6}>
                    <img src={deuna} alt="Berry" width="140" />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </center>
        </TabPanel>
        <TabPanel value="4">
          <center>
            <Grid container spacing={0.8}>
              <Grid item xs={12}>
                <Grid container spacing={0.8}>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <img src={paypal} alt="Berry" width="140" />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      style={{ margin: 5, borderRadius: 10, backgroundColor: genConst.CONST_CREATE_COLOR }}
                    >
                      Pagar
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </center>
        </TabPanel>
      </TabContext>
      <center>
        <Typography component={Link} to="/app/dashboard" variant="subtitle1" sx={{ textDecoration: 'none' }}>
          Continuar y realizar el pago después!
        </Typography>
        <p hidden>
          {name}
          {lastName}
          {email}
          {course}
        </p>
      </center>
    </Box>
  );
};

export default PaymentMethods;
