/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';

import { gridSpacing } from 'store/constant';

import { authentication } from 'config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import UserPayments from './UserPayments';
import UserAddPaymentMethods from './UserAddPaymentMethods';

const UserProfilePaymentMethods = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        setId(user.uid);
        setName(user.displayName);
        setEmail(user.email);
        console.log(id, name, email);
      }
    });
  }, []);
  return (
    <div>
      <h3>Metodos de Pago</h3>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item lg={6} md={6} sm={6} xs={12}>
              <UserPayments />
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={12}>
              <UserAddPaymentMethods />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserProfilePaymentMethods;
