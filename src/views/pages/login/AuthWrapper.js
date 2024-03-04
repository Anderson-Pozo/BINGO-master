// material-ui
import { styled } from '@mui/material/styles';

// ==============================|| AUTHENTICATION 1 WRAPPER ||============================== //

const AuthWrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  height: '100%',
  width: '100%'
}));

export default AuthWrapper;
