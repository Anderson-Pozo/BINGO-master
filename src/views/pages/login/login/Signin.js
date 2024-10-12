import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery, Button, Modal, Box } from '@mui/material';
// project imports
import AuthWrapper1 from '../AuthWrapper';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthLogin from '../auth-forms/AuthLogin';
import Logo from 'components/Logo-md';
import AuthFooter from 'components/cards/AuthFooter';
import CircularProgress from '@mui/material/CircularProgress';
//Assets
import bg01 from 'assets/images/bg/bg1.jpg';
import google from 'assets/images/google.webp';
//Firebase Google Provider
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { genConst } from 'store/constant';
import { createDocument, isExistUser } from 'config/firebaseEvents';
import { collUsers } from 'store/collections';
//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fullDate } from 'utils/validations';

const provider = new GoogleAuthProvider();

const Signin = () => {
  const theme = useTheme();
  let navigate = useNavigate();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const auth = getAuth();
  const [openLoader, setOpenLoader] = useState(false);

  const handleLoginGoogle = () => {
    setOpenLoader(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(user);
        console.log(token);
        isExistUser(user.uid).then((res) => {
          if (res) {
            console.log(res, user.uid);
          } else {
            const userObject = {
              avatar: user.photoURL,
              createAt: fullDate(),
              email: user.email,
              fullName: user.displayName,
              id: user.uid,
              lastName: '',
              name: user.displayName,
              phone: null,
              profile: genConst.CONST_PRO_DEF,
              state: genConst.CONST_STATE_AC,
              url: null,
              provider: 'Google'
            };
            createDocument(collUsers, user.uid, userObject);
            toast.success('Usuario registrado correctamente!.', { position: toast.POSITION.TOP_RIGHT });
          }
        });
        setTimeout(() => {
          setOpenLoader(false);
          navigate('/app/dashboard');
        }, 2000);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const errorEmail = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode, errorMessage, errorEmail, credential);
        toast.error('Ups, algo salio mal!!!', { position: toast.POSITION.TOP_RIGHT });
        setOpenLoader(false);
      });
  };

  return (
    <AuthWrapper1
      style={{
        backgroundImage: `url(${bg01})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        margin: 0,
        padding: 0
      }}
    >
      <ToastContainer />
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
                            Hola, Bienvenido
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <AuthLogin />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <center>
                      <Typography variant="subtitle1" sx={{ textDecoration: 'none' }}>
                        o inicia sesión con:
                      </Typography>
                    </center>
                    <Button
                      disableElevation
                      fullWidth
                      size="large"
                      type="submit"
                      variant="outlined"
                      startIcon={<img src={google} alt="brand google" width={22} />}
                      style={{ color: '#00adef', height: 50, borderRadius: 12 }}
                      onClick={handleLoginGoogle}
                    >
                      Inicia sesión con Google
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h4" style={{ textAlign: 'center', marginBottom: 10 }}>
                      Aún no tienes una cuenta?
                    </Typography>
                    <Grid item container direction="column" alignItems="center" xs={12}>
                      <Typography component={Link} to="/auth/signup" variant="subtitle1" sx={{ textDecoration: 'none' }}>
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
      <Modal open={openLoader} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <center>
          <Box sx={styleLoader}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>
    </AuthWrapper1>
  );
};

const styleLoader = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 80,
  height: 80,
  bgcolor: 'transparent',
  border: 'none',
  borderRadius: 6,
  boxShadow: 0,
  p: 4
};

export default Signin;
