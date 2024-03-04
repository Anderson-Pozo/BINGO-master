/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Button, Box, Grid, IconButton, Menu, MenuItem, FormControl, AppBar, Container, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { uiStyles } from './Business.styles';
import { IconBook, IconApps, IconBusinessplan, IconBrandFacebook, IconBrandInstagram, IconBrandYoutube } from '@tabler/icons';
//Notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//Collections
import { titles } from './Business.texts';
import { getBusinessById } from 'config/firebaseEvents';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

export default function BusinessInfo() {
  let navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
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
  const [images, setImages] = useState([]);

  React.useEffect(() => {
    getBusinessById(id).then((data) => {
      setName(data[0].name);
      setOwner(data[0].owner);
      setDescription(data[0].description);
      setPhone(data[0].phone);
      setWebPage(data[0].webPage);
      setEmail(data[0].email);
      setProvince(data[0].province);
      setCity(data[0].city);
      setAddress(data[0].address);
      setFacebook(data[0].facebook);
      setInstagram(data[0].instagram);
      setYoutube(data[0].youtube);
      setImages([
        {
          original: data[0].logo,
          thumbnail: data[0].logo,
          originalHeight: 400,
          thumbnailWidth: 50,
          thumbnailHeight: 50
        },
        {
          original: data[0].picture1,
          thumbnail: data[0].picture1,
          originalHeight: 400,
          thumbnailWidth: 60,
          thumbnailHeight: 50
        },
        {
          original: data[0].picture2,
          thumbnail: data[0].picture2,
          originalHeight: 400,
          thumbnailWidth: 60,
          thumbnailHeight: 50
        },
        {
          original: data[0].picture3,
          thumbnail: data[0].picture3,
          originalHeight: 400,
          thumbnailWidth: 60,
          thumbnailHeight: 50
        },
        {
          original: data[0].picture4,
          thumbnail: data[0].picture4,
          originalHeight: 400,
          thumbnailWidth: 60,
          thumbnailHeight: 50
        }
      ]);
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
      <ToastContainer />
      <AppBar position="static" style={uiStyles.appbar}>
        <Container maxWidth="xl" style={uiStyles.containerAdd}>
          <Toolbar disableGutters>
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
                    navigate('/main/business');
                  }}
                >
                  <IconBusinessplan style={{ marginRight: 4 }} />
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
                    navigate('/main/business');
                  }}
                >
                  <IconBook style={{ marginRight: 10 }} />
                  {titles.viewMenu}
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box>
        <Grid container spacing={1} style={{ marginTop: 5 }}>
          <Grid item lg={6} xs={12}>
            <Grid container spacing={0} style={{ paddingLeft: 20 }}>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <h2>{name}</h2>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <strong>Responsable:</strong>
                </FormControl>
              </Grid>
              <Grid item xs={8}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <span>{owner}</span>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <strong>Descripción:</strong>
                </FormControl>
              </Grid>
              <Grid item xs={8}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <span>{description}</span>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <strong>Teléfono:</strong>
                </FormControl>
              </Grid>
              <Grid item xs={8}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <span>{phone}</span>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <strong>Email:</strong>
                </FormControl>
              </Grid>
              <Grid item xs={8}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <span>{email}</span>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <strong>Provincia / Ciudad:</strong>
                </FormControl>
              </Grid>
              <Grid item xs={8}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <span>{province + ' / ' + city}</span>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <strong>Dirección:</strong>
                </FormControl>
              </Grid>
              <Grid item xs={8}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <span>{address}</span>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <strong>Página Web:</strong>
                </FormControl>
              </Grid>
              <Grid item xs={8}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <span>{webPage}</span>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <strong>Redes Sociales:</strong>
                </FormControl>
              </Grid>
              <Grid item alignItems="center" xs={10}>
                <center>
                  <a href={facebook} target="blank" style={{ padding: 10 }}>
                    <IconBrandFacebook size={40} />
                  </a>
                  <a href={instagram} target="blank" style={{ padding: 10 }}>
                    <IconBrandInstagram size={40} />
                  </a>
                  <a href={youtube} target="blank" style={{ padding: 10 }}>
                    <IconBrandYoutube size={40} />
                  </a>
                </center>
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={6} xs={12}>
            <center>
              <ImageGallery
                items={images}
                autoPlay
                showPlayButton={false}
                showNav={false}
                showFullscreenButton={false}
                slideInterval={5000}
              />
            </center>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
