/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Button,
  ButtonGroup,
  AppBar,
  Box,
  Paper,
  Typography,
  Container,
  Grid,
  OutlinedInput,
  Modal,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
  Toolbar
} from '@mui/material';
import { uiStyles } from './Courses.styles';
import CircularProgress from '@mui/material/CircularProgress';

import { IconEdit, IconTrash, IconCircleX, IconDeviceFloppy, IconPlus, IconSearch, IconUser, IconEye } from '@tabler/icons';

//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Collections
import { collCourses } from 'store/collections';
import { titles, inputLabels } from './Courses.texts';
import * as Msg from 'store/message';

//Utils
import { updateDocument, deleteDocument, getCoursesList } from 'config/firebaseEvents';
import MessageDark from 'components/message/MessageDark';
import { genConst } from 'store/constant';
import { searchingCourseData } from 'utils/search';

export default function Courses() {
  let navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const theme = useTheme();
  const [search, setSearch] = React.useState('');
  const [dataList, setDataList] = React.useState([]);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openLoader, setOpenLoader] = React.useState(false);

  const [id, setId] = React.useState('');
  const [name, setName] = React.useState(null);
  const [description, setDescription] = React.useState(null);
  const [owner, setOwner] = React.useState(null);
  const [duration, setDuration] = React.useState(0);
  const [number, setNumber] = React.useState(null);
  const [price, setPrice] = React.useState(null);
  const [language, setLanguage] = React.useState(0);
  const [banner, setBanner] = React.useState({ preview: '', raw: '' });
  const [url, setUrl] = React.useState(null);
  const [isChangeUrl, setIsChangeUrl] = React.useState(false);

  React.useEffect(() => {
    getCoursesList().then((data) => {
      setDataList(data);
    });
  }, []);

  const handleCloseEdit = () => {
    setOpenEdit(false);
    handleClean();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleClean = () => {
    setId(null);
    setName(null);
    setDescription(null);
    setOwner(null);
    setNumber(null);
    setDuration(null);
    setPrice(null);
    setLanguage(null);
    setUrl(null);
    setBanner({ preview: '', raw: '' });
  };

  const handleImageChange = (e) => {
    if (e.target.files.length) {
      let img = new Image();
      img.src = window.URL.createObjectURL(e.target.files[0]);
      let raw = e.target.files[0];
      img.onload = () => {
        setBanner({
          preview: img.src,
          raw: raw
        });
        setIsChangeUrl(true);
      };
    }
  };

  const handleEdit = () => {
    if (!name || !description || !owner || !number || !duration || !price || !language) {
      toast.info(Msg.requiered, { position: toast.POSITION.TOP_RIGHT });
    } else {
      setOpenLoader(true);
      const obj = {
        name: name,
        description: description,
        owner: owner,
        number: number,
        duration: duration,
        price: price,
        language: language,
        updateAt: fullDate()
      };
      setTimeout(() => {
        updateDocument(collModules, id, obj);
        if (isChangeUrl) {
          if (banner.raw !== null) {
            const imageName = id + genConst.CONST_EXT_IMAGE;
            const imageRef = ref(storage, `courses/${imageName}`);
            uploadBytes(imageRef, banner.raw).then((snap) => {
              getDownloadURL(snap.ref).then((url) => {
                const obj = {
                  banner: url
                };
                updateDocument(collCourses, id, obj);
              });
            });
          }
        }
        setOpenLoader(false);
        setOpenEdit(false);
        toast.success(Msg.couupdsucc, { position: toast.POSITION.TOP_RIGHT });
        reloadCoursesData();
        handleClean();
      }, 3000);
    }
  };

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

  const reloadCoursesData = () => {
    getCoursesList().then((data) => {
      setDataList(data);
    });
  };

  return (
    <div>
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
            <Box sx={{ flexGrow: 0 }}>
              <Button
                variant="contained"
                startIcon={<IconPlus />}
                size="large"
                style={uiStyles.appbarUpdateButton}
                onClick={() => {
                  navigate('/app/add-course');
                }}
              >
                {titles.buttonCreate}
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {dataList.length > 0 ? (
        <Paper sx={uiStyles.paper}>
          <TableContainer sx={{ maxHeight: '100%' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell key="id-avatar" align="left" style={{ minWidth: 30, fontWeight: 'bold' }}>
                    {' '}
                  </TableCell>
                  <TableCell key="id-name" align="left" style={{ minWidth: 170, fontWeight: 'bold' }}>
                    {inputLabels.name}
                  </TableCell>
                  <TableCell key="id-owner" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {inputLabels.owner}
                  </TableCell>
                  <TableCell key="id-duration" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {inputLabels.duration}
                  </TableCell>
                  <TableCell key="id-price" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {inputLabels.price}
                  </TableCell>
                  <TableCell key="id-actions" align="center" style={{ minWidth: 170, fontWeight: 'bold' }}>
                    {titles.actions}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataList
                  .filter(searchingCourseData(search))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow hover key={item.id}>
                      <TableCell align="left">
                        <img style={{ width: 50, height: 50, borderRadius: 100 }} src={item.banner} alt="default banner" />
                      </TableCell>
                      <TableCell align="left">{item.name}</TableCell>
                      <TableCell align="left">{item.owner}</TableCell>
                      <TableCell align="left">{item.duration} horas</TableCell>
                      <TableCell align="left">${item.price}</TableCell>
                      <TableCell align="center">
                        <ButtonGroup variant="contained">
                          <Button
                            style={{ backgroundColor: genConst.CONST_CREATE_COLOR }}
                            onClick={() => {
                              navigate({
                                pathname: '/app/course',
                                search: `?id=${item.id}`
                              });
                            }}
                          >
                            <IconEye />
                          </Button>
                          <Button
                            style={{ backgroundColor: genConst.CONST_CREATE_COLOR }}
                            onClick={() => {
                              navigate({
                                pathname: '/app/add-user',
                                search: `?id=${item.id}`
                              });
                            }}
                          >
                            <IconUser />
                          </Button>
                          <Button
                            style={{ backgroundColor: genConst.CONST_UPDATE_COLOR }}
                            onClick={() => {
                              navigate({
                                pathname: '/app/edit-course',
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
      <Modal open={openEdit} onClose={handleCloseEdit} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.modalStyles}>
          <Typography id="modal-modal-title" variant="h4" component="h4">
            {titles.modalEdit} {id}
          </Typography>
          <Grid container spacing={1} style={{ marginTop: 5 }}>
            <Grid item lg={7} xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                      <InputLabel htmlFor="name">{inputLabels.name + ' *'}</InputLabel>
                      <OutlinedInput
                        id="name"
                        type="text"
                        name="name"
                        value={name || ''}
                        inputProps={{}}
                        onChange={(ev) => setName(ev.target.value)}
                      />
                    </FormControl>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="description">{inputLabels.description + ' *'}</InputLabel>
                        <OutlinedInput
                          id="description"
                          type="text"
                          name="description"
                          value={description || ''}
                          inputProps={{}}
                          onChange={(ev) => setDescription(ev.target.value)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="owner">{inputLabels.owner + ' *'}</InputLabel>
                        <OutlinedInput
                          id="owner"
                          type="text"
                          name="owner"
                          value={owner || ''}
                          inputProps={{}}
                          onChange={(ev) => setOwner(ev.target.value)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="number">{inputLabels.number + ' *'}</InputLabel>
                        <OutlinedInput
                          id="number"
                          type="number"
                          name="number"
                          value={number || ''}
                          inputProps={{}}
                          onChange={(ev) => setNumber(ev.target.value)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="duration">{inputLabels.duration + ' *'}</InputLabel>
                        <OutlinedInput
                          id="duration"
                          type="number"
                          name="duration"
                          value={duration || ''}
                          inputProps={{}}
                          onChange={(ev) => setDuration(ev.target.value)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="price">{'$ ' + inputLabels.price + ' *'}</InputLabel>
                        <OutlinedInput
                          id="price"
                          type="number"
                          name="price"
                          value={price || ''}
                          inputProps={{}}
                          onChange={(ev) => setPrice(ev.target.value)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="language">{inputLabels.language + ' *'}</InputLabel>
                        <OutlinedInput
                          id="language"
                          type="text"
                          name="language"
                          value={language || ''}
                          inputProps={{}}
                          onChange={(ev) => setLanguage(ev.target.value)}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={5} xs={12}>
              <Grid item xs={12}>
                <center>
                  <strong>{titles.banner}</strong>
                  <input type="file" id="banner" style={{ display: 'none' }} onChange={handleImageChange} accept="image/*" />
                  <div htmlFor="banner" id="banner">
                    <label htmlFor="banner">
                      <img src={banner.preview || url} alt="Banner" width={'100%'} style={{ borderRadius: 15 }} />
                      <p style={{ fontSize: 10 }}>{titles.instructionsImg}</p>
                    </label>
                  </div>
                </center>
              </Grid>
            </Grid>
            <Grid item lg={12} xs={12}>
              <Grid item xs={12} style={{ marginTop: 20 }}>
                <center>
                  <ButtonGroup>
                    <Button
                      variant="contained"
                      startIcon={<IconDeviceFloppy />}
                      size="large"
                      style={uiStyles.updateButton}
                      onClick={handleEdit}
                    >
                      {titles.buttonEdit}
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<IconCircleX />}
                      size="large"
                      style={uiStyles.cancelButton}
                      onClick={handleCloseEdit}
                    >
                      {titles.buttonCancel}
                    </Button>
                  </ButtonGroup>
                </center>
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
    </div>
  );
}
