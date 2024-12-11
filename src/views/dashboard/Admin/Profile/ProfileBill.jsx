/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';

import { gridSpacing } from 'store/constant';

import { authentication } from 'config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import UserBill from './UserBill';

const UserProfileBill = () => {
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
      <h3>Datos de Facturación</h3>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <UserBill />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserProfileBill;
