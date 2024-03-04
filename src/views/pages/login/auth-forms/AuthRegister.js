/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  useMediaQuery,
  Modal
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// Firebase
import { authentication, db } from 'config/firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { collection, setDoc, doc, getDocs, where, query } from 'firebase/firestore';

//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// project imports
import AnimateButton from 'components/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

//Utils
import { fullDate, generateDate } from 'utils/validations';
import { genConst } from 'store/constant';
import {
  collUsers,
  collSubscription,
  collUserLog,
  collUserAddress,
  collUserPhone,
  collUserBillData,
  collUserPaymentMethod,
  collInbox,
  collNotifications
} from 'store/collections';
import { createDocument } from 'config/firebaseEvents';
import { generateOwnReferalNumber } from 'utils/idGenerator';
import { isEmpty } from 'lodash';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 600,
  bgcolor: 'background.paper',
  border: 'none',
  borderRadius: 6,
  boxShadow: 24,
  p: 4
};

const AuthRegister = ({ ...others }) => {
  let navigate = useNavigate();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const [showPassword, setShowPassword] = useState(false);

  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();

  const [open, setOpen] = React.useState(false);
  const [openLoader, setOpenLoader] = React.useState(false);
  const handleClose = () => setOpen(false);

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
  };

  useEffect(() => {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        navigate('/app/dashboard');
      }
    });
  }, []);

  const createUserAditionalData = (uid, email) => {
    //Subscription
    const objSubscription = {
      idUser: uid,
      startDate: null,
      endDate: null,
      cancelDate: null,
      state: genConst.CONST_STATE_IN
    };
    createDocument(collSubscription, uid, objSubscription);
    //Log
    const userLog = {
      idUser: uid,
      loginDate: fullDate(),
      email: email,
      state: genConst.CONST_STATE_IN,
      message: 'Registro de nuevo usuario.'
    };
    createDocument(collUserLog, uid, userLog);
    //Address
    const userAddress = {
      idUser: uid,
      principal: '',
      secondary: '',
      number: '',
      city: '',
      province: '',
      reference: ''
    };
    createDocument(collUserAddress, uid, userAddress);
    //Phone
    const userPhone = {
      idUser: uid,
      phone: ''
    };
    createDocument(collUserPhone, uid, userPhone);
    //BillData
    const userBillData = {
      idUser: uid,
      name: '',
      ci: '',
      address: '',
      email: '',
      city: '',
      phone: '',
      postal: ''
    };
    createDocument(collUserBillData, uid, userBillData);
    //Payment Data
    const userPaymentData = {
      idUser: uid,
      name: '',
      number: '',
      numberMask: null,
      date: '',
      cvc: '',
      cvcmd5: null
    };
    createDocument(collUserPaymentMethod, uid, userPaymentData);
    //Inbox
    const inbox = {
      to: email,
      from: 'Khuska Admin',
      date: generateDate(),
      message: 'Bienvenido a Khuska',
      subject: 'Bienvenida'
    };
    createDocument(collInbox, uid, inbox);
    //Notifications
    const notifications = {
      to: email,
      from: 'Khuska Admin',
      date: generateDate(),
      message: 'No olvides actualizar tu información de perfil.',
      subject: 'Notificación',
      state: genConst.CONST_NOTIF_NL
    };
    createDocument(collNotifications, uid, notifications);
  };

  return (
    <>
      <ToastContainer />
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          emailRef: '',
          password: '',
          description: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          firstName: Yup.string().required('Ingresa el Nombre'),
          lastName: Yup.string().required('Ingresa el Apellido'),
          email: Yup.string().email('Debes ingresar un correo válido').max(255).required('Correo Electrónico es requerido'),
          password: Yup.string().min(6, 'Contraseña debe tener al menos 6 caracteres').max(255).required('Contraseña es requerida')
        })}
        onSubmit={async (values, { resetForm }) => {
          setOpenLoader(true);
          if (isEmpty(values.emailRef)) {
            createUserWithEmailAndPassword(authentication, values.email, values.password)
              .then((userCredential) => {
                const user = userCredential.user;
                updateProfile(authentication.currentUser, {
                  displayName: values.firstName + ' ' + values.lastName
                });
                let refCode = generateOwnReferalNumber(6);
                setDoc(doc(db, collUsers, user.uid), {
                  id: user.uid,
                  fullName: values.firstName + ' ' + values.lastName,
                  name: values.firstName,
                  lastName: values.lastName,
                  email: values.email,
                  description: '',
                  gender: '',
                  birthday: '',
                  avatar: null,
                  state: genConst.CONST_STATE_IN,
                  subState: genConst.CONST_STATE_IN,
                  profile: genConst.CONST_PRO_DEF,
                  createAt: fullDate(),
                  registerDate: fullDate(),
                  date: fullDate(),
                  city: null,
                  ci: null,
                  refer: null,
                  ownReferal: refCode,
                  url: null
                });
                createUserAditionalData(user.uid, values.email);
                resetForm({ values: '' });
                toast.success('Usuario registrado correctamente!.', { position: toast.POSITION.TOP_RIGHT });
                setTimeout(() => {
                  setOpenLoader(false);
                  navigate('/app/dashboard');
                }, 2000);
              })
              .catch((error) => {
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
          } else {
            if (isNaN(values.emailRef)) {
              const q = query(collection(db, collUsers), where('email', '==', values.emailRef));
              const querySnapshot = await getDocs(q);
              let referCode = null;
              if (querySnapshot.size > 0) {
                querySnapshot.forEach((doc) => {
                  referCode = doc.data().ownReferal;
                  toast.success('Persona referida encontrada! ' + doc.data().ownReferal, { position: toast.POSITION.TOP_RIGHT });
                });
                createUserWithEmailAndPassword(authentication, values.email, values.password)
                  .then((userCredential) => {
                    const user = userCredential.user;
                    updateProfile(authentication.currentUser, {
                      displayName: values.firstName + ' ' + values.lastName
                    });
                    let refCode = generateOwnReferalNumber(6);
                    setDoc(doc(db, collUsers, user.uid), {
                      id: user.uid,
                      fullName: values.firstName + ' ' + values.lastName,
                      name: values.firstName,
                      lastName: values.lastName,
                      email: values.email,
                      description: '',
                      gender: '',
                      birthday: '',
                      avatar: null,
                      state: genConst.CONST_STATE_IN,
                      profile: genConst.CONST_PRO_DEF,
                      createAt: fullDate(),
                      registerDate: fullDate(),
                      date: fullDate(),
                      city: null,
                      ci: null,
                      refer: referCode,
                      ownReferal: refCode,
                      url: null
                    });
                    createUserAditionalData(user.uid, values.email);
                    resetForm({ values: '' });
                    toast.success('Usuario registrado correctamente!.', { position: toast.POSITION.TOP_RIGHT });
                    setTimeout(() => {
                      setOpenLoader(false);
                      navigate('/app/dashboard');
                    }, 4000);
                  })
                  .catch((error) => {
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
              } else {
                toast.info('Persona referida no encontrada!', { position: toast.POSITION.TOP_RIGHT });
                setOpen(false);
              }
            } else {
              const q = query(collection(db, collUsers), where('ownReferal', '==', values.emailRef));
              const querySnapshot = await getDocs(q);
              let referCode = null;
              if (querySnapshot.size > 0) {
                querySnapshot.forEach((doc) => {
                  referCode = doc.data().ownReferal;
                  toast.success('Persona referida encontrada! ' + doc.data().ownReferal, { position: toast.POSITION.TOP_RIGHT });
                });
                createUserWithEmailAndPassword(authentication, values.email, values.password)
                  .then((userCredential) => {
                    const user = userCredential.user;
                    updateProfile(authentication.currentUser, {
                      displayName: values.firstName + ' ' + values.lastName
                    });
                    let refCode = generateOwnReferalNumber(6);
                    setDoc(doc(db, collUsers, user.uid), {
                      id: user.uid,
                      fullName: values.firstName + ' ' + values.lastName,
                      name: values.firstName,
                      lastName: values.lastName,
                      email: values.email,
                      description: '',
                      gender: '',
                      birthday: '',
                      avatar: null,
                      state: genConst.CONST_STATE_IN,
                      profile: genConst.CONST_PRO_DEF,
                      createAt: fullDate(),
                      registerDate: fullDate(),
                      date: fullDate(),
                      city: null,
                      ci: null,
                      refer: referCode,
                      ownReferal: refCode,
                      url: null
                    });
                    createUserAditionalData(user.uid, values.email);
                    resetForm({ values: '' });
                    toast.success('Usuario registrado correctamente!.', { position: toast.POSITION.TOP_RIGHT });
                    setTimeout(() => {
                      setOpenLoader(false);
                      navigate('/app/dashboard');
                    }, 4000);
                  })
                  .catch((error) => {
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
              } else {
                toast.info('Persona referida no encontrada!', { position: toast.POSITION.TOP_RIGHT });
                setOpen(false);
              }
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={matchDownSM ? 0 : 2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.firstName && errors.firstName)} sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="outlined-adornment-firstName-register">Nombre</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-firstName-register"
                    type="text"
                    value={values.firstName}
                    name="firstName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    inputProps={{}}
                  />
                  {touched.firstName && errors.firstName && (
                    <FormHelperText error id="standard-weight-helper-text--register">
                      {errors.firstName}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.lastName && errors.lastName)} sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="outlined-adornment-lastName-register">Apellido</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-lastName-register"
                    type="text"
                    value={values.lastName}
                    name="lastName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    inputProps={{}}
                  />
                  {touched.lastName && errors.lastName && (
                    <FormHelperText error id="standard-weight-helper-text--register">
                      {errors.lastName}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-register">Correo Electrónico</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-register"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text--register">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-register">Contraseña</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-register"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                label="Contraseña"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
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
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-register">
                  {errors.password}
                </FormHelperText>
              )}
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
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
            <FormControl fullWidth error={Boolean(touched.emailRef && errors.emailRef)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-register">Correo o Código de Referidor (Opcional)</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-register"
                type="email"
                value={values.emailRef}
                name="emailRef"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.emailRef && errors.emailRef && (
                <FormHelperText error id="standard-weight-helper-text--register">
                  {errors.emailRef}
                </FormHelperText>
              )}
            </FormControl>

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Registrarse
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
      <Modal open={openLoader} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <center>
          <Box sx={styleLoader}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" component="h4">
            Términos y Condiciones de Uso de Sitio Web
          </Typography>
          <Typography id="modal-modal-subtitle" sx={{ mt: 2 }} variant="h5" component="h5">
            Términos y condiciones de uso de sitio web
          </Typography>
          <Typography id="modal-modal-obj1" sx={{ mt: 2 }} variant="h5" component="h5">
            1. ACEPTACIÓN
          </Typography>
          <Typography id="modal-modal-description-obj1" sx={{ mt: 2 }} align="justify">
            En el presente documento (en adelante, el “Contrato”) se establecen los términos y condiciones de Robert Half Internacional
            Empresa de Servicios Transitorios Limitada, con domicilio en Avenida Isidora Goyenechea 2800 Piso 15. Torre Titanium 7550-647
            Las Condes, que serán de aplicación al acceso y uso por parte del Usuario de esta página web (el “Sitio Web”). Les rogamos lean
            atentamente el presente Contrato. Al acceder, consultar o utilizar el Sitio Web, los Usuarios (“Vd.”, “usted”, “Usuario”, o
            “usuario”) aceptan cumplir los términos y condiciones establecidos en este Contrato. En caso de que usted no acepte quedar
            vinculado por los presentes términos y condiciones, no podrá acceder a, ni utilizar, el Sitio Web. Robert Half Internacional
            Empresa de Servicios Transitorios Limitada y sus respectivas empresas afiliadas (en conjunto, “RH”) se reservan el derecho de
            actualizar el presente Contrato siempre que lo consideren oportuno. En consecuencia, recomendamos al Usuario revisar
            periódicamente las modificaciones efectuadas al Contrato. El presente Sitio Web está dirigido exclusivamente a personas
            residentes en Chile. Los Usuarios residentes o domiciliados en otro país que deseen acceder y utilizar el Sitio Web, lo harán
            bajo su propio riesgo y responsabilidad, por lo que deberán asegurarse de que dichos accesos y/o usos cumplen con la legislación
            aplicable en su país.
          </Typography>
          <Typography id="modal-modal-obj2" sx={{ mt: 2 }} variant="h5" component="h5">
            2. REQUISITOS RELATIVOS AL USUARIO
          </Typography>
          <Typography id="modal-modal-description-obj2" sx={{ mt: 2 }} align="justify">
            El Sitio Web y los servicios relacionados con el mismo se ofrecen a los Usuarios que tengan capacidad legal para otorgar
            contratos legalmente vinculantes según la legislación aplicable. Los menores no están autorizados para utilizar el Sitio Web. Si
            usted es menor de edad, por favor, no utilice esta web.
          </Typography>
          <Typography id="modal-modal-obj3" sx={{ mt: 2 }} variant="h5" component="h5">
            3. LICENCIA
          </Typography>
          <Typography id="modal-modal-description-obj3" sx={{ mt: 2 }} align="justify">
            En este acto, RH otorga al Usuario una licencia limitada, no exclusiva, intransferible, no susceptible de cesión y revocable;
            para consultar y descargar, de forma temporal, una copia del contenido ofrecido en el Sitio Web, únicamente para uso personal
            del Usuario o dentro de su empresa, y nunca con fines comerciales. Todo el material mostrado u ofrecido en el Sitio Web, entre
            otros ejemplos, el material gráfico, los documentos, textos, imágenes, sonido, video, audio, las ilustraciones, el software y el
            código HTML (en conjunto, el “Contenido”), es de exclusiva propiedad de RH o de las empresas que facilitan dicho material. El
            Contenido está protegido por las leyes de copyright chilenas, estadounidenses e internacionales, así como por las demás leyes,
            reglamentos y normas aplicables a los derechos de propiedad intelectual. Salvo disposición expresa en contrario en el presente
            contrato, y/o salvo que por imperativo legal ello esté expresamente permitido por leyes derogatorias de las actualmente
            vigentes, el Usuario no podrá (i) utilizar, copiar, modificar, mostrar, eliminar, distribuir, descargar, almacenar, reproducir,
            transmitir, publicar, vender, revender, adaptar, invertir el proceso de creación o crear productos derivados a partir de, el
            Contenido. Tampoco podrá (ii) utilizar el Contenido en otras páginas Web o en cualquier medio de comunicación como, por ejemplo,
            en un entorno de red, sin la previa autorización por escrito en este sentido de RH. Todas las marcas comerciales, las marcas de
            servicio y los logos (en adelante, las “Marcas”) mostrados en el Sitio Web son propiedad exclusiva de RH y de sus respectivos
            propietarios. El Usuario no podrá utilizar las Marcas en modo alguno sin la previa autorización por escrito para ello de RH y
            los respectivos propietarios.
          </Typography>
        </Box>
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

export default AuthRegister;
