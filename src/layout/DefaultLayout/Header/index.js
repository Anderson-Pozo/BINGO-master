import { useNavigate } from 'react-router-dom';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase } from '@mui/material';
// project imports
import LogoSection from '../LogoSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import { IconHome } from '@tabler/icons';
import logoMobile from 'assets/images/LogoBingo.png';
import iconBingo from 'assets/images/bingo.png';

const Header = () => {
  const theme = useTheme();
  let navigate = useNavigate();

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <Box component="span" sx={{ display: { xs: 'block', md: 'none' }, flexGrow: 1 }}>
          <img src={logoMobile} width={98} height={28} alt="Logo Mobile" />
        </Box>
      </Box>
      <ButtonBase sx={{ borderRadius: '12px', ml: 1 }}>
        <Avatar
          variant="rounded"
          color="inherit"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            transition: 'all .2s ease-in-out',
            background: '#00adef',
            color: theme.palette.secondary.dark,
            '&[aria-controls="menu-list-grow"],&:hover': {
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.light
            }
          }}
          onClick={() => {
            navigate('/app/dashboard');
          }}
        >
          <IconHome stroke={1.4} size="1.5rem" color="#FFF" />
        </Avatar>
      </ButtonBase>
      <ButtonBase sx={{ borderRadius: '12px', ml: 1 }}>
        <Avatar
          variant="rounded"
          color="inherit"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            transition: 'all .2s ease-in-out',
            background: '#00adef',
            color: theme.palette.secondary.dark,
            '&[aria-controls="menu-list-grow"],&:hover': {
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.light
            }
          }}
          onClick={() => {
            navigate('/app/dashboard');
          }}
        >
          <img src={iconBingo} width={23} height={23} alt="Icono Bingo" />
        </Avatar>
      </ButtonBase>
      <Box sx={{ flexGrow: 1 }} />
      <NotificationSection />
      <ProfileSection />
    </>
  );
};

export default Header;
