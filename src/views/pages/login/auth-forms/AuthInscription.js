/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  useMediaQuery,
  Modal,
  TextField,
  MenuItem
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

// Firebase
import { authentication, db } from 'config/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { getDocuments } from 'config/firebaseEvents';

//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// project imports
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { validateEmail } from 'utils/validations';
import { size } from 'lodash';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

//Utils
import { fullDate } from 'utils/validations';
import { genConst } from 'store/constant';
import { collCourses, collUsers } from 'store/collections';
import { generateId } from 'utils/idGenerator';

const AuthInscription = () => {
  let navigate = useNavigate();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();

  const [firstName, setFirstName] = React.useState(null);
  const [lastName, setLastName] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [course, setCourse] = React.useState(null);

  const [dataList, setDataList] = React.useState([]);

  const [openLoader, setOpenLoader] = React.useState(false);

  const getData = async () => {
    const list = [];
    const querySnapshot = await getDocuments(collCourses);
    querySnapshot.forEach((doc) => {
      list.push(doc.data());
      list.sort((a, b) => a.id.localeCompare(b.id));
    });
    setDataList(list);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
    setPassword(value);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleInscription = () => {
    if (!firstName || !lastName || !email || !password || !course) {
      toast.info('Todos los campos marcados con * son obligatorios!.', { position: toast.POSITION.TOP_RIGHT });
    } else if (!validateEmail(email)) {
      toast.info('Por favor, ingresa una dirección de correo electrónico válida.', { position: toast.POSITION.TOP_RIGHT });
    } else if (size(password) < 6) {
      toast.info('La contraseña debe tener al menos 6 caracteres.', { position: toast.POSITION.TOP_RIGHT });
    } else {
      setOpenLoader(true);
      createUserWithEmailAndPassword(authentication, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(authentication.currentUser, {
            displayName: firstName + ' ' + lastName
          });
          setDoc(doc(db, collUsers, user.uid), {
            id: user.uid,
            name: firstName + ' ' + lastName,
            email: email,
            avatar: null,
            state: 1,
            profile: genConst.CONST_PRO_DEF,
            createAt: fullDate()
          });
          setDoc(doc(db, 'CourseUserRequest', generateId(10)), {
            id: user.uid,
            name: firstName + ' ' + lastName,
            email: email,
            course: course,
            state: 2,
            createAt: fullDate()
          });
          //toast.success('Usuario registrado correctamente!.', { position: toast.POSITION.TOP_RIGHT });
          setTimeout(() => {
            setOpenLoader(false);
            navigate({
              pathname: '/auth/payment-methods',
              search: createSearchParams({ name: firstName, lastName: lastName, email: email, course: course }).toString()
            });
          }, 3000);
        })
        .catch((error) => {
          setOpenLoader(false);
          if (error.code === 'auth/user-not-found') {
            toast.error('Upsss! Usuario no encontrado. Por favor regístrate.', { position: toast.POSITION.TOP_RIGHT });
          } else if (error.code === 'auth/wrong-password') {
            toast.error('Upsss! Contraseña incorrecta.', { position: toast.POSITION.TOP_RIGHT });
          } else if (error.code === 'auth/user-disabled') {
            toast.error('Upsss! Tu cuenta se encuentra inhabilitada!.', { position: toast.POSITION.TOP_RIGHT });
          } else if (error.code === 'auth/internal-error') {
            toast.error('Error interno, por favor comuniquese con el administrador del sistema!.', {
              position: toast.POSITION.TOP_RIGHT
            });
          } else if (error.code === 'auth/network-request-failed') {
            toast.error('Error en la red, por favor intente más tarde!.', { position: toast.POSITION.TOP_RIGHT });
          } else {
            console.log(error);
          }
        });
    }
  };

  return (
    <>
      <ToastContainer />
      <div>
        <Grid container spacing={matchDownSM ? 0 : 2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="firstName">* Nombre</InputLabel>
              <OutlinedInput id="firstName" type="text" name="firstName" onChange={(ev) => setFirstName(ev.target.value)} inputProps={{}} />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="lastName">* Apellido</InputLabel>
              <OutlinedInput id="lastName" type="text" name="lastName" onChange={(ev) => setLastName(ev.target.value)} inputProps={{}} />
            </FormControl>
          </Grid>
        </Grid>
        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
          <InputLabel htmlFor="email">* Correo Electrónico</InputLabel>
          <OutlinedInput id="email" type="email" name="email" onChange={(ev) => setEmail(ev.target.value)} inputProps={{}} />
        </FormControl>

        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
          <InputLabel htmlFor="password">* Contraseña</InputLabel>
          <OutlinedInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            label="Contraseña"
            onChange={(e) => {
              changePassword(e.target.value);
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  size="large"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            inputProps={{}}
          />
        </FormControl>

        {strength !== 0 && (
          <FormControl fullWidth>
            <Box sx={{ mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Box style={{ backgroundColor: level?.color }} sx={{ width: 85, height: 8, borderRadius: '7px' }} />
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1" fontSize="0.75rem">
                    {level?.label}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </FormControl>
        )}

        <FormControl fullWidth style={{ marginTop: 10 }}>
          <TextField id="courses" select label="* Selecciona el Curso" defaultValue="" onChange={(ev) => setCourse(ev.target.value)}>
            {dataList.length <= 0 ? (
              <MenuItem key="989" value={1000}>
                No existen cursos aún, pero deseo continuar con el registro!!!
              </MenuItem>
            ) : (
              dataList.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))
            )}
          </TextField>
        </FormControl>

        <Box sx={{ mt: 2 }}>
          <Button
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            style={{ borderRadius: 10 }}
            onClick={() => {
              handleInscription();
            }}
          >
            Registrarse
          </Button>
        </Box>
      </div>
      <Modal open={openLoader} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <center>
          <Box sx={styleLoader}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>
    </>
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

export default AuthInscription;
