import React, { useEffect, useState } from 'react';
// material-ui
import CircularProgress from '@mui/material/CircularProgress';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Typography, FormControl, Button, InputLabel, OutlinedInput, Modal } from '@mui/material';
// project imports
import MainCard from 'components/cards/MainCard';
// Firebase
import { authentication } from 'config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// project imports
import AnimateButton from 'components/extended/AnimateButton';
import { collUsers } from 'store/collections';
import { fullDate } from 'utils/validations';
import { getUserData, updateDocument, updateProfileUser } from 'config/firebaseEvents';
import { uiStyles } from './Profile.styles';
import { titles } from './Profile.texts';

const CardWrapper = styled(MainCard)(() => ({
  backgroundColor: '#414551',
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  height: 400
}));

const ProfileData = () => {
  const theme = useTheme();
  const [id, setId] = useState(null);
  const [name, setName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [openLoader, setOpenLoader] = useState(false);

  useEffect(() => {
    onAuthStateChanged(authentication, async (user) => {
      if (user) {
        setId(user.uid);
        getUserData(user.uid).then((data) => {
          setName(data[0].name);
          setLastName(data[0].lastName);
          setPhone(data[0].phone);
        });
      }
    });
  }, []);

  const reloadData = () => {
    onAuthStateChanged(authentication, async (user) => {
      if (user) {
        setId(user.uid);
        setEmail(user.email);
        getUserData(user.uid).then((data) => {
          setName(data[0].name);
          setLastName(data[0].lastName);
          setPhone(data[0].phone);
        });
      }
    });
  };

  const updateProfileData = () => {
    if (!name || !lastName) {
      toast.info(titles.mandatory, { position: toast.POSITION.TOP_RIGHT });
    } else {
      setOpenLoader(true);
      const object = {
        name: name,
        lastName: lastName,
        fullName: name + ' ' + lastName,
        phone: phone,
        updateAt: fullDate()
      };
      updateProfileUser(name, lastName);
      updateDocument(collUsers, id, object);
      setTimeout(() => {
        setOpenLoader(false);
        reloadData();
        toast.success(titles.successUpdate, { position: toast.POSITION.TOP_RIGHT });
      }, 2000);
    }
  };

  return (
    <>
      <ToastContainer />
      <CardWrapper border={false} content={false}>
        <Box sx={{ p: 5 }}>
          <Grid container direction="column">
            <Grid item>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Typography component="span" variant="h3" sx={{ fontWeight: 600, color: '#FFF' }}>
                    {titles.title}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container alignItems="center">
                {titles.subTitle}
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput, padding: 0.2, paddingRight: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-name-register">{titles.name}</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-name-register"
                    type="text"
                    value={name || ''}
                    name="name"
                    onChange={(ev) => setName(ev.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput, padding: 0.2, paddingRight: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-name-register">{titles.lastName}</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-name-register"
                    type="text"
                    value={lastName || ''}
                    name="lastName"
                    onChange={(ev) => setLastName(ev.target.value)}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput, padding: 0.2 }}>
                  <InputLabel htmlFor="outlined-adornment-phone-register">{titles.phone}</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-phone-register"
                    type="number"
                    value={phone || ''}
                    name="phone"
                    onChange={(ev) => setPhone(ev.target.value)}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  size="large"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  style={{ color: '#FFF', height: 50, borderRadius: 12 }}
                  onClick={updateProfileData}
                >
                  {titles.btnSave}
                </Button>
              </AnimateButton>
            </Box>
          </Grid>
        </Box>
        <Modal open={openLoader} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <center>
            <Box sx={uiStyles.loader}>
              <CircularProgress color="info" size={100} />
            </Box>
          </center>
        </Modal>
      </CardWrapper>
    </>
  );
};

export default ProfileData;
