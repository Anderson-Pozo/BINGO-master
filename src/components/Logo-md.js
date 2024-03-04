// material-ui
import { Link } from 'react-router-dom';

import { Typography } from '@mui/material';
import logo from 'assets/images/khuska/logo.png';

const LogoMD = () => {
  return (
    <Typography component={Link} to="/">
      <img src={logo} alt="Logo Principal" width="200" />
    </Typography>
  );
};

export default LogoMD;
