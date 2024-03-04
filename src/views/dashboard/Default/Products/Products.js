/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  OutlinedInput,
  ButtonGroup,
  Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CircularProgress from '@mui/material/CircularProgress';
import { uiStyles } from './Products.styles';
import { IconApps, IconPlus, IconTrash, IconEdit, IconCircleX, IconBuilding, IconEye, IconArrowBack } from '@tabler/icons';
//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//Collections
import * as Msg from 'store/message';
import { titles, inputLabels } from './Products.texts';
//Utils
import { deleteDocument, getProductsByBusiness } from 'config/firebaseEvents';
//types array
import MessageDark from 'components/message/MessageDark';
import { genConst } from 'store/constant';

function searchingData(search) {
  return function (x) {
    return x.name.toLowerCase().includes(search) || x.name.toUpperCase().includes(search) || !search;
  };
}

export default function Products() {
  let navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idBusiness = searchParams.get('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [id, setId] = useState(null);
  const [name, setName] = useState(null);
  const [search, setSearch] = useState('');
  const [openLoader, setOpenLoader] = useState(false);
  const [dataList, setDataList] = useState([]);

  const getData = () => {
    getProductsByBusiness(idBusiness).then((data) => {
      setDataList(data);
    });
  };

  useEffect(() => {
    getData();
  }, []);

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

  const handleDelete = () => {
    setOpenLoader(true);
    deleteDocument(collCourses, id);
    setTimeout(() => {
      setOpenLoader(false);
      setOpenDelete(false);
      reloadCoursesData();
      getData();
      toast.success(Msg.coudelsucc, { position: toast.POSITION.TOP_RIGHT });
    }, 2000);
  };

  return (
    <div>
      <ToastContainer />
      <AppBar position="static" style={uiStyles.appbar}>
        <Container maxWidth="xl" style={uiStyles.container}>
          <Toolbar disableGutters>
            <IconBuilding />
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
                    navigate({
                      pathname: '/app/business',
                      search: `?id=${r.id}`
                    });
                  }}
                >
                  <IconPlus style={{ marginRight: 4 }} />
                  <Typography textAlign="center">{titles.viewBusiness}</Typography>
                </MenuItem>
                <MenuItem
                  key="id-1"
                  onClick={() => {
                    navigate({
                      pathname: '/app/add-product',
                      search: `?id=${idBusiness}`
                    });
                  }}
                >
                  <IconPlus style={{ marginRight: 4 }} />
                  <Typography textAlign="center">{titles.addProduct}</Typography>
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
                    navigate('/app/business');
                  }}
                >
                  <IconArrowBack style={{ marginRight: 10 }} />
                  {titles.viewBusiness}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate({
                      pathname: '/app/add-product',
                      search: `?id=${idBusiness}`
                    });
                  }}
                >
                  <IconPlus style={{ marginRight: 10 }} />
                  {titles.addProduct}
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
                  <TableCell key="id-name" align="left" style={{ minWidth: 60, fontWeight: 'bold' }}></TableCell>
                  <TableCell key="id-name" align="left" style={{ minWidth: 170, fontWeight: 'bold' }}>
                    {inputLabels.name}
                  </TableCell>
                  <TableCell key="id-owner" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {inputLabels.price}
                  </TableCell>
                  <TableCell key="id-phone" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {inputLabels.quantity}
                  </TableCell>
                  <TableCell key="id-actions" align="center" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {titles.actionsTitle}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataList
                  .filter(searchingData(search))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((r) => (
                    <TableRow hover key={r.id}>
                      <TableCell align="left">
                        <ButtonGroup>
                          <Avatar src={r.logo || ''} color="inherit" style={{ width: 32, height: 32 }} />
                        </ButtonGroup>
                      </TableCell>
                      <TableCell align="left">{r.name}</TableCell>
                      <TableCell align="left">$ {r.price}</TableCell>
                      <TableCell align="left">{r.quantity} u</TableCell>
                      <TableCell align="center">
                        <ButtonGroup variant="contained">
                          <Button
                            style={{ backgroundColor: genConst.CONST_VIEW_COLOR }}
                            onClick={() => {
                              navigate({
                                pathname: '/app/info-product',
                                search: `?id=${r.id}`
                              });
                            }}
                          >
                            <IconEye />
                          </Button>
                          <Button
                            style={{ backgroundColor: genConst.CONST_UPDATE_COLOR }}
                            onClick={() => {
                              navigate({
                                pathname: '/app/edit-product',
                                search: `?id=${r.id}`
                              });
                            }}
                          >
                            <IconEdit />
                          </Button>
                          <Button
                            style={{ backgroundColor: genConst.CONST_DELETE_COLOR }}
                            onClick={() => {
                              setId(r.id);
                              setName(r.name);
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
