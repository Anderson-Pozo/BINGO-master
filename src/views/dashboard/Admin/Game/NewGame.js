import React, { useEffect, useState } from 'react';
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
  Box,
  Typography,
  Modal,
  Grid,
  InputLabel,
  OutlinedInput,
  FormControl,
  ButtonGroup
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import MessageDark from 'components/message/MessageDark';
import { IconTrash, IconEdit, IconCircleX, IconDeviceFloppy, IconPlus } from '@tabler/icons';
//Firebase Events
import { createDocument, deleteDocument, getGamesList, updateDocument } from 'config/firebaseEvents';
//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { genConst } from 'store/constant';
import { collGames } from 'store/collections';
import { inputLabels, titles } from './Game.texts';
import { uiStyles } from './Game.styles';
//Utils
import { fullDate } from 'utils/validations';
import { generateId } from 'utils/idGenerator';

export default function NewGame() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [id, setId] = useState(null);
  const [name, setName] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [transmition, setTransmition] = useState(null);
  const [gameList, setGameList] = useState([]);
  const [openLoader, setOpenLoader] = useState(false);

  useEffect(() => {
    getGamesList().then((data) => {
      setGameList(data);
    });
  }, []);

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };
  const handleCloseCreate = () => {
    setOpenCreate(false);
  };

  const handleOpenEdit = () => {
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const reloadData = () => {
    getGamesList().then((data) => {
      setGameList(data);
    });
  };

  const handleCreateGame = () => {
    if (!name) {
      toast.info(titles.require, { position: toast.POSITION.TOP_RIGHT });
    } else {
      const ide = generateId(10);
      const object = {
        ide: ide,
        name: name,
        startDate: startDate,
        transmition: transmition,
        createAt: fullDate()
      };
      setOpenLoader(true);
      createDocument(collGames, ide, object);
      console.log(object);
      setTimeout(() => {
        setOpenLoader(false);
        setOpenCreate(false);
        cleanData();
        reloadData();
        toast.success(titles.successUpdate, { position: toast.POSITION.TOP_RIGHT });
      }, 2000);
    }
  };

  const handleEditGame = () => {
    if (!name) {
      toast.info(titles.require, { position: toast.POSITION.TOP_RIGHT });
    } else {
      const object = {
        name: name,
        startDate: startDate,
        transmition: transmition,
        updateAt: fullDate()
      };
      setOpenLoader(true);
      updateDocument(collGames, id, object);
      console.log(object);
      setTimeout(() => {
        setOpenLoader(false);
        setOpenEdit(false);
        cleanData();
        reloadData();
        toast.success(titles.successUpdate, { position: toast.POSITION.TOP_RIGHT });
      }, 2000);
    }
  };

  const handleDeleteUser = () => {
    setOpenLoader(true);
    deleteDocument(collGames, id);
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
    setStartDate('');
    setTransmition('');
  };

  return (
    <Box sx={uiStyles.box}>
      <ToastContainer />
      <Button
        style={{ backgroundColor: genConst.CONST_CREATE_COLOR, borderRadius: 8 }}
        onClick={() => {
          handleOpenCreate();
        }}
        startIcon={<IconPlus color="#FFF" />}
      >
        <span style={{ paddingLeft: 10, color: '#FFF' }}>Crear nuevo evento</span>
      </Button>
      {gameList.length > 0 ? (
        <Paper style={{ marginTop: 10 }}>
          <TableContainer sx={{ maxHeight: '100%' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell key="id-name" align="left" style={{ minWidth: 70, fontWeight: 'bold' }}>
                    ID
                  </TableCell>
                  <TableCell key="id-email" align="left" style={{ minWidth: 200, fontWeight: 'bold' }}>
                    Nombre
                  </TableCell>
                  <TableCell key="id-profile" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    Fecha
                  </TableCell>
                  <TableCell key="id-actions" align="center" style={{ minWidth: 75, fontWeight: 'bold' }}>
                    {titles.tableCellActions}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gameList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r) => (
                  <TableRow hover key={r.id}>
                    <TableCell align="left">{r.ide}</TableCell>
                    <TableCell align="left">{r.name}</TableCell>
                    <TableCell align="left">{r.startDate}</TableCell>
                    <TableCell align="center">
                      <ButtonGroup variant="contained">
                        <Button
                          style={{ backgroundColor: genConst.CONST_UPDATE_COLOR }}
                          onClick={() => {
                            setId(r.ide);
                            setName(r.name);
                            setStartDate(r.startDate);
                            setTransmition(r.transmition);
                            handleOpenEdit();
                          }}
                        >
                          <IconEdit color="#FFF" />
                        </Button>
                        <Button
                          style={{ backgroundColor: genConst.CONST_DELETE_COLOR }}
                          onClick={() => {
                            setId(r.ide);
                            setName(r.name);
                            setStartDate(r.startDate);
                            handleOpenDelete();
                          }}
                        >
                          <IconTrash color="#FFF" />
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
            count={gameList.length}
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
          <Typography id="modal-modal-title" variant="h3" component="h2">
            Crear nuevo evento
          </Typography>
          <Grid container style={{ marginTop: 10 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
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
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <h4>Fecha:</h4>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={startDate || ''}
                      onChange={(ev) => setStartDate(ev.target.value)}
                      style={uiStyles.dateInput}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <h4>Link Transmisión:</h4>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <input
                      type="text"
                      id="transmition"
                      name="transmition"
                      value={transmition || ''}
                      onChange={(ev) => setTransmition(ev.target.value)}
                      style={uiStyles.dateInput}
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
                        style={{ backgroundColor: genConst.CONST_CREATE_COLOR, color: '#FFF' }}
                        onClick={handleCreateGame}
                      >
                        {titles.buttonCreate}
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<IconCircleX />}
                        size="large"
                        style={{ backgroundColor: genConst.CONST_CANCEL_COLOR, color: '#FFF' }}
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
          <Typography id="modal-modal-title" variant="h3" component="h2">
            Editar evento
          </Typography>
          <Grid container style={{ marginTop: 10 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
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
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <h4>Fecha:</h4>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={startDate || ''}
                      onChange={(ev) => setStartDate(ev.target.value)}
                      style={uiStyles.dateInput}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <h4>Link de Transmisión (Youtube):</h4>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <input
                      type="text"
                      id="transmition"
                      name="transmition"
                      value={transmition || ''}
                      onChange={(ev) => setTransmition(ev.target.value)}
                      style={uiStyles.dateInput}
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
                        style={{ backgroundColor: genConst.CONST_CREATE_COLOR, color: '#FFF' }}
                        onClick={handleEditGame}
                      >
                        {titles.buttonUpdate}
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<IconCircleX />}
                        size="large"
                        style={{ backgroundColor: genConst.CONST_CANCEL_COLOR, color: '#FFF' }}
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
        <Box sx={uiStyles.modalStylesDelete}>
          <Typography id="modal-modal-title" variant="h3" component="h2">
            Eliminar Evento
          </Typography>
          <Typography id="modal-modal-title" variant="p" component="p" style={{ marginTop: 20, fontSize: 16 }}>
            {titles.titleDeleteModal} <strong>{name}</strong> {' programada para el: ' + startDate}
          </Typography>
          <Grid container style={{ marginTop: 20 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <ButtonGroup>
                      <Button
                        variant="contained"
                        startIcon={<IconTrash />}
                        size="large"
                        style={{ backgroundColor: genConst.CONST_DELETE_COLOR, color: '#FFF' }}
                        onClick={handleDeleteUser}
                      >
                        {titles.buttonDelete}
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<IconCircleX />}
                        size="large"
                        style={{ backgroundColor: genConst.CONST_CANCEL_COLOR, color: '#FFF' }}
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
          <Box sx={uiStyles.modalStylesLoader}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>
    </Box>
  );
}
