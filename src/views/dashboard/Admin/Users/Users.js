import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  Menu,
  MenuItem,
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Modal,
  Grid,
  InputLabel,
  OutlinedInput,
  FormControl,
  ButtonGroup,
  Select
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CircularProgress from '@mui/material/CircularProgress';
import User1 from 'assets/images/profile/profile-picture-6.jpg';
import MessageDark from 'components/message/MessageDark';
import { IconApps, IconPlus, IconDeviceFloppy, IconTrash, IconEdit, IconCircleX, IconPencil, IconUsers, IconNetwork } from '@tabler/icons';
//Firebase Events
import { createDocument, deleteDocument, getDad, getUserDataSubscription, updateDocument } from 'config/firebaseEvents';
//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { genConst } from 'store/constant';
import { collHistUsr, collKhuskaBenefit, collSubscription, collUserBenefit, collUsers } from 'store/collections';
import { inputLabels, titles } from './Users.texts';
import { uiStyles } from './Users.styles';
//Utils
import { endDateWithParam, fullDate, initDate } from 'utils/validations';
import { generateId } from 'utils/idGenerator';
import { searchingData } from 'utils/search';
import { useGetUsers } from 'hooks/useGetUsers';

let globalTotal = 0;

export default function Users() {
  let navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState(null);

  const [id, setId] = useState(null);
  const [name, setName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEMail] = useState(null);
  const [code, setCode] = useState(null);
  const [refer, setRefer] = useState(null);
  const [profile, setProfile] = useState(null);
  const [state, setState] = useState(null);
  const [createAt, setCreateAt] = useState(null);
  const [updateAt, setUpdateAt] = useState(null);
  const [subData, setSubData] = useState({
    cancelData: null,
    description: null,
    endDate: null,
    isUser: null,
    price: null,
    startDate: null,
    state: null,
    totalDays: null
  });

  const [search, setSearch] = useState('');
  const [openLoader, setOpenLoader] = useState(false);

  //Hook
  const usersList = useGetUsers();

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };
  const handleCloseCreate = () => {
    setOpenCreate(false);
  };

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleUsrck = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const reloadData = () => {
    window.location.reload();
  };

  const handleCreateUser = () => {
    if (!name || !email) {
      toast.info(titles.require, { position: toast.POSITION.TOP_RIGHT });
    } else {
      const idUsr = generateId(10);
      setOpenLoader(true);
      const object = {
        avatar: null,
        createAt: fullDate(),
        description: null,
        email: email,
        id: idUsr,
        name: name,
        lastName: lastName,
        fullName: name + ' ' + lastName,
        phone: null,
        profile: genConst.CONST_PRO_DEF,
        state: genConst.CONST_STA_ACT,
        updateAt: null
      };
      setTimeout(() => {
        setOpenLoader(false);
        setOpenCreate(false);
        reloadData();
        console.log(object);
        toast.success(titles.successCreate, { position: toast.POSITION.TOP_RIGHT });
      }, 2000);
    }
  };

  const handleEditUser = () => {
    if (!name || !email || !profile || !state) {
      toast.info(titles.require, { position: toast.POSITION.TOP_RIGHT });
    } else {
      const object = {
        email: email,
        name: name,
        lastName: lastName,
        fullName: name + ' ' + lastName,
        state: state,
        profile: profile,
        updateAt: fullDate()
      };
      setOpenLoader(true);
      updateDocument(collUsers, id, object);
      setTimeout(() => {
        setOpenLoader(false);
        setOpenCreate(false);
        reloadData();
        toast.success(titles.successUpdate, { position: toast.POSITION.TOP_RIGHT });
      }, 2000);
    }
  };

  const handleDeleteUser = () => {
    setOpenLoader(true);
    const usrHistId = generateId(10);
    const objectHist = {
      action: titles.labelDelete,
      createAt: createAt,
      deleteAt: fullDate(),
      email: email,
      id: usrHistId,
      name: name,
      lastName: lastName,
      fullName: name + ' ' + lastName,
      state: genConst.CONST_STA_INACT,
      updateAt: updateAt
    };
    deleteDocument(collUsers, id);
    createDocument(collHistUsr, usrHistId, objectHist);
    setTimeout(() => {
      setOpenLoader(false);
      setOpenDelete(false);
      reloadData();
      toast.success(titles.successDelete, { position: toast.POSITION.TOP_RIGHT });
      cleanData();
    }, 2000);
  };

  const handleMonthSub = () => {
    setOpenLoader(true);
    const subObj = {
      state: genConst.CONST_STATE_AC,
      startDate: fullDate(),
      endDate: endDateWithParam(genConst.CONST_MONTH_DAYS),
      price: genConst.CONST_MONTH_VALUE,
      description: 'Estandar (30 días)',
      totalDays: genConst.CONST_MONTH_DAYS
    };
    const usrObj = {
      subState: genConst.CONST_STATE_AC,
      state: genConst.CONST_STATE_AC
    };

    setTimeout(function () {
      setOpenLoader(false);
      updateDocument(collSubscription, id, subObj);
      updateDocument(collUsers, id, usrObj);
      //sendActiveSubscriptionEmail(userEmail, userName, initDate(), 30, endDateMonth(), 'Manual', 30);
      //history.push('/dashboard');
      toast.success('Suscripción activada por un mes!', { position: toast.POSITION.TOP_RIGHT, autoClose: 2000 });
    }, 2000);
  };

  const handleYearSub = () => {
    setOpenLoader(true);
    const subObj = {
      state: genConst.CONST_STATE_AC,
      startDate: fullDate(),
      endDate: endDateWithParam(genConst.CONST_YEAR_DAYS),
      price: genConst.CONST_YEAR_VALUE,
      description: 'Estandar (365 días)',
      totalDays: genConst.CONST_YEAR_DAYS
    };
    const usrObj = {
      subState: genConst.CONST_STATE_AC
    };

    setTimeout(function () {
      setOpenLoader(false);
      updateDocument(collSubscription, id, subObj);
      updateDocument(collUsers, id, usrObj);
      //sendActiveSubscriptionEmail(userEmail, userName, initDate(), 30, endDateMonth(), 'Manual', 30);
      toast.success('Suscripción activada por un año!', { position: toast.POSITION.TOP_RIGHT, autoClose: 2000 });
    }, 2000);
  };

  const handleActiveMonth = async () => {
    setOpenLoader(true);
    globalTotal = genConst.CONST_MONTH_VALUE;
    let total = genConst.CONST_MONTH_VALUE;
    let IVA = total * genConst.CONST_IVA;
    let SUB = total - IVA;
    console.log(total, SUB, IVA);
    let responseService = genConst.CONST_200;
    let referCode;
    try {
      if (responseService === 200) {
        referCode = refer;
        if (refer == null) {
          //saveKhuskaBenefit(total id, email, initDate());
        } else {
          for (let i = 0; i < 4; i++) {
            //PAGAR
            await getDad(referCode).then((res) => {
              referCode = res.refer;
              generatePaymentDistribution(total, i, res.id, res.email);
              if (res.refer == null) {
                i = 4;
              }
            });
          }
        }
        console.log('GG ' + globalTotal);
        //SAVE KHUSKA BENEFIT
        saveKhuskaBenefit(globalTotal, id, email, initDate());
        //GENERATE KHUSKA BILL
        //generateKhuskaBill(userId, SUB, IVA, total, userName, userEmail);
        //GENERATE PAYMENT
        //generatePaymentData(userId, total, 'M', 1, date1); //1 = TCR

        setTimeout(function () {
          setOpenLoader(false);
          //history.push('/dashboard');
          toast.success('Suscripción ha sido activada por un mes!', { position: toast.POSITION.TOP_RIGHT, autoClose: 2000 });
        }, 6000);
      } else {
        if (responseService === 400) {
          //SERVICIO FUERA DE LINEA
          setOpenLoader(false);
        } else if (responseService === 500) {
          //TARJETA NO VALIDA
          setOpenLoader(false);
        } else {
          //INTENTE MAS TARDE
          setOpenLoader(false);
        }
      }
    } catch (error) {
      setOpenLoader(false);
    }
  };

  const handleActiveYear = async () => {
    setOpenLoader(true);
    globalTotal = genConst.CONST_YEAR_VALUE;
    let total = genConst.CONST_YEAR_VALUE;
    let IVA = total * genConst.CONST_IVA;
    let SUB = total - IVA;
    console.log(total, SUB, IVA);
    let responseService = genConst.CONST_200;
    let referCode;
    try {
      if (responseService === 200) {
        referCode = refer;
        if (refer == null) {
          saveKhuskaBenefit(total, id, email, initDate());
        } else {
          for (let i = 0; i < 4; i++) {
            //PAGAR
            await getDad(referCode).then((res) => {
              referCode = res.refer;
              generatePaymentDistribution(total, i, res.id, res.email);
              if (res.refer == null) {
                i = 4;
              }
            });
          }
        }
        console.log('GG ' + globalTotal);
        //SAVE KHUSKA BENEFIT
        saveKhuskaBenefit(globalTotal, id, email, initDate());
        //GENERATE KHUSKA BILL
        //generateKhuskaBill(userId, SUB, IVA, total, userName, userEmail);
        //GENERATE PAYMENT
        //generatePaymentData(userId, total, 'M', 1, date1); //1 = TCR

        setTimeout(function () {
          setOpenLoader(false);
          //history.push('/dashboard');
          toast.success('Suscripción ha sido activada por un año!', { position: toast.POSITION.TOP_RIGHT, autoClose: 2000 });
        }, 5000);
      } else {
        if (responseService === 400) {
          //SERVICIO FUERA DE LINEA
          setOpenLoader(false);
        } else if (responseService === 500) {
          //TARJETA NO VALIDA
          setOpenLoader(false);
        } else {
          //INTENTE MAS TARDE
          setOpenLoader(false);
        }
      }
    } catch (error) {
      setOpenLoader(false);
    }
  };

  //SAVE KHUSKA BENEFIT
  const saveKhuskaBenefit = (value1, value2, value3, value4) => {
    const idBenefit = generateId(10);
    const obj = {
      id: idBenefit,
      total: value1,
      idUser: value2,
      email: value3,
      createAt: value4,
      name: name,
      lastName: lastName
    };
    createDocument(collKhuskaBenefit, idBenefit, obj);
  };

  const generatePaymentDistribution = (value1, value2, value3, value4) => {
    //SE ENCARGA DE DISTRIBUIR LOS BENEFICIOS A LOS 4 MIEMBROS DE KHUSKA
    var t = 0;
    console.log('FLUJO DISTRIBUCION BENEFICIO RED PERSONAL: ' + globalTotal);
    if (value2 === 0) {
      //LEVEL 1
      t = value1 * genConst.CONST_LVL1;
      globalTotal = globalTotal - t;
      saveUserBenefit(t, value2, value3, value4);
    } else if (value2 === 1) {
      //LEVEL 2
      t = value1 * genConst.CONST_LVL2;
      globalTotal = globalTotal - t;
      saveUserBenefit(t, value2, value3, value4);
    } else if (value2 === 2) {
      //LEVEL 3
      t = value1 * genConst.CONST_LVL3;
      globalTotal = globalTotal - t;
      saveUserBenefit(t, value2, value3, value4);
    } else if (value2 === 3) {
      //LEVEL 4
      t = value1 * genConst.CONST_LVL4;
      globalTotal = globalTotal - t;
      saveUserBenefit(t, value2, value3, value4);
    }
  };

  //SAVE USER BENFIT
  const saveUserBenefit = (value1, value2, value3, value4) => {
    console.log('FLUJO GENERAR BENEFICIO USUARIO');
    const idTran = generateId(8);
    const obj = {
      total: value1,
      level: value2 + 1,
      idRefer: value3,
      emailRefer: value4,
      name: name,
      lastName: lastName,
      email: email,
      idUser: id,
      id: idTran,
      date: fullDate(),
      state: genConst.CONST_BEN_PEN
    };
    createDocument(collUserBenefit, idTran, obj);
    //sendBenefitEmail(value4, nameReferal, userEmail, value1);
  };

  const cleanData = () => {
    setName('');
    setLastName('');
    setCode('');
    setEMail('');
    setProfile('');
    setState('');
  };

  return (
    <div>
      <ToastContainer />
      <AppBar position="static" style={uiStyles.appbar}>
        <Container maxWidth="xl" style={uiStyles.container}>
          <Toolbar disableGutters>
            <IconUsers />
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
                sx={{
                  display: { xs: 'block', md: 'none' }
                }}
              >
                <MenuItem
                  key="id-1"
                  onClick={() => {
                    setTitle(titles.titleCreate);
                    cleanData();
                    setIsEdit(false);
                    handleOpenCreate();
                  }}
                >
                  <IconPlus style={{ marginRight: 4 }} />
                  <Typography textAlign="center">{titles.menuCreate}</Typography>
                </MenuItem>
              </Menu>
            </Box>
            <Box sx={uiStyles.boxMenuActions}>
              <Button
                variant="primary"
                startIcon={<IconApps />}
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleUsrck}
              >
                {titles.generalAction}
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
                    setTitle(titles.titleCreate);
                    cleanData();
                    setIsEdit(false);
                    handleOpenCreate();
                  }}
                >
                  <IconPlus style={{ marginRight: 10 }} />
                  {titles.menuCreate}
                </MenuItem>
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              {usersList.length > 0 ? (
                <OutlinedInput
                  id={inputLabels.search}
                  type="text"
                  name={inputLabels.search}
                  fullWidth
                  onChange={(ev) => setSearch(ev.target.value)}
                  placeholder={inputLabels.placeHolderSearch}
                  style={{ width: 300 }}
                />
              ) : (
                <></>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {usersList.length > 0 ? (
        <Paper sx={uiStyles.paper}>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell key="id-name" align="left" style={{ minWidth: 170, fontWeight: 'bold' }}>
                    {titles.tableCell1}
                  </TableCell>
                  <TableCell key="id-email" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {titles.tableCell2}
                  </TableCell>
                  <TableCell key="id-code" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {titles.tableCellC}
                  </TableCell>
                  <TableCell key="id-profile" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {titles.tableCell3}
                  </TableCell>
                  <TableCell key="id-state" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {titles.tableCell4}
                  </TableCell>
                  <TableCell key="id-actions" align="center" style={{ minWidth: 75, fontWeight: 'bold' }}>
                    {titles.tableCellActions}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usersList
                  .filter(searchingData(search))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((r) => (
                    <TableRow hover key={r.id}>
                      <TableCell align="left">
                        <ButtonGroup>
                          <Avatar src={r.avatar || User1} color="inherit" style={{ width: 32, height: 32 }} />
                          <span style={{ margin: 6 }}>{r.fullName}</span>
                        </ButtonGroup>
                      </TableCell>
                      <TableCell align="left">{r.email}</TableCell>
                      <TableCell align="left">{r.ownReferal}</TableCell>
                      <TableCell align="left">
                        {r.profile === genConst.CONST_PRO_ADM ? genConst.CONST_PRO_ADM_TXT : genConst.CONST_PRO_STU_TXT}
                      </TableCell>
                      <TableCell align="left">
                        {r.state === genConst.CONST_STA_ACT ? (
                          <h4 style={{ color: '#36b836' }}>{genConst.CONST_STA_ACT_TXT}</h4>
                        ) : (
                          <h4 style={{ color: '#d84315' }}>{genConst.CONST_STA_INACT_TXT}</h4>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <ButtonGroup variant="contained">
                          <Button
                            style={{ backgroundColor: genConst.CONST_INFO_COLOR }}
                            onClick={() => {
                              setTitle(titles.titleNetwork);
                              setId(r.id);
                              setCode(r.ownReferal);
                              setName(r.name);
                              setEMail(r.email);
                              navigate({
                                pathname: '/main/network-users',
                                search: `?code=${r.ownReferal}`
                              });
                            }}
                          >
                            <IconNetwork />
                          </Button>
                          <Button
                            style={{ backgroundColor: genConst.CONST_UPDATE_COLOR }}
                            onClick={() => {
                              setId(r.id);
                              setTitle(titles.titleUpdate);
                              setName(r.name);
                              setLastName(r.lastName);
                              setEMail(r.email);
                              setCode(r.ownReferal);
                              setRefer(r.refer);
                              setProfile(r.profile);
                              setState(r.state);
                              setCreateAt(r.createAt);
                              setUpdateAt(r.updateAt);
                              handleOpenCreate();
                              getUserDataSubscription(r.id).then((datos) => {
                                setSubData(datos);
                              });
                              setIsEdit(true);
                            }}
                          >
                            <IconEdit />
                          </Button>
                          <Button
                            style={{ backgroundColor: genConst.CONST_DELETE_COLOR }}
                            onClick={() => {
                              setTitle(titles.titleDelete);
                              setId(r.id);
                              setName(r.name);
                              setEMail(r.email);
                              handleOpenDelete();
                            }}
                          >
                            <IconTrash />
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            labelRowsPerPage={titles.maxRecords}
            component="div"
            count={usersList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : (
        <Grid container style={{ marginTop: 20 }}>
          <Grid item xs={12}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <MessageDark message={titles.loading} submessage="" />
            </Grid>
          </Grid>
        </Grid>
      )}

      <Modal open={openCreate} onClose={handleCloseCreate} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.modalStyles}>
          <Typography id="modal-modal-title" variant="h2" component="h2">
            {title}
          </Typography>
          <Grid container style={{ marginTop: 10 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="name">
                      <span>*</span> {inputLabels.labelName}
                    </InputLabel>
                    <OutlinedInput
                      id={inputLabels.name}
                      type="text"
                      name={inputLabels.name}
                      value={name || ''}
                      inputProps={{}}
                      onChange={(ev) => setName(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="lastName">
                      <span>*</span> {inputLabels.labelLastName}
                    </InputLabel>
                    <OutlinedInput
                      id={inputLabels.lastName}
                      type="text"
                      name={inputLabels.lastName}
                      value={lastName || ''}
                      inputProps={{}}
                      onChange={(ev) => setLastName(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="email">
                      <span>*</span> {inputLabels.labelEmail}
                    </InputLabel>
                    <OutlinedInput
                      id={inputLabels.email}
                      type="email"
                      name={inputLabels.email}
                      value={email || ''}
                      inputProps={{}}
                      onChange={(ev) => setEMail(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id={inputLabels.profile}>* {inputLabels.labelProfile}</InputLabel>
                    <Select
                      labelId={inputLabels.profile}
                      id={inputLabels.profile}
                      value={profile}
                      label={inputLabels.labelProfile}
                      onChange={(ev) => setProfile(ev.target.value)}
                    >
                      <MenuItem value={genConst.CONST_PRO_ADM}>{genConst.CONST_PRO_ADM_TXT}</MenuItem>
                      <MenuItem value={genConst.CONST_PRO_DEF}>{genConst.CONST_PRO_STU_TXT}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id={inputLabels.state}>* {inputLabels.labelState}</InputLabel>
                    <Select
                      labelId={inputLabels.state}
                      id={inputLabels.state}
                      value={state}
                      label={inputLabels.labelState}
                      onChange={(ev) => setState(ev.target.value)}
                    >
                      <MenuItem value={genConst.CONST_STA_ACT}>{genConst.CONST_STA_ACT_TXT}</MenuItem>
                      <MenuItem value={genConst.CONST_STA_INACT}>{genConst.CONST_STA_INACT_TXT}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {isEdit ? (
                  <>
                    <Grid item lg={6} md={6} sm={6} xs={6} style={{ marginBottom: 30 }}>
                      <FormControl fullWidth>
                        <InputLabel>
                          <strong style={{ fontSize: 16 }}>Usuario</strong>
                        </InputLabel>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel>
                          <strong>Usuario desde: </strong>
                          {createAt}
                        </InputLabel>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel>
                          <strong>Código: </strong>
                          {code}
                        </InputLabel>
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={6} style={{ marginBottom: 30 }}>
                      <FormControl fullWidth>
                        <InputLabel>
                          <strong style={{ fontSize: 16 }}>Suscripción</strong>
                        </InputLabel>
                      </FormControl>
                      {subData.state == genConst.CONST_STATE_AC ? (
                        <>
                          <FormControl fullWidth>
                            <InputLabel>
                              <strong>Plan Actual: </strong>
                              {subData.description}
                            </InputLabel>
                          </FormControl>
                          <FormControl fullWidth>
                            <InputLabel>
                              <strong>Precio: </strong>
                              {'$ ' + subData.price}
                            </InputLabel>
                          </FormControl>
                          <FormControl fullWidth>
                            <InputLabel>
                              <strong>Fecha hasta: </strong>
                              {subData.endDate}
                            </InputLabel>
                          </FormControl>
                        </>
                      ) : (
                        <FormControl fullWidth>
                          <InputLabel>
                            <strong>ESTADO: </strong>
                            {subData.state == genConst.CONST_STATE_AC
                              ? genConst.CONST_SUB_STATE_ACT_TEXT
                              : genConst.CONST_SUB_STATE_INA_TEXT}
                          </InputLabel>
                        </FormControl>
                      )}
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <center>
                    <h5>Distribución Beneficios en Red personal</h5>
                    <ButtonGroup variant="outlined" aria-label="outlined button group">
                      <Button onClick={handleActiveMonth}>Mensual</Button>
                      <Button onClick={handleActiveYear}>Anual</Button>
                    </ButtonGroup>
                  </center>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <center>
                    <h5>Acciones estado de suscripción</h5>
                    <ButtonGroup variant="outlined" aria-label="outlined button group">
                      <Button onClick={handleMonthSub}>Mensual</Button>
                      <Button onClick={handleYearSub}>Anual</Button>
                    </ButtonGroup>
                  </center>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <ButtonGroup>
                      {!isEdit ? (
                        <Button
                          variant="contained"
                          startIcon={<IconDeviceFloppy />}
                          size="large"
                          style={{ margin: 5, borderRadius: 10, backgroundColor: genConst.CONST_CREATE_COLOR }}
                          onClick={handleCreateUser}
                        >
                          {titles.buttonCreate}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          startIcon={<IconPencil />}
                          size="large"
                          style={{ margin: 5, borderRadius: 10, backgroundColor: genConst.CONST_UPDATE_COLOR }}
                          onClick={handleEditUser}
                        >
                          {titles.buttonUpdate}
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        startIcon={<IconCircleX />}
                        size="large"
                        style={{ margin: 5, borderRadius: 10, backgroundColor: genConst.CONST_CANCEL_COLOR }}
                        onClick={handleCloseCreate}
                      >
                        {titles.buttonCancel}
                      </Button>
                    </ButtonGroup>
                  </center>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Modal open={openDelete} onClose={handleCloseDelete} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.modalStylesDelete}>
          <Typography id="modal-modal-title" variant="h2" component="h2">
            {title}
          </Typography>
          <Typography id="modal-modal-title" variant="p" component="p" style={{ marginTop: 20, fontSize: 16 }}>
            {titles.titleDeleteModal} <strong>{name}</strong>
          </Typography>
          <Grid container style={{ marginTop: 10 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <ButtonGroup>
                    <Button
                      variant="contained"
                      startIcon={<IconTrash />}
                      size="large"
                      style={{ margin: 5, backgroundColor: genConst.CONST_DELETE_COLOR }}
                      onClick={handleDeleteUser}
                    >
                      {titles.buttonDelete}
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<IconCircleX />}
                      size="large"
                      style={{ margin: 5, backgroundColor: genConst.CONST_CANCEL_COLOR }}
                      onClick={handleCloseDelete}
                    >
                      {titles.buttonCancel}
                    </Button>
                  </ButtonGroup>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <Modal open={openLoader} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <center>
          <Box sx={uiStyles.modalStylesLoader}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>
    </div>
  );
}
