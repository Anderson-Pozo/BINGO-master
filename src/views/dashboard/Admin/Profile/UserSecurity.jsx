import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import ProfileChangeEmail from './ProfileChangeEmail';
import ProfileChangePassword from './ProfileChangePassword';

import { gridSpacing } from 'store/constant';

// Firebase
import { authentication } from 'config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const UserSecurity = () => {
  const [id, setId] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        setId(user.uid);
        setEmail(user.email);
      }
    });
  }, []);

  return (
    <div>
      <h3>Seguridad de Usuario</h3>
      <p hidden>{id}</p>
      <p hidden>{email}</p>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item lg={6} md={6} sm={6} xs={12}>
              <ProfileChangeEmail email={email} />
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={12}>
              <ProfileChangePassword email={email} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserSecurity;
