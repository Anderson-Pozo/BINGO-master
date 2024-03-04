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
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { uiStyles } from './Products.styles';

import { IconBook, IconApps } from '@tabler/icons';

//Notifications
import 'react-toastify/dist/ReactToastify.css';

//Collections
import { titles, inputLabels } from './Products.texts';

import { getProductById } from 'config/firebaseEvents';

export default function ProductView() {
  let navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idProduct = searchParams.get('id');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [price, setPrice] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [category, setCategory] = useState(null);

  const [url0, setUrl0] = useState(null);
  const [url1, setUrl1] = useState(null);
  const [url2, setUrl2] = useState(null);
  const [url3, setUrl3] = useState(null);

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

  return (
    <div>
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
          </Toolbar>
        </Container>
      </AppBar>

      <Grid container style={{ marginTop: 10, paddingLeft: 0 }}>
        <Grid item lg={12} xs={12}>
          <Grid container spacing={0.4}>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="name">{inputLabels.name}</InputLabel>
                <OutlinedInput
                  id="name"
                  type="text"
                  name="name"
                  value={name || ''}
                  inputProps={{}}
                  onChange={(ev) => setName(ev.target.value)}
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="description">{inputLabels.description}</InputLabel>
                <OutlinedInput
                  id="description"
                  type="text"
                  multiline
                  rows={6}
                  name="description"
                  value={description || ''}
                  inputProps={{}}
                  onChange={(ev) => setDescription(ev.target.value)}
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="category">{inputLabels.category}</InputLabel>
                <OutlinedInput
                  id="category"
                  type="text"
                  name="category"
                  value={category || ''}
                  inputProps={{}}
                  onChange={(ev) => setCategory(ev.target.value)}
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="price">{inputLabels.price}</InputLabel>
                <OutlinedInput
                  id="price"
                  type="number"
                  name="price"
                  value={price || ''}
                  inputProps={{}}
                  onChange={(ev) => setPrice(ev.target.value)}
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="quantity">{inputLabels.quantity}</InputLabel>
                <OutlinedInput
                  id="quantity"
                  type="number"
                  name="quantity"
                  value={quantity || ''}
                  inputProps={{}}
                  onChange={(ev) => setQuantity(ev.target.value)}
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid item xs={6} lg={3} style={{ marginTop: 20 }}>
              <div style={{ border: 'dashed gray', borderRadius: 10, borderWidth: 0.2, height: 160, cursor: 'pointer' }}>
                <center>
                  <div htmlFor="logo" id="logo">
                    <label htmlFor="logo">
                      <img src={url0} alt="Logo" width={180} height={140} style={{ borderRadius: 15, paddingTop: 5 }} />
                    </label>
                  </div>
                </center>
              </div>
            </Grid>
            <Grid item xs={6} lg={3} style={{ marginTop: 20 }}>
              <div style={{ border: 'dashed gray', borderRadius: 10, borderWidth: 0.2, height: 160, cursor: 'pointer' }}>
                <center>
                  <div htmlFor="picture1" id="picture1">
                    <label htmlFor="picture1">
                      <img src={url1} alt="picture1" width={180} height={140} style={{ borderRadius: 15, paddingTop: 5 }} />
                    </label>
                  </div>
                </center>
              </div>
            </Grid>
            <Grid item xs={6} lg={3} style={{ marginTop: 20 }}>
              <div style={{ border: 'dashed gray', borderRadius: 10, borderWidth: 0.2, height: 160, cursor: 'pointer' }}>
                <center>
                  <div htmlFor="picture2" id="picture2">
                    <label htmlFor="picture2">
                      <img src={url2} alt="picture2" width={180} height={140} style={{ borderRadius: 15, paddingTop: 5 }} />
                    </label>
                  </div>
                </center>
              </div>
            </Grid>
            <Grid item xs={6} lg={3} style={{ marginTop: 20 }}>
              <div style={{ border: 'dashed gray', borderRadius: 10, borderWidth: 0.2, height: 160, cursor: 'pointer' }}>
                <center>
                  <div htmlFor="picture3" id="picture3">
                    <label htmlFor="picture3">
                      <img src={url3} alt="picture3" width={180} height={140} style={{ borderRadius: 15, paddingTop: 5 }} />
                    </label>
                  </div>
                </center>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
