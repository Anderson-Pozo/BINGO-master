/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
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
import { uiStyles } from './Courses.styles';

import { IconBook, IconApps, IconDeviceFloppy } from '@tabler/icons';

//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Collections
import * as Msg from 'store/message';
import { generateId } from 'utils/idGenerator';
import { titles, inputLabels } from './Courses.texts';
import defaultImageCourse from 'assets/images/defaultCourse.jpg';
import { fullDate } from 'utils/validations';
import { collCourses } from 'store/collections';

import { storage } from 'config/firebase';
import { createDocument, updateDocument } from 'config/firebaseEvents';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default function AddCourses() {
  let navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const [openLoader, setOpenLoader] = React.useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [name, setName] = React.useState(null);
  const [description, setDescription] = React.useState(null);
  const [owner, setOwner] = React.useState(null);
  const [duration, setDuration] = React.useState(0);
  const [number, setNumber] = React.useState(null);
  const [price, setPrice] = React.useState(null);
  const [banner, setBanner] = React.useState({ preview: '', raw: '' });

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
    if (!name || !description || !owner || !number || !duration || !price) {
      toast.info(Msg.requiered, { position: toast.POSITION.TOP_RIGHT });
    } else if (!banner.preview) {
      toast.info(Msg.imgreq, { position: toast.POSITION.TOP_RIGHT });
    } else {
      setOpenLoader(true);
      const ide = generateId(10);
      const object = {
        id: ide,
        name: name,
        description: description,
        owner: owner,
        number: number,
        language: 'ESP',
        duration: duration,
        price: price,
        createAt: fullDate(),
        state: 1,
        banner: null
      };
      //console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
      //console.log(Intl.DateTimeFormat().resolvedOptions().locale);
      setTimeout(() => {
        createDocument(collCourses, ide, object);
        if (banner.raw !== null) {
          const imageName = ide + '.jpg';
          const imageRef = ref(storage, `courses/${imageName}`);
          uploadBytes(imageRef, banner.raw).then((snap) => {
            getDownloadURL(snap.ref).then((url) => {
              const obj = {
                banner: url
              };
              updateDocument(collCourses, ide, obj);
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
    setDescription('');
    setOwner('');
    setNumber('');
    setDuration('');
    setPrice('');
    setBanner({
      preview: '',
      raw: ''
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files.length) {
      let img = new Image();
      img.src = window.URL.createObjectURL(e.target.files[0]);
      let raw = e.target.files[0];
      img.onload = () => {
        setBanner({
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
                    navigate('/app/courses');
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
                    navigate('/app/courses');
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
        <Grid item lg={6} xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
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
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="description">{inputLabels.description + ' *'}</InputLabel>
                    <OutlinedInput
                      id="description"
                      type="text"
                      multiline
                      rows={4}
                      name="description"
                      value={description || ''}
                      inputProps={{}}
                      onChange={(ev) => setDescription(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
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
                <Grid item xs={6}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="number">{inputLabels.number + ' *'}</InputLabel>
                    <OutlinedInput
                      id="number"
                      type="number"
                      name="number"
                      value={number || ''}
                      inputProps={{}}
                      onChange={(ev) => setNumber(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="duration">{inputLabels.duration + ' *'}</InputLabel>
                    <OutlinedInput
                      id="duration"
                      type="number"
                      name="duration"
                      value={duration || ''}
                      inputProps={{}}
                      onChange={(ev) => setDuration(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="price">{'$ ' + inputLabels.price + ' *'}</InputLabel>
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
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item lg={6} xs={12}>
          <Grid item xs={12} style={{ marginTop: 20 }}>
            <center>
              <input type="file" id="banner" style={{ display: 'none' }} onChange={handleImageChange} accept="image/*" />
              <div htmlFor="banner" id="banner">
                <label htmlFor="banner">
                  <img src={banner.preview || defaultImageCourse} alt="Banner" width="100%" height={350} style={{ borderRadius: 15 }} />
                  <p style={{ fontSize: 12 }}>{titles.instructionsImg}</p>
                </label>
              </div>
            </center>
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
