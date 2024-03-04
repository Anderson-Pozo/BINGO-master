/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { uiStyles } from './Products.styles';

import { IconBook, IconApps, IconDeviceFloppy } from '@tabler/icons';

//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Collections
import * as Msg from 'store/message';
import { titles, inputLabels } from './Products.texts';
import { fullDate } from 'utils/validations';
import { collProducts } from 'store/collections';

import { storage } from 'config/firebase';
import { getProductById, updateDocument } from 'config/firebaseEvents';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default function ProductEdit() {
  let navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idProduct = searchParams.get('id');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const [openLoader, setOpenLoader] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [price, setPrice] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [category, setCategory] = useState(null);

  const [logo, setLogo] = useState({ preview: '', raw: '' });
  const [picture1, setPicture1] = useState({ preview: '', raw: '' });
  const [picture2, setPicture2] = useState({ preview: '', raw: '' });
  const [picture3, setPicture3] = useState({ preview: '', raw: '' });
  const [url0, setUrl0] = useState(null);
  const [url1, setUrl1] = useState(null);
  const [url2, setUrl2] = useState(null);
  const [url3, setUrl3] = useState(null);
  const [change1, setChange1] = useState(false);
  const [change2, setChange2] = useState(false);
  const [change3, setChange3] = useState(false);
  const [change4, setChange4] = useState(false);

  useEffect(() => {
    getProductById(idProduct).then((data) => {
      setName(data[0].name);
      setDescription(data[0].description);
      setPrice(data[0].price);
      setQuantity(data[0].quantity);
      setCategory(data[0].category);
      setUrl0(data[0].logo);
      setUrl1(data[0].picture1);
      setUrl2(data[0].picture2);
      setUrl3(data[0].picture3);
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

  const handleEdit = () => {
    if (!name || !description || !price || !quantity || !category) {
      toast.info(Msg.requiered, { position: toast.POSITION.TOP_RIGHT });
    } else {
      setOpenLoader(true);
      const object = {
        name: name,
        description: description,
        price: price,
        quantity: quantity,
        category: category,
        logo: url0,
        picture1: url1,
        picture2: url2,
        picture3: url3,
        updateAt: fullDate(),
        deleteAt: null,
        state: 1
      };
      setTimeout(() => {
        updateDocument(collProducts, idProduct, object);
        //Logo
        if (change1) {
          if (logo.raw !== null) {
            const imageName = idProduct + 'main.jpg';
            const imageRef = ref(storage, `business/products/${imageName}`);
            uploadBytes(imageRef, logo.raw).then((snap) => {
              getDownloadURL(snap.ref).then((url) => {
                const obj = {
                  logo: url
                };
                updateDocument(collProducts, idProduct, obj);
              });
            });
          }
        }
        //Picture1
        if (change2) {
          if (picture1.raw !== null) {
            const imageName = idProduct + 'p1.jpg';
            const imageRef = ref(storage, `business/products/${imageName}`);
            uploadBytes(imageRef, picture1.raw).then((snap) => {
              getDownloadURL(snap.ref).then((url) => {
                const obj = {
                  picture1: url
                };
                updateDocument(collProducts, idProduct, obj);
              });
            });
          }
        }
        //Picture2
        if (change3) {
          if (picture2.raw !== null) {
            const imageName = idProduct + 'p2.jpg';
            const imageRef = ref(storage, `business/products/${imageName}`);
            uploadBytes(imageRef, picture2.raw).then((snap) => {
              getDownloadURL(snap.ref).then((url) => {
                const obj = {
                  picture2: url
                };
                updateDocument(collProducts, idProduct, obj);
              });
            });
          }
        }
        //Picture3
        if (change4) {
          if (picture3.raw !== null) {
            const imageName = idProduct + 'p3.jpg';
            const imageRef = ref(storage, `business/products/${imageName}`);
            uploadBytes(imageRef, picture3.raw).then((snap) => {
              getDownloadURL(snap.ref).then((url) => {
                const obj = {
                  picture3: url
                };
                updateDocument(collProducts, idProduct, obj);
              });
            });
          }
        }
        setOpenLoader(false);
        navigate('/app/products');
        toast.success(Msg.coucresucc, { position: toast.POSITION.TOP_RIGHT });
        clearData();
      }, 3000);
    }
  };

  const clearData = () => {
    setName('');
    setDescription('');
    setPrice('');
    setQuantity('');
    setCategory('');
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
        setChange1(true);
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
        setChange2(true);
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
        setChange3(true);
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
        setChange4(true);
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
                    navigate('/app/products');
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
                  {titles.viewBusiness}
                </MenuItem>
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Button variant="primary" endIcon={<IconDeviceFloppy />} onClick={handleEdit}>
                {titles.buttonSave}
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Grid container style={{ marginTop: 10, paddingLeft: 0 }}>
        <Grid item lg={12} xs={12}>
          <Grid container spacing={0.4}>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="description">{inputLabels.description + ' *'}</InputLabel>
                <OutlinedInput
                  id="description"
                  type="text"
                  multiline
                  rows={6}
                  name="description"
                  value={description || ''}
                  inputProps={{}}
                  onChange={(ev) => setDescription(ev.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="category">{inputLabels.category + ' *'}</InputLabel>
                <OutlinedInput
                  id="category"
                  type="text"
                  name="category"
                  value={category || ''}
                  inputProps={{}}
                  onChange={(ev) => setCategory(ev.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="price">{inputLabels.price + ' *'}</InputLabel>
                <OutlinedInput
                  id="price"
                  type="number"
                  name="price"
                  value={price || ''}
                  inputProps={{}}
                  onChange={(ev) => setPrice(ev.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="quantity">{inputLabels.quantity + ' *'}</InputLabel>
                <OutlinedInput
                  id="quantity"
                  type="number"
                  name="quantity"
                  value={quantity || ''}
                  inputProps={{}}
                  onChange={(ev) => setQuantity(ev.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6} lg={3} style={{ marginTop: 20 }}>
              <div style={{ border: 'dashed gray', borderRadius: 10, borderWidth: 0.2, height: 210, cursor: 'pointer' }}>
                <center>
                  <input type="file" id="logo" style={{ display: 'none' }} onChange={handleLogoChange} accept="image/*" />
                  <div htmlFor="logo" id="logo">
                    <label htmlFor="logo">
                      <img src={logo.preview || url0} alt="Logo" width={180} height={140} style={{ borderRadius: 15, paddingTop: 5 }} />
                      <p style={{ fontSize: 12 }}>{titles.logoImg}</p>
                      <p style={{ fontSize: 11 }}>{titles.sizeImg}</p>
                    </label>
                  </div>
                </center>
              </div>
            </Grid>
            <Grid item xs={6} lg={3} style={{ marginTop: 20 }}>
              <div style={{ border: 'dashed gray', borderRadius: 10, borderWidth: 0.2, height: 210, cursor: 'pointer' }}>
                <center>
                  <input type="file" id="picture1" style={{ display: 'none' }} onChange={handlePicture1Change} accept="image/*" />
                  <div htmlFor="picture1" id="picture1">
                    <label htmlFor="picture1">
                      <img
                        src={picture1.preview || url1}
                        alt="picture1"
                        width={180}
                        height={140}
                        style={{ borderRadius: 15, paddingTop: 5 }}
                      />
                      <p style={{ fontSize: 12 }}>{titles.instructionsImg}</p>
                      <p style={{ fontSize: 11 }}>{titles.sizeImg}</p>
                    </label>
                  </div>
                </center>
              </div>
            </Grid>
            <Grid item xs={6} lg={3} style={{ marginTop: 20 }}>
              <div style={{ border: 'dashed gray', borderRadius: 10, borderWidth: 0.2, height: 210, cursor: 'pointer' }}>
                <center>
                  <input type="file" id="picture2" style={{ display: 'none' }} onChange={handlePicture2Change} accept="image/*" />
                  <div htmlFor="picture2" id="picture2">
                    <label htmlFor="picture2">
                      <img
                        src={picture2.preview || url2}
                        alt="picture2"
                        width={180}
                        height={140}
                        style={{ borderRadius: 15, paddingTop: 5 }}
                      />
                      <p style={{ fontSize: 12 }}>{titles.instructionsImg}</p>
                      <p style={{ fontSize: 11 }}>{titles.sizeImg}</p>
                    </label>
                  </div>
                </center>
              </div>
            </Grid>
            <Grid item xs={6} lg={3} style={{ marginTop: 20 }}>
              <div style={{ border: 'dashed gray', borderRadius: 10, borderWidth: 0.2, height: 210, cursor: 'pointer' }}>
                <center>
                  <input type="file" id="picture3" style={{ display: 'none' }} onChange={handlePicture3Change} accept="image/*" />
                  <div htmlFor="picture3" id="picture3">
                    <label htmlFor="picture3">
                      <img
                        src={picture3.preview || url3}
                        alt="picture3"
                        width={180}
                        height={140}
                        style={{ borderRadius: 15, paddingTop: 5 }}
                      />
                      <p style={{ fontSize: 12 }}>{titles.instructionsImg}</p>
                      <p style={{ fontSize: 11 }}>{titles.sizeImg}</p>
                    </label>
                  </div>
                </center>
              </div>
            </Grid>
          </Grid>
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
