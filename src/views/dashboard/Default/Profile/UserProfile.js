import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import ProfileAvatar from './ProfileAvatar';
import ProfileData from './ProfileData';

import { gridSpacing } from 'store/constant';

import { authentication } from 'config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const UserProfile = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        setId(user.uid);
        setName(user.displayName);
        setEmail(user.email);
      }
    });
  }, []);
  return (
    <div>
      <h3>Perfil de Usuario</h3>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item lg={4} md={6} sm={6} xs={12}>
              <ProfileAvatar id={id} name={name} email={email} />
            </Grid>
            <Grid item lg={8} md={6} sm={6} xs={12}>
              <ProfileData />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserProfile;
