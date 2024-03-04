/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  AppBar,
  Box,
  Paper,
  Container,
  Grid,
  OutlinedInput,
  Modal,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Toolbar,
  Typography,
  CircularProgress
} from '@mui/material';
import { uiStyles } from './Business.styles';
import { IconEdit, IconTrash, IconPlus, IconSearch, IconEye, IconCircleX, IconArchive } from '@tabler/icons';
import SubscriptionState from 'components/message/SubscriptionState';
//Notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//Collections
import { titles, inputLabels } from './Business.texts';
//Utils
import { countBusinessByUserId, getBusinessListByUser } from 'config/firebaseEvents';
import MessageDark from 'components/message/MessageDark';
import { genConst, gridSpacing } from 'store/constant';
import { searchingBusinessData } from 'utils/search';
import { onAuthStateChanged } from 'firebase/auth';
import { authentication } from 'config/firebase';
//Custom Hook
import { useGetSubscriptionState } from 'hooks/useGetSubscriptionState';
import { msgSubState } from 'store/message';

export default function Business() {
  let navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [dataList, setDataList] = useState([]);
  const [id, setId] = useState(null);
  const [name, setName] = useState(null);
  const [countBusiness, setCountBusiness] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const stateSub = useGetSubscriptionState();

  useEffect(() => {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        setOpenLoader(true);
        getBusinessListByUser(user.uid).then((data) => {
          setDataList(data);
        });
        countBusinessByUserId(user.uid).then((ct) => {
          setCountBusiness(ct);
        });
      }
      setTimeout(() => {
        setOpenLoader(false);
      }, 1000);
    });
  }, []);

  const handleDelete = () => {
    setOpenLoader(true);
    deleteDocument(collCourses, id);
    setTimeout(() => {
      setOpenLoader(false);
      setOpenDelete(false);
      reloadCoursesData();
      handleClean();
      toast.success(Msg.coudelsucc, { position: toast.POSITION.TOP_RIGHT });
    }, 2000);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  return (
    <div>
      {stateSub == genConst.CONST_SUB_STATE_ACTIVE ? (
        <>
          <ToastContainer />
          <AppBar position="static" style={uiStyles.appbarSearch}>
            <Container maxWidth="xl" style={uiStyles.container}>
              <Toolbar disableGutters>
                <Box sx={uiStyles.box}>
                  <OutlinedInput
                    id="searchField"
                    type="text"
                    name="searchField"
                    value={search || ''}
                    onChange={(ev) => setSearch(ev.target.value)}
                    placeholder={inputLabels.search}
                    style={{ width: '95%', border: 'none' }}
                    endAdornment={<IconSearch />}
                  />
                </Box>
                <Box sx={uiStyles.box2}>
                  <OutlinedInput
                    id="searchField"
                    type="text"
                    name="searchField"
                    value={search || ''}
                    onChange={(ev) => setSearch(ev.target.value)}
                    placeholder={inputLabels.search}
                    style={{ width: '95%', border: 'none' }}
                    endAdornment={<IconSearch />}
                  />
                </Box>
                {countBusiness <= genConst.CONST_MAX_BUSINESS ? (
                  <Box sx={{ flexGrow: 0 }}>
                    <Button
                      variant="contained"
                      startIcon={<IconPlus />}
                      size="large"
                      style={uiStyles.appbarUpdateButton}
                      onClick={() => {
                        navigate('/app/add-business');
                      }}
                    >
                      {titles.buttonCreate}
                    </Button>
                  </Box>
                ) : (
                  <></>
                )}
              </Toolbar>
            </Container>
          </AppBar>
          {dataList.length > 0 ? (
            <Paper sx={uiStyles.paper}>
              <TableContainer sx={{ maxHeight: '100%' }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell key="id-name" align="left" style={{ minWidth: 170, fontWeight: 'bold' }}>
                        {inputLabels.name}
                      </TableCell>
                      <TableCell key="id-owner" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                        {inputLabels.owner}
                      </TableCell>
                      <TableCell key="id-phone" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                        {inputLabels.phone}
                      </TableCell>
                      <TableCell key="id-mail" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                        {inputLabels.email}
                      </TableCell>
                      <TableCell key="id-actions" align="center" style={{ minWidth: 170, fontWeight: 'bold' }}>
                        {titles.actions}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataList.filter(searchingBusinessData(search)).map((item) => (
                      <TableRow hover key={item.id}>
                        <TableCell align="left">
                          <strong>{item.name}</strong>
                        </TableCell>
                        <TableCell align="left">{item.owner}</TableCell>
                        <TableCell align="left">{item.phone}</TableCell>
                        <TableCell align="left">{item.email}</TableCell>
                        <TableCell align="center">
                          <ButtonGroup variant="contained">
                            <Button
                              style={{ backgroundColor: genConst.CONST_UPDATE_COLOR }}
                              onClick={() => {
                                navigate({
                                  pathname: '/app/products',
                                  search: `?id=${item.id}`
                                });
                              }}
                            >
                              <IconArchive />
                            </Button>
                            <Button
                              style={{ backgroundColor: genConst.CONST_VIEW_COLOR }}
                              onClick={() => {
                                navigate({
                                  pathname: '/app/info-business',
                                  search: `?id=${item.id}`
                                });
                              }}
                            >
                              <IconEye />
                            </Button>
                            <Button
                              style={{ backgroundColor: genConst.CONST_UPDATE_COLOR }}
                              onClick={() => {
                                navigate({
                                  pathname: '/app/edit-business',
                                  search: `?id=${item.id}`
                                });
                              }}
                            >
                              <IconEdit />
                            </Button>
                            <Button
                              style={{ backgroundColor: genConst.CONST_DELETE_COLOR }}
                              onClick={() => {
                                setId(item.id);
                                setName(item.name);
                                setOpenDelete(true);
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
          <Modal
            open={openDelete}
            onClose={handleCloseDelete}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
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
                            style={uiStyles.deleteButton}
                            onClick={handleDelete}
                          >
                            {titles.buttonDelete}
                          </Button>
                          <Button
                            variant="contained"
                            startIcon={<IconCircleX />}
                            size="large"
                            style={uiStyles.cancelButton}
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
        </>
      ) : (
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <SubscriptionState message={msgSubState} submessage={''} />
            </Grid>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
