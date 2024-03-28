import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  AppBar,
  Button,
  CssBaseline,
  Drawer,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Avatar
} from '@mui/material';
import { uiStyles } from './styles';
import { Link as Scroll } from 'react-scroll';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import { Box } from '@mui/system';
import Hero from './Hero';
import logo from 'assets/images/LogoBingo.png';
import defaultAvatar from 'assets/images/profile/profile-picture-6.jpg';
import { useAuth } from 'hooks/useAuth';
import { isSessionActive } from 'config/firebaseEvents';
import { IconDoorExit } from '@tabler/icons';

const drawerWidth = 240;

const Header = (props) => {
  let navigate = useNavigate();
  const { isLoggin, name } = useAuth();
  const { window } = props;
  const [checked, setChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  useEffect(() => {
    setChecked(true);
  }, []);

  const handleGoTo = () => {
    isSessionActive(navigate);
  };

  const handleGoDash = () => {
    isSessionActive(navigate);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <img src={logo} alt="logobrand" width={130} />
      </Typography>
      <Divider />
      <List>
        <Scroll to="contacts" smooth={true}>
          <ListItem key={5} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={'Red de Negocios'} />
            </ListItemButton>
          </ListItem>
        </Scroll>
        <Box style={{ marginTop: 10 }}>
          <center>
            <Button variant="contained" startIcon={<PersonIcon />} onClick={handleGoTo}>
              Iniciar Sesión
            </Button>
          </center>
        </Box>
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box style={uiStyles.root} id="header">
      <CssBaseline />
      <AppBar style={uiStyles.appbar} elevation={0} component="nav">
        <Toolbar style={uiStyles.appbarWrapper}>
          <div style={uiStyles.appbarTitle}>
            <Link to="/">
              <img src={logo} alt="logobrand" width={160} />
            </Link>
          </div>
          {isLoggin ? (
            <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }} onClick={handleGoTo}>
              <List>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleGoDash}>
                    <Avatar alt="avatar user" src={defaultAvatar} sx={{ width: 30, height: 30, marginRight: 1 }} />
                    <p style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>{name}</p>
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          ) : (
            <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
              <Button
                variant="contained"
                startIcon={<IconDoorExit color="#FFF" size={18} />}
                onClick={handleGoTo}
                style={{ width: 180, fontSize: 12, color: '#FFF' }}
              >
                LOGIN
              </Button>
            </Box>
          )}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ ml: 2, mr: 2, display: { xs: 'block', sm: 'block', md: 'none' } }}
          >
            <MenuIcon style={{ fontSize: 40 }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: 'block', sm: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
      </nav>

      <Hero checked={checked} />
    </Box>
  );
};

Header.propTypes = {
  window: PropTypes.func
};

export default Header;
