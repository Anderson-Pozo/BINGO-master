/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
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
  AppBar,
  Box,
  Toolbar,
  Typography,
  Modal,
  Grid,
  OutlinedInput,
  ButtonGroup,
  IconButton,
  Tooltip
} from '@mui/material';
import { uiStyles } from './Logs.styles';
import { JsonViewer } from '@textea/json-viewer';
import { IconCircleX, IconReload, IconSearch, IconEyeTable, IconFile } from '@tabler/icons';

//Notifications
import 'react-toastify/dist/ReactToastify.css';

//Collections
import { titles, inputLabels } from './Logs.texts';

//Utils
import { getLogsData } from 'config/firebaseEvents';

//types array
import MessageDark from 'components/message/MessageDark';
import { genConst } from 'store/constant';

function searchingData(search) {
  return function (x) {
    return x.collection.toLowerCase().includes(search) || x.collection.toUpperCase().includes(search) || !search;
  };
}

export default function Logs() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openCreate, setOpenCreate] = useState(false);
  const [title, setTitle] = useState(null);
  const [object, setObject] = useState(null);
  const [search, setSearch] = useState('');
  const [listData, setListData] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    getLogsData().then((data) => {
      setListData(data);
    });
  }, []);

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };
  const handleCloseCreate = () => {
    setOpenCreate(false);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const reloadData = () => {
    getLogsData().then((data) => {
      setListData(data);
    });
  };

  return (
    <Box sx={uiStyles.box1}>
      <AppBar position="static" style={uiStyles.appbar}>
        <Toolbar>
          <IconButton color="inherit">
            <IconFile color="#FFF" />
          </IconButton>
          <Tooltip title="Recargar">
            <IconButton
              color="inherit"
              onClick={() => {
                reloadData();
              }}
            >
              <IconReload color="#FFF" />
            </IconButton>
          </Tooltip>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: '#FFF' }} align="center">
            Logs del Sistema
          </Typography>
          <Tooltip title="Buscar">
            <IconButton
              color="inherit"
              onClick={() => {
                setShowSearch(!showSearch);
              }}
            >
              <IconSearch color="#FFF" />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      {showSearch && (
        <Box sx={{ flexGrow: 0 }}>
          {listData.length > 0 ? (
            <OutlinedInput
              id="searchField"
              type="text"
              name="searchField"
              onChange={(ev) => setSearch(ev.target.value)}
              placeholder={inputLabels.search}
              style={{ width: '100%', marginTop: 10 }}
            />
          ) : (
            <></>
          )}
        </Box>
      )}
      {listData.length > 0 ? (
        <Paper sx={uiStyles.paper}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell key="id-coll" align="left" style={{ minWidth: 170, fontWeight: 'bold' }}>
                    {'Colección'}
                  </TableCell>
                  <TableCell key="id-date" align="left" style={{ minWidth: 170, fontWeight: 'bold' }}>
                    {'Fecha'}
                  </TableCell>
                  <TableCell key="id-id" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {'LogId'}
                  </TableCell>
                  <TableCell key="id-actions" align="center" style={{ minWidth: 75, fontWeight: 'bold' }}>
                    {titles.actions}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listData
                  .filter(searchingData(search))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((r) => (
                    <TableRow hover key={r.id}>
                      <TableCell align="left">{r.collection}</TableCell>
                      <TableCell align="left">{r.createAt}</TableCell>
                      <TableCell align="left">{r.id}</TableCell>
                      <TableCell align="center">
                        <ButtonGroup variant="contained">
                          <Tooltip title="Ver Objeto">
                            <Button
                              style={{ backgroundColor: genConst.CONST_UPDATE_COLOR, color: '#FFF' }}
                              onClick={() => {
                                setObject(r.object);
                                setTitle('Objeto Detalle');
                                handleOpenCreate();
                              }}
                            >
                              <IconEyeTable />
                            </Button>
                          </Tooltip>
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
            count={listData.length}
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
          <Typography id="modal-modal-title" variant="h3" component="h3" align="center">
            {title}
          </Typography>
          <Grid container style={{ marginTop: 10 }}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <JsonViewer value={object} />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <center>
                <ButtonGroup>
                  <Button
                    variant="contained"
                    color="error"
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
        </Box>
      </Modal>
    </Box>
  );
}
