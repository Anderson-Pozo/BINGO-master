/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import {
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
  TextField,
  ButtonGroup
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CircularProgress from '@mui/material/CircularProgress';
import { uiStyles } from './Clients.styles';

import { IconApps, IconPlus, IconDeviceFloppy, IconTrash, IconEdit, IconCircleX, IconPencil, IconFriends } from '@tabler/icons';

//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Collections
import { collClients, collHistCli } from 'store/collections';
import * as Msg from 'store/message';
import * as LogMsg from 'store/logsMessages';
import { generateId } from 'utils/idGenerator';
import { titles, inputLabels } from './Clients.texts';

//Utils
import { fullDate } from 'utils/validations';
import { createDocument, deleteDocument, updateDocument, getDocuments, createLogRecordWithId } from 'config/firebaseEvents';

//types array
import { types } from 'store/typesClients';
import MessageDark from 'components/message/MessageDark';
import { genConst } from 'store/constant';

function searchingData(search) {
  return function (x) {
    return x.name.toLowerCase().includes(search) || x.name.toUpperCase().includes(search) || x.ci.includes(search) || !search;
  };
}

export default function Clients() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [title, setTitle] = React.useState(null);

  const [id, setId] = React.useState(null);
  const [type, setType] = React.useState(null);
  const [ci, setCi] = React.useState(null);
  const [name, setName] = React.useState(null);
  const [phone, setPhone] = React.useState(null);
  const [address, setAddress] = React.useState(null);
  const [city, setCity] = React.useState(null);
  const [mail, setMail] = React.useState(null);
  const [observations, setObservations] = React.useState(null);
  const [birth, setBirth] = React.useState(null);
  const [createAt, setCreateAt] = React.useState(null);
  const [updateAt, setUpdateAt] = React.useState(null);

  const [search, setSearch] = React.useState('');
  const [openLoader, setOpenLoader] = React.useState(false);
  const [dataList, setDataList] = React.useState([]);

  const getData = async () => {
    const list = [];
    const querySnapshot = await getDocuments(collClients);
    querySnapshot.forEach((doc) => {
      list.push(doc.data());
      list.sort((a, b) => a.name.localeCompare(b.name));
    });
    setDataList(list);
  };

  React.useEffect(() => {
    getData();
  }, []);

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

  const handleClick = (event) => {
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
    getData();
  };

  const handleCreate = () => {
    if (!type || !ci || !name || !phone || !address || !city || !mail) {
      toast.info(Msg.clivalreq, { position: toast.POSITION.TOP_RIGHT });
    } else {
      const ide = generateId(10);
      setOpenLoader(true);
      const obj = {
        address: address,
        birth: birth,
        ci: ci,
        city: city,
        createAt: fullDate(),
        id: ide,
        mail: mail,
        name: name,
        observations: observations,
        phone: phone,
        state: 1,
        type: type,
        updateAt: null
      };
      createDocument(collClients, ide, obj);
      createLogRecordWithId(ide, { details: LogMsg.logclicre, createAt: fullDate(), object: obj });
      setTimeout(() => {
        setOpenLoader(false);
        setOpenCreate(false);
        reloadData();
        toast.success(Msg.clicresucc, { position: toast.POSITION.TOP_RIGHT });
      }, 2000);
    }
  };

  const handleEdit = () => {
    if (!type || !ci || !name || !phone || !address || !city || !mail) {
      toast.info(Msg.clivalreq, { position: toast.POSITION.TOP_RIGHT });
    } else {
      setOpenLoader(true);
      const obj = {
        address: address,
        birth: birth,
        ci: ci,
        city: city,
        mail: mail,
        name: name,
        observations: observations,
        phone: phone,
        type: type,
        updateAt: fullDate()
      };
      updateDocument(collClients, id, obj);
      createLogRecordWithId(id, { details: LogMsg.logcliupd, createAt: fullDate(), object: obj });
      setTimeout(() => {
        setOpenLoader(false);
        setOpenCreate(false);
        reloadData();
        toast.success(Msg.cliupdsucc, { position: toast.POSITION.TOP_RIGHT });
      }, 2000);
    }
  };

  const handleDelete = () => {
    setOpenLoader(true);
    const histId = generateId(10);
    const obj = {
      action: LogMsg.logclidel,
      address: address,
      birth: birth,
      ci: ci,
      city: city,
      createAt: createAt,
      deleteAt: fullDate(),
      id: histId,
      mail: mail,
      name: name,
      observations: observations,
      phone: phone,
      state: 0,
      type: type,
      updateAt: updateAt
    };
    createDocument(collHistCli, histId, obj);
    deleteDocument(collClients, id);
    createLogRecordWithId(histId, { details: LogMsg.logclidel, createAt: fullDate(), object: obj });
    setTimeout(() => {
      setOpenLoader(false);
      setOpenDelete(false);
      reloadData();
      toast.success(Msg.clidelsucc, { position: toast.POSITION.TOP_RIGHT });
      cleanData();
    }, 2000);
  };

  const cleanData = () => {
    setType('');
    setCi('');
    setName('');
    setPhone('');
    setAddress('');
    setCity('');
    setMail('');
    setObservations('');
    setBirth('');
  };

  return (
    <div>
      <ToastContainer />
      <AppBar position="static" style={uiStyles.appbar}>
        <Container maxWidth="xl" style={uiStyles.container}>
          <Toolbar disableGutters>
            <IconFriends />
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
                sx={uiStyles.menu}
              >
                <MenuItem
                  key="id-1"
                  onClick={() => {
                    setTitle(titles.modalCreate);
                    cleanData();
                    setIsEdit(false);
                    handleOpenCreate();
                  }}
                >
                  <IconPlus style={{ marginRight: 4 }} />
                  <Typography textAlign="center">{titles.addMenu}</Typography>
                </MenuItem>
              </Menu>
            </Box>
            <Box sx={uiStyles.box2}>
              <Button
                variant="primary"
                startIcon={<IconApps />}
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                {titles.actions}
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
                    setTitle(titles.modalCreate);
                    cleanData();
                    setIsEdit(false);
                    handleOpenCreate();
                  }}
                >
                  <IconPlus style={{ marginRight: 10 }} />
                  {titles.addMenu}
                </MenuItem>
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              {dataList.length > 0 ? (
                <OutlinedInput
                  id={inputLabels.search}
                  type="text"
                  name={inputLabels.search}
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
      {dataList.length > 0 ? (
        <Paper sx={uiStyles.paper}>
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell key="id-name" align="left" style={{ minWidth: 170, fontWeight: 'bold' }}>
                    {inputLabels.labelName}
                  </TableCell>
                  <TableCell key="id-ci" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {inputLabels.labelCi}
                  </TableCell>
                  <TableCell key="id-phone" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {inputLabels.labelContact}
                  </TableCell>
                  <TableCell key="id-address" align="left" style={{ minWidth: 170, fontWeight: 'bold' }}>
                    {inputLabels.labelAddress}
                  </TableCell>
                  <TableCell key="id-actions" align="center" style={{ minWidth: 75, fontWeight: 'bold' }}>
                    {titles.actions}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataList
                  .filter(searchingData(search))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((r) => (
                    <TableRow hover key={r.id}>
                      <TableCell align="left">{r.name}</TableCell>
                      <TableCell align="left">{r.ci}</TableCell>
                      <TableCell align="left">{r.phone}</TableCell>
                      <TableCell align="left">{r.address}</TableCell>
                      <TableCell align="center">
                        <ButtonGroup variant="contained">
                          <Button
                            style={{ backgroundColor: genConst.CONST_UPDATE_COLOR }}
                            onClick={() => {
                              setId(r.id);
                              setTitle(titles.modalEdit);
                              setType(r.type);
                              setCi(r.ci);
                              setName(r.name);
                              setPhone(r.phone);
                              setAddress(r.address);
                              setCity(r.city);
                              setMail(r.mail);
                              setObservations(r.observations);
                              setBirth(r.birth);
                              setCreateAt(r.createAt);
                              setUpdateAt(r.updateAt);
                              handleOpenCreate();
                              setIsEdit(true);
                            }}
                          >
                            <IconEdit />
                          </Button>
                          <Button
                            style={{ backgroundColor: genConst.CONST_DELETE_COLOR }}
                            onClick={() => {
                              setId(r.id);
                              setType(r.type);
                              setCi(r.ci);
                              setName(r.name);
                              setPhone(r.phone);
                              setAddress(r.address);
                              setCity(r.city);
                              setMail(r.mail);
                              setObservations(r.observations);
                              setBirth(r.birth);
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
            labelRowsPerPage={titles.rowsPerPage}
            component="div"
            count={dataList.length}
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
              <MessageDark message={titles.noRecordsYet} submessage="" />
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
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <TextField
                      id={inputLabels.type}
                      select
                      defaultValue=""
                      helperText={inputLabels.labelType + '*'}
                      onChange={(ev) => setType(ev.target.value)}
                      value={type || '0'}
                    >
                      {types.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor={inputLabels.ci}>{inputLabels.labelCi}</InputLabel>
                    <OutlinedInput
                      id={inputLabels.ci}
                      type="number"
                      name={inputLabels.ci}
                      value={ci || ''}
                      inputProps={{}}
                      onChange={(ev) => setCi(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor={inputLabels.name}>{inputLabels.labelName}</InputLabel>
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
                    <InputLabel htmlFor={inputLabels.phone}>{inputLabels.labelPhone}</InputLabel>
                    <OutlinedInput
                      id={inputLabels.phone}
                      type="number"
                      name={inputLabels.phone}
                      value={phone || ''}
                      inputProps={{}}
                      onChange={(ev) => setPhone(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor={inputLabels.address}>{inputLabels.labelAddress}</InputLabel>
                    <OutlinedInput
                      id={inputLabels.address}
                      type="text"
                      name={inputLabels.address}
                      value={address || ''}
                      inputProps={{}}
                      onChange={(ev) => setAddress(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor={inputLabels.city}>{inputLabels.labelCity}</InputLabel>
                    <OutlinedInput
                      id={inputLabels.city}
                      type="text"
                      name={inputLabels.city}
                      value={city || ''}
                      inputProps={{}}
                      onChange={(ev) => setCity(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor={inputLabels.email}>{inputLabels.labelEmail}</InputLabel>
                    <OutlinedInput
                      id={inputLabels.email}
                      type="email"
                      name={inputLabels.email}
                      value={mail || ''}
                      inputProps={{}}
                      onChange={(ev) => setMail(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor={inputLabels.observations}>{inputLabels.labelObservations}</InputLabel>
                    <OutlinedInput
                      id={inputLabels.observations}
                      type="text"
                      name={inputLabels.observations}
                      value={observations || ''}
                      inputProps={{}}
                      onChange={(ev) => setObservations(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor={inputLabels.birth}>{inputLabels.labelBirth}</InputLabel>
                    <OutlinedInput
                      id={inputLabels.birth}
                      type="date"
                      name={inputLabels.birth}
                      value={birth || ''}
                      inputProps={{}}
                      onChange={(ev) => setBirth(ev.target.value)}
                    />
                  </FormControl>
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
                          onClick={handleCreate}
                        >
                          {titles.buttonCreate}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          startIcon={<IconPencil />}
                          size="large"
                          style={{ margin: 5, borderRadius: 10, backgroundColor: genConst.CONST_UPDATE_COLOR }}
                          onClick={handleEdit}
                        >
                          {titles.buttonEdit}
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
        <Box sx={uiStyles.styleDelete}>
          <Typography id="modal-modal-title" variant="h2" component="h2">
            {titles.modalDelete}
          </Typography>
          <Typography id="modal-modal-title" variant="p" component="p" style={uiStyles.modalDeleteTitle}>
            {titles.modaleDeleteDetail} <strong>{name}</strong>
          </Typography>
          <Grid container style={{ marginTop: 10 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <ButtonGroup>
                      <Button
                        variant="contained"
                        startIcon={<IconTrash />}
                        size="large"
                        style={{ margin: 5, borderRadius: 10, backgroundColor: genConst.CONST_DELETE_COLOR }}
                        onClick={handleDelete}
                      >
                        {titles.buttonDelete}
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<IconCircleX />}
                        size="large"
                        style={{ margin: 5, borderRadius: 10, backgroundColor: genConst.CONST_CANCEL_COLOR }}
                        onClick={handleCloseDelete}
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
      <Modal open={openLoader} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <center>
          <Box sx={uiStyles.styleLoader}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>
    </div>
  );
}
