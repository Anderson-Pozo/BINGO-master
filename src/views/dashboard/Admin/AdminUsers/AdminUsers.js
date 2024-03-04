import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
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
import { IconApps, IconPlus, IconDeviceFloppy, IconTrash, IconEdit, IconCircleX, IconPencil, IconUsers } from '@tabler/icons';

//Firebase Events
import { createDocument, deleteDocument, updateDocument } from 'config/firebaseEvents';

//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { genConst } from 'store/constant';
import { collHistUsr, collUsers } from 'store/collections';
import { inputLabels, titles } from './AdminUsers.texts';
import { uiStyles } from './AdminUsers.styles';

//Utils
import { fullDate } from 'utils/validations';
import { generateId } from 'utils/idGenerator';
import { searchingData } from 'utils/search';
import { useGetAdminUsers } from 'hooks/useGetAdminUsers';

export default function Users() {
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
  const [email, setEMail] = useState(null);
  const [profile, setProfile] = useState(null);
  const [state, setState] = useState(null);
  const [createAt, setCreateAt] = useState(null);
  const [updateAt, setUpdateAt] = useState(null);

  const [search, setSearch] = useState('');
  const [openLoader, setOpenLoader] = useState(false);

  //Hook
  const usersList = useGetAdminUsers();

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

  const cleanData = () => {
    setName('');
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
                      <TableCell align="left">
                        {r.profile === genConst.CONST_PRO_ADM ? genConst.CONST_PRO_ADM_TXT : genConst.CONST_PRO_STU_TXT}
                      </TableCell>
                      <TableCell align="left">
                        {r.state === genConst.CONST_STA_ACT ? genConst.CONST_STA_ACT_TXT : genConst.CONST_STA_INACT_TXT}
                      </TableCell>
                      <TableCell align="center">
                        <ButtonGroup variant="contained">
                          <Button
                            style={{ backgroundColor: genConst.CONST_UPDATE_COLOR }}
                            onClick={() => {
                              setId(r.id);
                              setTitle(titles.titleUpdate);
                              setName(r.name);
                              setEMail(r.email);
                              setProfile(r.profile);
                              setState(r.state);
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
                  <Grid item lg={6} md={6} sm={6} xs={6} style={{ marginBottom: 30 }}>
                    <FormControl fullWidth>
                      <InputLabel>
                        <strong>Usuario desde: </strong>
                        {createAt}
                      </InputLabel>
                    </FormControl>
                  </Grid>
                ) : (
                  <></>
                )}
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
