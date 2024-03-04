import { Link } from 'react-router-dom';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
// project imports
import AuthWrapper from '../AuthWrapper';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthLogin from '../auth-forms/AuthLoginAdmin';
import Logo from 'components/Logo-md';
import AuthFooter from 'components/cards/AuthFooter';
//Assets
import bg01 from 'assets/images/bg/01.webp';

const SigninAdmin = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AuthWrapper
      style={{
        backgroundImage: `url(${bg01})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        margin: 0,
        padding: 0
      }}
    >
      <Grid container direction="column">
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 57px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item>
                    <Logo />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container direction={matchDownSM ? 'column-reverse' : 'row'} alignItems="center" justifyContent="center">
                      <Grid item>
                        <Stack alignItems="center" justifyContent="center" spacing={1}>
                          <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                            Zona Administración
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <AuthLogin />
                  </Grid>
                  <Grid item xs={12} hidden>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} hidden>
                    <Typography variant="h4" style={{ textAlign: 'center', marginBottom: 10 }}>
                      Aún no tienes una cuenta?
                    </Typography>
                    <Grid item container direction="column" alignItems="center" xs={12}>
                      <Typography component={Link} to="/auth/signup-admin" variant="subtitle1" sx={{ textDecoration: 'none' }}>
                        Regístrate
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default SigninAdmin;
