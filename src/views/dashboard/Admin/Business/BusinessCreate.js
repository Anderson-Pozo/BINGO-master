/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Button,
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  InputLabel,
  OutlinedInput,
  FormControl,
  AppBar,
  Container,
  Toolbar,
  Typography,
  Modal
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import MenuIcon from '@mui/icons-material/Menu';
import { uiStyles } from './Business.styles';

import { IconBook, IconApps, IconDeviceFloppy } from '@tabler/icons';

//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Collections
import * as Msg from 'store/message';
import { generateId } from 'utils/idGenerator';
import { titles, inputLabels } from './Business.texts';
import defaultImageCourse from 'assets/images/defaultCourse.jpg';
import { fullDate } from 'utils/validations';
import { collBusiness } from 'store/collections';

import { authentication, storage } from 'config/firebase';
import { createDocument, updateDocument } from 'config/firebaseEvents';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';

export default function BusinessCreate() {
  let navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const [userId, setUserId] = useState(null);
  const [openLoader, setOpenLoader] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [name, setName] = useState(null);
  const [owner, setOwner] = useState(null);
  const [description, setDescription] = useState(null);
  const [webPage, setWebPage] = useState(null);
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState(null);
  const [province, setProvince] = useState(null);
  const [city, setCity] = useState(null);
  const [address, setAddress] = useState(null);

  const [facebook, setFacebook] = useState(null);
  const [youtube, setYoutube] = useState(null);
  const [instagram, setInstagram] = useState(null);
  //const [telegram, setTelegram] = useState(null);
  const [logo, setLogo] = useState({ preview: '', raw: '' });
  const [picture1, setPicture1] = useState({ preview: '', raw: '' });
  const [picture2, setPicture2] = useState({ preview: '', raw: '' });
  const [picture3, setPicture3] = useState({ preview: '', raw: '' });
  const [picture4, setPicture4] = useState({ preview: '', raw: '' });

  useEffect(() => {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        setUserId(user.uid);
        console.log(user.uid);
      }
    });
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreate = () => {
    if (!name || !owner || !description || !phone || !province || !address || !city || !email) {
      toast.info(Msg.requiered, { position: toast.POSITION.TOP_RIGHT });
    } else if (!logo.preview) {
      toast.info(Msg.imgreq, { position: toast.POSITION.TOP_RIGHT });
    } else if (!picture1.preview) {
      toast.info(Msg.imgreq, { position: toast.POSITION.TOP_RIGHT });
    } else if (!picture2.preview) {
      toast.info(Msg.imgreq, { position: toast.POSITION.TOP_RIGHT });
    } else if (!picture3.preview) {
      toast.info(Msg.imgreq, { position: toast.POSITION.TOP_RIGHT });
    } else if (!picture4.preview) {
      toast.info(Msg.imgreq, { position: toast.POSITION.TOP_RIGHT });
    } else {
      setOpenLoader(true);
      const ide = generateId(10);
      const object = {
        id: ide,
        userId: userId,
        name: name,
        owner: owner,
        description: description,
        phone: phone,
        webPage: webPage,
        email: email,
        province: province,
        city: city,
        address: address,
        logo: null,
        picture1: null,
        picture2: null,
        picture3: null,
        picture4: null,
        facebook: facebook,
        instagram: instagram,
        youtube: youtube,
        createAt: fullDate(),
        updateAt: null,
        deleteAt: null,
        state: 1
      };
      //console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
      //console.log(Intl.DateTimeFormat().resolvedOptions().locale);
      setTimeout(() => {
        createDocument(collBusiness, ide, object);
        //Logo
        if (logo.raw !== null) {
          const imageName = ide + 'logo.jpg';
          const imageRef = ref(storage, `business/${imageName}`);
          uploadBytes(imageRef, logo.raw).then((snap) => {
            getDownloadURL(snap.ref).then((url) => {
              const obj = {
                logo: url
              };
              updateDocument(collBusiness, ide, obj);
            });
          });
        }
        //Picture1
        if (picture1.raw !== null) {
          const imageName = ide + 'p1.jpg';
          const imageRef = ref(storage, `business/${imageName}`);
          uploadBytes(imageRef, picture1.raw).then((snap) => {
            getDownloadURL(snap.ref).then((url) => {
              const obj = {
                picture1: url
              };
              updateDocument(collBusiness, ide, obj);
            });
          });
        }
        //Picture2
        if (picture2.raw !== null) {
          const imageName = ide + 'p2.jpg';
          const imageRef = ref(storage, `business/${imageName}`);
          uploadBytes(imageRef, picture2.raw).then((snap) => {
            getDownloadURL(snap.ref).then((url) => {
              const obj = {
                picture2: url
              };
              updateDocument(collBusiness, ide, obj);
            });
          });
        }
        //Picture3
        if (picture3.raw !== null) {
          const imageName = ide + 'p3.jpg';
          const imageRef = ref(storage, `business/${imageName}`);
          uploadBytes(imageRef, picture3.raw).then((snap) => {
            getDownloadURL(snap.ref).then((url) => {
              const obj = {
                picture3: url
              };
              updateDocument(collBusiness, ide, obj);
            });
          });
        }
        //Picture4
        if (picture4.raw !== null) {
          const imageName = ide + 'p4.jpg';
          const imageRef = ref(storage, `business/${imageName}`);
          uploadBytes(imageRef, picture4.raw).then((snap) => {
            getDownloadURL(snap.ref).then((url) => {
              const obj = {
                picture4: url
              };
              updateDocument(collBusiness, ide, obj);
            });
          });
        }
        setOpenLoader(false);
        toast.success(Msg.coucresucc, { position: toast.POSITION.TOP_RIGHT });
        clearData();
      }, 3000);
    }
  };

  const clearData = () => {
    setName('');
    setOwner('');
    setDescription('');
    setPhone('');
    setWebPage('');
    setEmail('');
    setProvince('');
    setCity('');
    setAddress('');
    setFacebook('');
    setInstagram('');
    setYoutube('');
    setLogo({
      preview: '',
      raw: ''
    });
    setPicture1({
      preview: '',
      raw: ''
    });
    setPicture2({
      preview: '',
      raw: ''
    });
    setPicture3({
      preview: '',
      raw: ''
    });
    setPicture4({
      preview: '',
      raw: ''
    });
  };

  const handleLogoChange = (e) => {
    if (e.target.files.length) {
      let img = new Image();
      img.src = window.URL.createObjectURL(e.target.files[0]);
      let raw = e.target.files[0];
      img.onload = () => {
        setLogo({
          preview: img.src,
          raw: raw
        });
      };
    }
  };

  const handlePicture1Change = (e) => {
    if (e.target.files.length) {
      let img = new Image();
      img.src = window.URL.createObjectURL(e.target.files[0]);
      let raw = e.target.files[0];
      img.onload = () => {
        setPicture1({
          preview: img.src,
          raw: raw
        });
      };
    }
  };

  const handlePicture2Change = (e) => {
    if (e.target.files.length) {
      let img = new Image();
      img.src = window.URL.createObjectURL(e.target.files[0]);
      let raw = e.target.files[0];
      img.onload = () => {
        setPicture2({
          preview: img.src,
          raw: raw
        });
      };
    }
  };

  const handlePicture3Change = (e) => {
    if (e.target.files.length) {
      let img = new Image();
      img.src = window.URL.createObjectURL(e.target.files[0]);
      let raw = e.target.files[0];
      img.onload = () => {
        setPicture3({
          preview: img.src,
          raw: raw
        });
      };
    }
  };

  const handlePicture4Change = (e) => {
    if (e.target.files.length) {
      let img = new Image();
      img.src = window.URL.createObjectURL(e.target.files[0]);
      let raw = e.target.files[0];
      img.onload = () => {
        setPicture4({
          preview: img.src,
          raw: raw
        });
      };
    }
  };

  return (
    <div>
      <ToastContainer />
      <AppBar position="static" style={uiStyles.appbar}>
        <Container maxWidth="xl" style={uiStyles.containerAdd}>
          <Toolbar disableGutters>
            <IconBook />
            <Box sx={uiStyles.box}>
              <IconButton
                size="medium"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={uiStyles.menu}
              >
                <MenuItem
                  key="id-1"
                  onClick={() => {
                    navigate('/app/business');
                  }}
                >
                  <IconBook style={{ marginRight: 4 }} />
                  <Typography textAlign="center">{titles.viewMenu}</Typography>
                </MenuItem>
              </Menu>
            </Box>
            <Box sx={uiStyles.box2}>
              <Button
                variant="primary"
                startIcon={<IconApps />}
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                {titles.actions}
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button'
                }}
              >
                <MenuItem
                  onClick={() => {
                    navigate('/app/business');
                  }}
                >
                  <IconBook style={{ marginRight: 10 }} />
                  {titles.viewMenu}
                </MenuItem>
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Button variant="primary" endIcon={<IconDeviceFloppy />} onClick={handleCreate}>
                {titles.buttonCreate}
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Grid container spacing={1} style={{ marginTop: 5 }}>
        <Grid item lg={7} xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={7}>
              <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="name">{inputLabels.name + ' *'}</InputLabel>
                <OutlinedInput
                  id="name"
                  type="text"
                  name="name"
                  value={name || ''}
                  inputProps={{}}
                  onChange={(ev) => setName(ev.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={5}>
              <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="owner">{inputLabels.owner + ' *'}</InputLabel>
                <OutlinedInput
                  id="owner"
                  type="text"
                  name="owner"
                  value={owner || ''}
                  inputProps={{}}
                  onChange={(ev) => setOwner(ev.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="description">{inputLabels.description + ' *'}</InputLabel>
                  <OutlinedInput
                    id="description"
                    type="text"
                    multiline
                    rows={3}
                    name="description"
                    value={description || ''}
                    inputProps={{}}
                    onChange={(ev) => setDescription(ev.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="phone">{inputLabels.phone + ' *'}</InputLabel>
                  <OutlinedInput
                    id="phone"
                    type="number"
                    name="phone"
                    value={phone || ''}
                    inputProps={{}}
                    onChange={(ev) => setPhone(ev.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="email">{inputLabels.email + ' *'}</InputLabel>
                  <OutlinedInput
                    id="email"
                    type="email"
                    name="email"
                    value={email || ''}
                    inputProps={{}}
                    onChange={(ev) => setEmail(ev.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="webPage">{inputLabels.webPage}</InputLabel>
                  <OutlinedInput
                    id="webPage"
                    type="text"
                    name="webPage"
                    value={webPage || ''}
                    inputProps={{}}
                    onChange={(ev) => setWebPage(ev.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="province">{inputLabels.province + ' *'}</InputLabel>
                  <OutlinedInput
                    id="province"
                    type="text"
                    name="province"
                    value={province || ''}
                    inputProps={{}}
                    onChange={(ev) => setProvince(ev.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="city">{inputLabels.city + ' *'}</InputLabel>
                  <OutlinedInput
                    id="city"
                    type="text"
                    name="city"
                    value={city || ''}
                    inputProps={{}}
                    onChange={(ev) => setCity(ev.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="address">{inputLabels.address + ' *'}</InputLabel>
                  <OutlinedInput
                    id="address"
                    type="text"
                    name="address"
                    value={address || ''}
                    inputProps={{}}
                    onChange={(ev) => setAddress(ev.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="facebook">{inputLabels.facebook}</InputLabel>
                  <OutlinedInput
                    id="facebook"
                    type="text"
                    name="facebook"
                    value={facebook || ''}
                    inputProps={{}}
                    onChange={(ev) => setFacebook(ev.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="instagram">{inputLabels.instagram}</InputLabel>
                  <OutlinedInput
                    id="instagram"
                    type="text"
                    name="instagram"
                    value={instagram || ''}
                    inputProps={{}}
                    onChange={(ev) => setInstagram(ev.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="youtube">{inputLabels.youtube}</InputLabel>
                  <OutlinedInput
                    id="youtube"
                    type="text"
                    name="youtube"
                    value={youtube || ''}
                    inputProps={{}}
                    onChange={(ev) => setYoutube(ev.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} lg={3}>
                <Grid item xs={12} style={{ marginTop: 20 }}>
                  <center>
                    <input type="file" id="logo" style={{ display: 'none' }} onChange={handleLogoChange} accept="image/*" />
                    <div htmlFor="logo" id="logo">
                      <label htmlFor="logo">
                        <img src={logo.preview || defaultImageCourse} alt="Logo" height={150} style={{ borderRadius: 15 }} />
                        <p style={{ fontSize: 12 }}>{titles.logoImg}</p>
                      </label>
                    </div>
                  </center>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={5} xs={12}>
          <center>
            <Grid container spacing={1}>
              <Grid item xs={6} style={{ marginTop: 20 }}>
                <input type="file" id="picture1" style={{ display: 'none' }} onChange={handlePicture1Change} accept="image/*" />
                <div htmlFor="picture1" id="picture1">
                  <label htmlFor="picture1">
                    <img
                      src={picture1.preview || defaultImageCourse}
                      alt="picture1"
                      width={200}
                      height={140}
                      style={{ borderRadius: 15 }}
                    />
                    <p style={{ fontSize: 12 }}>{titles.instructionsImg}</p>
                  </label>
                </div>
              </Grid>
              <Grid item xs={6} style={{ marginTop: 20 }}>
                <input type="file" id="picture2" style={{ display: 'none' }} onChange={handlePicture2Change} accept="image/*" />
                <div htmlFor="picture2" id="picture2">
                  <label htmlFor="picture2">
                    <img
                      src={picture2.preview || defaultImageCourse}
                      alt="picture2"
                      width={200}
                      height={140}
                      style={{ borderRadius: 15 }}
                    />
                    <p style={{ fontSize: 12 }}>{titles.instructionsImg}</p>
                  </label>
                </div>
              </Grid>
              <Grid item xs={6} style={{ marginTop: 20 }}>
                <input type="file" id="picture3" style={{ display: 'none' }} onChange={handlePicture3Change} accept="image/*" />
                <div htmlFor="picture3" id="picture3">
                  <label htmlFor="picture3">
                    <img
                      src={picture3.preview || defaultImageCourse}
                      alt="picture3"
                      width={200}
                      height={140}
                      style={{ borderRadius: 15 }}
                    />
                    <p style={{ fontSize: 12 }}>{titles.instructionsImg}</p>
                  </label>
                </div>
              </Grid>
              <Grid item xs={6} style={{ marginTop: 20 }}>
                <input type="file" id="picture4" style={{ display: 'none' }} onChange={handlePicture4Change} accept="image/*" />
                <div htmlFor="picture4" id="picture4">
                  <label htmlFor="picture4">
                    <img
                      src={picture4.preview || defaultImageCourse}
                      alt="picture4"
                      width={200}
                      height={140}
                      style={{ borderRadius: 15 }}
                    />
                    <p style={{ fontSize: 12 }}>{titles.instructionsImg}</p>
                  </label>
                </div>
              </Grid>
            </Grid>
          </center>
        </Grid>
      </Grid>
      <Modal open={openLoader} aria-labelledby="modal-loader" aria-describedby="modal-loader">
        <center>
          <Box sx={uiStyles.styleLoader}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>
    </div>
  );
}
