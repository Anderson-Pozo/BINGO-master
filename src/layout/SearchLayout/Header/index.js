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
  IconButton
} from '@mui/material';
import { uiStyles } from 'components/search/styles';
import { Link as Scroll } from 'react-scroll';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import { Box } from '@mui/system';
//import Hero from 'components/search/Hero';
import logo from 'assets/images/khuska/logo.png';

const drawerWidth = 240;

function Header(props) {
  let navigate = useNavigate();
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
    navigate('/auth/signin');
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <img src={logo} alt="logobrand" width={130} />
      </Typography>
      <Divider />
      <List>
        <Scroll to="header" smooth={true}>
          <ListItem key={1} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={'Inicio'} />
            </ListItemButton>
          </ListItem>
        </Scroll>
        <Box style={{ marginTop: 10 }}>
          <center>
            <Button variant="contained" startIcon={<PersonIcon />} onClick={handleGoTo}>
              Login
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
          <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
            <Button variant="contained" startIcon={<PersonIcon />} onClick={handleGoTo} style={{ width: 120, fontSize: 15 }}>
              Login
            </Button>
          </Box>
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
      <div hidden>{checked}</div>
    </Box>
  );
}

Header.propTypes = {
  window: PropTypes.func
};

export default Header;
