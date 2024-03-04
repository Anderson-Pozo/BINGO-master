/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
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
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  ButtonGroup,
  Avatar,
  OutlinedInput,
  Grid
} from '@mui/material';
//Player
import MenuIcon from '@mui/icons-material/Menu';
import { uiStyles } from './Courses.styles';
import CircularProgress from '@mui/material/CircularProgress';
import { IconApps, IconBook, IconTrash, IconPlus, IconUserPlus } from '@tabler/icons';
import User1 from 'assets/images/profile/profile-picture-6.jpg';

//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Constants
import { titles } from './Courses.texts';
import { collCourses, collRegUsr, collUsers } from 'store/collections';

//Firebase
import { db } from 'config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { createDocument, deleteDocument } from 'config/firebaseEvents';
import { generateId } from 'utils/idGenerator';
import { fullDate } from 'utils/validations';
import * as Msg from 'store/message';
import { genConst } from 'store/constant';
import MessageDark from 'components/message/MessageDark';

function searchingData(search) {
  return function (x) {
    return (
      x.name.toLowerCase().includes(search) ||
      x.name.toUpperCase().includes(search) ||
      x.email.toLowerCase().includes(search) ||
      x.email.toUpperCase().includes(search) ||
      !search
    );
  };
}

function searchingDataUser(searchUser) {
  return function (x) {
    return (
      x.name.toLowerCase().includes(searchUser) ||
      x.name.toUpperCase().includes(searchUser) ||
      x.email.toLowerCase().includes(searchUser) ||
      x.email.toUpperCase().includes(searchUser) ||
      !searchUser
    );
  };
}

const AddUser = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  let navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [openLoader, setOpenLoader] = React.useState(false);
  const [dataList, setDataList] = React.useState([]);
  const [usersList, setUsersList] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [searchUser, setSearchUser] = React.useState('');
  const [courseName, setCourseName] = React.useState('');

  const getData = async () => {
    const q = query(collection(db, collCourses), where('id', '==', id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setCourseName(doc.data().name);
    });
  };

  const getUsers = async () => {
    const list = [];
    const q = query(collection(db, collUsers), where('profile', '==', genConst.CONST_PRO_DEF));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      list.push(doc.data());
      list.sort();
    });
    setUsersList(list);
  };

  const getUsersCourseData = async () => {
    const list = [];
    const q1 = query(collection(db, collRegUsr), where('idCourse', '==', id));
    const querySnapshot1 = await getDocs(q1);
    querySnapshot1.forEach((doc) => {
      list.push(doc.data());
      list.sort();
    });
    setDataList(list);
  };

  React.useEffect(() => {
    getData();
    getUsersCourseData();
    getUsers();
  }, []);

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

  return (
    <div>
      <ToastContainer />
      <AppBar position="static" style={uiStyles.appbar}>
        <Container maxWidth="xl" style={uiStyles.containerAdd}>
          <Toolbar disableGutters>
            <IconUserPlus />
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
                    navigate('/app/courses');
                  }}
                >
                  <IconBook style={{ marginRight: 4 }} />
                  <Typography textAlign="center">{titles.viewMenu}</Typography>
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
                    navigate('/app/courses');
                  }}
                >
                  <IconBook style={{ marginRight: 10 }} />
                  {titles.viewMenu}
                </MenuItem>
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 0 }}>ID: {id}</Box>
          </Toolbar>
        </Container>
      </AppBar>

      {dataList.length > 0 ? (
        <Paper sx={uiStyles.paperAddUser}>
          {usersList.length > 0 ? (
            <div style={{ margin: 10 }}>
              <center>
                <h3>
                  {titles.addUserCourseTitle} {courseName}
                </h3>
              </center>
              <strong>{titles.searchLabel}</strong>
              <OutlinedInput
                id="searchField"
                type="text"
                name="searchField"
                onChange={(ev) => setSearch(ev.target.value)}
                placeholder={titles.placeholderSearch}
                style={{ width: '50%', marginLeft: 10 }}
              />
            </div>
          ) : (
            <></>
          )}
          <TableContainer sx={{ maxHeight: 300 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell key="id-name" align="left" style={{ minWidth: 170, fontWeight: 'bold' }}>
                    {titles.tableCell1}
                  </TableCell>
                  <TableCell key="id-email" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {titles.tableCell2}
                  </TableCell>
                  <TableCell key="id-actions" align="center" style={{ minWidth: 75, fontWeight: 'bold' }}>
                    {titles.tableActions}
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
                          <Avatar src={r.avatar || User1} color="inherit" style={{ width: 32, height: 32 }} />
                          <span style={{ margin: 6 }}>{r.name}</span>
                        </ButtonGroup>
                      </TableCell>
                      <TableCell align="left">{r.email}</TableCell>
                      <TableCell align="center">
                        <ButtonGroup variant="contained">
                          <Button
                            style={{ backgroundColor: '#ff6961' }}
                            onClick={() => {
                              setOpenLoader(true);
                              setTimeout(() => {
                                deleteDocument(collRegUsr, r.id);
                                setOpenLoader(false);
                                getUsersCourseData();
                              }, 1000);
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
            labelRowsPerPage={'Registros máximos'}
            component="div"
            count={usersList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : dataList.length >= 0 ? (
        <Grid item lg={12} md={12} sm={12} xs={12} style={{ marginTop: 10 }}>
          <MessageDark message={titles.noRecordsRegisteredYet} submessage="" />
        </Grid>
      ) : (
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <MessageDark message="Cargando..." submessage="" />
        </Grid>
      )}

      {usersList.length > 0 ? (
        <Paper sx={uiStyles.paperAddUser}>
          {usersList.length > 0 ? (
            <div style={{ margin: 10 }}>
              <strong>{titles.searchLabel}</strong>
              <OutlinedInput
                id="searchFieldUser"
                type="text"
                name="searchFieldUser"
                onChange={(ev) => setSearchUser(ev.target.value)}
                placeholder={titles.placeholderSearch}
                style={{ width: '50%', marginLeft: 10 }}
              />
            </div>
          ) : (
            <></>
          )}
          <TableContainer sx={{ maxHeight: 300 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell key="id-name2" align="left" style={{ minWidth: 170, fontWeight: 'bold' }}>
                    {titles.tableCell1}
                  </TableCell>
                  <TableCell key="id-email2" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {titles.tableCell2}
                  </TableCell>
                  <TableCell key="id-actions2" align="center" style={{ minWidth: 75, fontWeight: 'bold' }}>
                    {titles.tableActions}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usersList
                  .filter(searchingDataUser(searchUser))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((r) => (
                    <TableRow hover key={r.id}>
                      <TableCell align="left">
                        <ButtonGroup>
                          <Avatar src={r.avatar || User1} color="inherit" style={{ width: 32, height: 32 }} />
                          <span style={{ margin: 6 }}>{r.name}</span>
                        </ButtonGroup>
                      </TableCell>
                      <TableCell align="left">{r.email}</TableCell>
                      <TableCell align="center">
                        <ButtonGroup variant="contained">
                          <Button
                            variant="contained"
                            style={{ backgroundColor: '#5666b5' }}
                            onClick={() => {
                              setOpenLoader(true);
                              const ide = generateId(10);
                              const object = {
                                id: ide,
                                idCourse: id,
                                courseName: courseName,
                                idIUser: r.id,
                                name: r.name,
                                email: r.email,
                                createAt: fullDate(),
                                avatar: r.avatar,
                                state: 1
                              };
                              setTimeout(() => {
                                createDocument(collRegUsr, ide, object);
                                setOpenLoader(false);
                                toast.success(Msg.coucresucc, { position: toast.POSITION.TOP_RIGHT });
                                getUsersCourseData();
                              }, 3000);
                            }}
                          >
                            <IconPlus />
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
        <Grid item lg={12} md={12} sm={12} xs={12} style={{ marginTop: 10 }}>
          <MessageDark message={titles.loadingUsers} submessage="" />
        </Grid>
      )}

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

export default AddUser;
