import React, { useState, useEffect } from 'react';

import { useTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, IconButton, MenuItem, Menu, Paper, Avatar } from '@mui/material';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';
import { ButtonGroup, Button, Grid, Modal, Box, FormControl, OutlinedInput } from '@mui/material';
import { IconCircleX, IconDeviceFloppy, IconEdit, IconMenu2, IconNotification, IconTrash } from '@tabler/icons';
import { uiStyles } from './Notifications.styles';
import MessageDark from 'components/message/MessageDark';
import { collGenNoti } from 'store/collections';
import { createGlobalNotification, deleteDocument, getGeneralNotifications, updateDocument } from 'config/firebaseEvents';
import { genConst } from 'store/constant';
import { titles, inputLabels } from './Notifications.texts';
import CircularProgress from '@mui/material/CircularProgress';
import User1 from 'assets/images/profile/profile-picture-6.jpg';

//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import * as Msg from 'store/message';
import { fullDate } from 'utils/validations';

const GeneralNotifications = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const [dataList, setDataList] = React.useState([]);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openLoader, setOpenLoader] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [message, setMessage] = React.useState(null);
  const [notId, setNotId] = React.useState(null);

  const getData = async () => {
    getGeneralNotifications().then((list) => {
      setDataList(list);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };
  const handleCloseCreate = () => {
    setOpenCreate(false);
    setMessage(null);
  };

  const handleOpenEdit = () => {
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
    setMessage(null);
  };

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleMenu = (event) => {
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

  const handleCreate = () => {
    if (!message) {
      toast.info(Msg.notcreinf, { position: toast.POSITION.TOP_RIGHT });
    } else {
      setOpenLoader(true);
      createGlobalNotification(message, titles.subjectNotif);
      setTimeout(() => {
        setOpenLoader(false);
        setOpenCreate(false);
        getData();
        setMessage(null);
        toast.success(Msg.notcresucc, { position: toast.POSITION.TOP_RIGHT });
      }, 2000);
    }
  };

  const handleEdit = () => {
    if (!message) {
      toast.info(Msg.notcreinf, { position: toast.POSITION.TOP_RIGHT });
    } else {
      setOpenLoader(true);
      const object = {
        message: message,
        updateAt: fullDate()
      };
      updateDocument(collGenNoti, notId, object);
      setTimeout(() => {
        setOpenLoader(false);
        setOpenEdit(false);
        getData();
        setMessage(null);
        toast.success(Msg.notupdsucc, { position: toast.POSITION.TOP_RIGHT });
      }, 2000);
    }
  };

  const handleDelete = () => {
    setOpenLoader(true);
    deleteDocument(collGenNoti, notId);
    setTimeout(() => {
      setOpenLoader(false);
      setOpenDelete(false);
      getData();
      setMessage(null);
      toast.success(Msg.notdelsucc, { position: toast.POSITION.TOP_RIGHT });
    }, 2000);
  };

  return (
    <div>
      <ToastContainer />
      <AppBar position="static" style={uiStyles.appbar}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <IconNotification />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#FFF' }}></Typography>

          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <IconMenu2 />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  handleOpenCreate();
                  handleClose();
                }}
              >
                Crear Notificación
              </MenuItem>
              <MenuItem onClick={handleClose}>Refrescar</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      {dataList.length > 0 ? (
        <Paper sx={uiStyles.paper}>
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell key="id-col1" align="left" style={{ minWidth: 60, fontWeight: 'bold' }}>
                    {inputLabels.tableCol1}
                  </TableCell>
                  <TableCell key="id-col2" align="left" style={{ minWidth: 200, fontWeight: 'bold' }}>
                    {inputLabels.tableCol2}
                  </TableCell>
                  <TableCell key="id-col3" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {inputLabels.tableCol3}
                  </TableCell>
                  <TableCell key="id-actions" align="center" style={{ minWidth: 75, fontWeight: 'bold' }}>
                    {inputLabels.actions}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r) => (
                  <TableRow hover key={r.id}>
                    <TableCell align="left">
                      <Avatar src={r.avatar || User1} color="inherit" style={{ width: 28, height: 28 }} />
                    </TableCell>
                    <TableCell align="left">{r.message}</TableCell>
                    <TableCell align="left">{r.createAt}</TableCell>
                    <TableCell align="center">
                      <ButtonGroup variant="contained">
                        <Button
                          style={{ backgroundColor: genConst.CONST_UPDATE_COLOR }}
                          onClick={() => {
                            setMessage(r.message);
                            setNotId(r.id);
                            handleOpenEdit();
                          }}
                        >
                          <IconEdit />
                        </Button>
                        <Button
                          style={{ backgroundColor: genConst.CONST_DELETE_COLOR }}
                          onClick={() => {
                            setNotId(r.id);
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
            {titles.modalCreate}
          </Typography>
          <Grid container style={{ marginTop: 10 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <OutlinedInput
                      id={inputLabels.message}
                      type="text"
                      multiline
                      rows={4}
                      name={inputLabels.message}
                      value={message || ''}
                      placeholder={inputLabels.labelMessage}
                      onChange={(ev) => setMessage(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <ButtonGroup>
                      <Button
                        variant="contained"
                        startIcon={<IconDeviceFloppy />}
                        size="large"
                        style={{ margin: 5, borderRadius: 10, backgroundColor: genConst.CONST_CREATE_COLOR }}
                        onClick={handleCreate}
                      >
                        {titles.buttonCreate}
                      </Button>
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

      <Modal open={openEdit} onClose={handleCloseEdit} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.modalStyles}>
          <Typography id="modal-modal-title" variant="h2" component="h2">
            {titles.modalEdit}
          </Typography>
          <Grid container style={{ marginTop: 10 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <OutlinedInput
                      id={inputLabels.message}
                      type="text"
                      multiline
                      rows={4}
                      name={inputLabels.message}
                      value={message || ''}
                      placeholder={inputLabels.labelMessage}
                      onChange={(ev) => setMessage(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <ButtonGroup>
                      <Button
                        variant="contained"
                        startIcon={<IconDeviceFloppy />}
                        size="large"
                        style={{ margin: 5, borderRadius: 10, backgroundColor: genConst.CONST_UPDATE_COLOR }}
                        onClick={handleEdit}
                      >
                        {titles.buttonEdit}
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<IconCircleX />}
                        size="large"
                        style={{ margin: 5, borderRadius: 10, backgroundColor: genConst.CONST_CANCEL_COLOR }}
                        onClick={handleCloseEdit}
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
            {titles.modaleDeleteDetail}
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
};

export default GeneralNotifications;
