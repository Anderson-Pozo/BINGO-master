/* eslint-disable jsx-a11y/media-has-caption */
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
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Container,
  Grid,
  Modal,
  FormControl,
  OutlinedInput,
  InputLabel,
  ButtonGroup
} from '@mui/material';
//Player
import MenuIcon from '@mui/icons-material/Menu';
import { uiStyles } from './Courses.styles';
import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import {
  IconApps,
  IconBook,
  IconAppWindow,
  IconDeviceFloppy,
  IconCircleX,
  IconFileText,
  IconBrandYoutube,
  IconEdit,
  IconTrash,
  IconFileUpload
  //IconPlayerPlay,
  //IconVolume2,
  //IconVolume3,
  //IconPlayerPause
} from '@tabler/icons';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Constants
import { titles, inputLabels } from './Courses.texts';
import { collCourses, collModules } from 'store/collections';
import * as Msg from 'store/message';
import { generateId } from 'utils/idGenerator';
import { fullDate } from 'utils/validations';
import CourseData from './CourseData';

//Firebase
import { db, storage } from 'config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { createDocument, deleteDocument, updateDocument } from 'config/firebaseEvents';
import { genConst } from 'store/constant';
import MessageDark from 'components/message/MessageDark';

const Course = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  let navigate = useNavigate();
  const theme = useTheme();
  const [name, setName] = React.useState(null);
  const [description, setDescription] = React.useState(null);
  const [owner, setOwner] = React.useState(null);
  const [duration, setDuration] = React.useState(0);
  const [number, setNumber] = React.useState(null);
  const [price, setPrice] = React.useState(null);
  const [language, setLanguage] = React.useState(0);
  const [banner, setBanner] = React.useState(null);

  const [openVideo, setOpenVideo] = React.useState(false);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openLoader, setOpenLoader] = React.useState(false);
  const [dataList, setDataList] = React.useState([]);

  const [idMod, setIdMod] = React.useState(null);
  const [order, setOrder] = React.useState(null);
  const [title, setTitle] = React.useState(null);
  const [subTitle, setSubTitle] = React.useState(null);
  const [link, setLink] = React.useState(null);
  const [file, setFile] = React.useState(null);
  const [fileVideo, setFileVideo] = React.useState(null);
  const [details, setDetails] = React.useState(null);
  const [state, setState] = React.useState(null);
  const [fileName, setFileName] = React.useState(null);
  const [fileSize, setFileSize] = React.useState(null);
  const [fileType, setFileType] = React.useState(null);
  const [isUpload, setIsUpload] = React.useState(false);
  const [isChangeFile, setIsChangeFile] = React.useState(false);

  //const [isPlaying, setIsPlaying] = React.useState(false);
  //const [isMute, setIsMute] = React.useState(false);
  //const [isControls, setIsControls] = React.useState(false);

  const [fileVideoName, setFileVideoName] = React.useState(null);
  const [fileVideoSize, setFileVideoSize] = React.useState(null);
  const [fileVideoType, setFileVideoType] = React.useState(null);
  const [isVideoUpload, setIsVideoUpload] = React.useState(false);
  const [isVideoChangeFile, setIsVideoChangeFile] = React.useState(false);
  const [timeVideoUpload, setTimeVideoUpload] = React.useState(0);

  const cleanModulesData = () => {
    setTitle('');
    setSubTitle('');
    setLink('');
    setFile('');
    setDetails('');
    setFileVideo('');
    setFileName('');
    setFileSize('');
    setFileType('');
    setFileVideoName('');
    setFileVideoSize('');
    setFileVideoType('');
    setIsUpload(false);
    setIsVideoUpload(false);
  };
  const handleOpenCreate = () => {
    setOpenCreate(true);
    cleanModulesData();
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
  };

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleOpenVideo = () => {
    setOpenVideo(true);
    //setIsPlaying(true);
    //setIsMute(true);
    //setIsControls(false);
  };

  const handleCloseVideo = () => {
    setOpenVideo(false);
    //setIsPlaying(false);
    //setIsMute(false);
    //setIsControls(false);
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

  const getData = async () => {
    const q = query(collection(db, collCourses), where('id', '==', id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setName(doc.data().name);
      setDescription(doc.data().description);
      setOwner(doc.data().owner);
      setDuration(doc.data().duration);
      setNumber(doc.data().number);
      setPrice(doc.data().price);
      setLanguage(doc.data().language);
      setBanner(doc.data().banner);
    });
  };

  const getModulesData = async () => {
    const list = [];
    const q1 = query(collection(db, collModules), where('idCourse', '==', id));
    const querySnapshot1 = await getDocs(q1);
    querySnapshot1.forEach((doc) => {
      list.push(doc.data());
      list.sort((a, b) => a.order - b.order);
      //list.sort();
    });
    setDataList(list);
  };

  React.useEffect(() => {
    getData();
    getModulesData();
    window.addEventListener(
      'contextmenu',
      function (e) {
        e.preventDefault();
      },
      false
    );
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

  const handleCreateModule = () => {
    if (!title || !subTitle || !details) {
      toast.info(Msg.requiered, { position: toast.POSITION.TOP_RIGHT });
    } else {
      const ide = generateId(10);
      setOpenLoader(true);
      const obj = {
        id: ide,
        order: dataList.length + 1,
        idCourse: id,
        title: title,
        subTitle: subTitle,
        link: link,
        file: null,
        fileVideo: null,
        details: details,
        state: 1,
        createAt: fullDate()
      };
      createDocument(collModules, ide, obj);
      setTimeout(() => {
        if (file) {
          if (file.name !== null) {
            const fileName = ide + genConst.CONST_EXT_PDF;
            const fileRef = ref(storage, `modules/${id}/${fileName}`);
            uploadBytes(fileRef, file).then((snap) => {
              getDownloadURL(snap.ref).then((url) => {
                const obj = {
                  file: url
                };
                console.log(url);
                updateDocument(collModules, ide, obj);
              });
            });
          }
        }
        if (fileVideo) {
          if (fileVideo.name !== null) {
            const fileVideoName = ide + genConst.CONST_EXT_VIDEO_MP4;
            const fileVideoRef = ref(storage, `videos/${id}/${fileVideoName}`);
            uploadBytes(fileVideoRef, fileVideo).then((snap) => {
              console.log(timeVideoUpload);
              getDownloadURL(snap.ref).then((url) => {
                const obj = {
                  fileVideo: url
                };
                updateDocument(collModules, ide, obj);
              });
            });
          }
        }
        setOpenLoader(false);
        setOpenCreate(false);
        setIsChangeFile(false);
        setIsVideoChangeFile(false);
        setIsUpload(false);
        setIsVideoUpload(false);
        getModulesData();
        cleanModulesData();
        toast.success(Msg.modcresucc, { position: toast.POSITION.TOP_RIGHT });
        //window.location.reload();
      }, 8000);
    }
  };

  const handleEdit = () => {
    if (!title || !subTitle || !details) {
      toast.info(Msg.requiered, { position: toast.POSITION.TOP_RIGHT });
    } else {
      setOpenLoader(true);
      const obj = {
        title: title,
        subTitle: subTitle,
        link: link,
        file: isChangeFile ? null : file,
        fileVideo: isVideoChangeFile ? null : fileVideo,
        details: details,
        updateAt: fullDate()
      };
      updateDocument(collModules, idMod, obj);
      setTimeout(() => {
        if (isChangeFile) {
          const fileName = idMod + genConst.CONST_EXT_PDF;
          const fileRef = ref(storage, `modules/${id}/${fileName}`);
          uploadBytes(fileRef, file).then((snap) => {
            getDownloadURL(snap.ref).then((url) => {
              const obj = {
                file: url
              };
              updateDocument(collModules, idMod, obj);
            });
          });
        }
        if (isVideoChangeFile) {
          const fileName = idMod + genConst.CONST_EXT_VIDEO_MP4;
          const fileRef = ref(storage, `videos/${id}/${fileName}`);
          uploadBytes(fileRef, fileVideo).then((snap) => {
            getDownloadURL(snap.ref).then((url) => {
              const obj = {
                fileVideo: url
              };
              updateDocument(collModules, idMod, obj);
            });
          });
        }
        setIsChangeFile(false);
        setIsUpload(false);
        setOpenLoader(false);
        setOpenEdit(false);
        getModulesData();
        cleanModulesData();
        toast.success(Msg.modupdsucc, { position: toast.POSITION.TOP_RIGHT });
        //window.location.reload();
      }, 6000);
    }
  };

  const handleDelete = () => {
    setOpenLoader(true);
    deleteDocument(collModules, idMod);
    setTimeout(() => {
      setOpenLoader(false);
      setOpenDelete(false);
      setIsChangeFile(false);
      setIsUpload(false);
      getModulesData();
      cleanModulesData();
      toast.success(Msg.moddelsucc, { position: toast.POSITION.TOP_RIGHT });
    }, 2000);
  };

  const handleFileChange = (e) => {
    let fileUpload = e.target.files[0];
    if (fileUpload) {
      setFileName(fileUpload.name);
      setFileSize(fileUpload.size);
      setFileType(fileUpload.type === 'application/pdf' ? 'PDF' : '');
      setFile(fileUpload);
      setIsUpload(true);
      setIsChangeFile(true);
    }
  };

  const handleFileVideoChange = (e) => {
    let fileUpload = e.target.files[0];
    let timeUpload = Math.round(100 * e.loaded) / e.total;
    if (fileUpload) {
      setFileVideoName(fileUpload.name);
      setFileVideoSize(fileUpload.size);
      setFileVideoType(fileUpload.type === 'application/pdf' ? 'PDF' : '');
      setFileVideo(fileUpload);
      setTimeVideoUpload(timeUpload);
      setIsVideoUpload(true);
      setIsVideoChangeFile(true);
    }
  };

  /*const handlePlaying = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    setIsMute(!isMute);
  };*/

  return (
    <div>
      <ToastContainer />
      <AppBar position="static" style={uiStyles.appbar}>
        <Container maxWidth="xl" style={uiStyles.containerAdd}>
          <Toolbar disableGutters>
            <IconBook />
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
                <MenuItem onClick={handleOpenCreate}>
                  <IconAppWindow style={{ marginRight: 4 }} />
                  <Typography textAlign="center">{titles.addModule}</Typography>
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
                <MenuItem onClick={handleOpenCreate}>
                  <IconAppWindow style={{ marginRight: 10 }} />
                  {titles.addModule}
                </MenuItem>
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 0 }}>ID: {id}</Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Grid container spacing={1} style={{ marginTop: 10 }}>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={5} md={6} sm={6} xs={12}>
              <CourseData
                name={name}
                description={description}
                owner={owner}
                duration={duration}
                number={number}
                price={price}
                language={language}
                banner={banner}
              />
            </Grid>
            <Grid item lg={7} md={6} sm={6} xs={12}>
              {dataList.length > 0 ? (
                <>
                  {dataList.map((c, key) => (
                    <Accordion
                      style={{ borderRadius: 10, backgroundColor: '#FFF', margin: 5, border: 'none' }}
                      expanded={expanded === 'panel'.concat(c.order)}
                      onChange={handleChange('panel'.concat(c.order))}
                      key={key}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={'panel'.concat(c.order, 'bh-content')}
                        id={'panel'.concat(c.order, 'bh-header')}
                        style={{ border: 'none' }}
                      >
                        <Typography style={{ fontWeight: 'bold', fontSize: 16 }}>{c.title}</Typography>
                      </AccordionSummary>
                      <AccordionDetails style={{ marginTop: -30, border: 'none' }}>
                        <Grid container style={{ padding: 1 }}>
                          <Grid item xs={12} style={{ marginTop: 0 }}>
                            <h4>{c.subTitle}</h4>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography>{c.details}</Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <p style={{ fontWeight: 'bold' }}>{titles.mediaLabel}</p>
                            <ButtonGroup>
                              {c.file ? (
                                <Button
                                  variant="contained"
                                  style={uiStyles.fileButton}
                                  onClick={() => {
                                    window.open(c.file, '_blank');
                                  }}
                                >
                                  <IconFileText size={40} />
                                </Button>
                              ) : (
                                <></>
                              )}
                              {c.fileVideo ? (
                                <Button
                                  variant="contained"
                                  style={uiStyles.videoButton}
                                  onClick={() => {
                                    handleOpenVideo();
                                    setFileVideo(c.fileVideo);
                                  }}
                                >
                                  <IconBrandYoutube size={40} />
                                </Button>
                              ) : (
                                <></>
                              )}
                            </ButtonGroup>
                          </Grid>
                        </Grid>

                        <Grid container style={{ padding: 5 }}>
                          <Grid item lg={9} xs={9}></Grid>
                          <Grid item lg={1} xs={1}>
                            <Button
                              onClick={() => {
                                setIdMod(c.id);
                                setOrder(c.order);
                                setTitle(c.title);
                                setSubTitle(c.subTitle);
                                setLink(c.link);
                                setFile(c.file);
                                setFileVideo(c.fileVideo);
                                setDetails(c.details);
                                setState(c.state);
                                handleOpenEdit();
                              }}
                            >
                              <IconEdit width={25} height={25} style={{ color: genConst.CONST_UPDATE_COLOR }} />
                            </Button>
                          </Grid>
                          <Grid item lg={1} xs={1}>
                            <Button
                              onClick={() => {
                                setIdMod(c.id);
                                handleOpenDelete();
                              }}
                            >
                              <IconTrash width={25} height={25} style={{ color: genConst.CONST_DELETE_COLOR }} />
                            </Button>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </>
              ) : (
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <MessageDark message={titles.noRecordsModulesYet} submessage="" />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Modal open={openCreate} onClose={handleCloseCreate} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.modalStyles}>
          <Typography id="modal-modal-title" variant="h2" component="h2">
            {titles.addModule} {dataList.length + 1}
          </Typography>
          <Grid container style={{ marginTop: 10 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="title">
                      <span color="danger">*</span> {inputLabels.title}
                    </InputLabel>
                    <OutlinedInput
                      id="title"
                      type="text"
                      name="title"
                      value={title || ''}
                      inputProps={{}}
                      onChange={(ev) => setTitle(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="subtitle">
                      <span color="danger">*</span>
                      {inputLabels.subtitle}
                    </InputLabel>
                    <OutlinedInput
                      id="subtitle"
                      type="text"
                      name="subtitle"
                      inputProps={{}}
                      value={subTitle || ''}
                      onChange={(ev) => setSubTitle(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12} hidden>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="linkVideo">
                      <span color="danger">*</span> {inputLabels.link}
                    </InputLabel>
                    <OutlinedInput
                      id="linkVideo"
                      type="text"
                      name="linkVideo"
                      inputProps={{}}
                      value={link || ''}
                      onChange={(ev) => setLink(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInputMultiple }}>
                    <InputLabel htmlFor="detail">
                      <span color="danger">*</span>
                      {inputLabels.detail}
                    </InputLabel>
                    <OutlinedInput
                      id="detail"
                      name="detail"
                      multiline
                      rows={4}
                      value={details || ''}
                      onChange={(ev) => setDetails(ev.target.value)}
                      style={{ paddingTop: 12 }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <div style={{ border: 'dashed gray', borderRadius: 10, borderWidth: 0.2, height: 80, cursor: 'pointer' }}>
                    <center>
                      <input
                        type="file"
                        id="file-video-upload"
                        style={{ display: 'none' }}
                        onChange={handleFileVideoChange}
                        accept="video/mp4,video/x-m4v,video/*"
                      />
                      <div htmlFor="file-video-upload" id="file-video-upload" style={{ marginTop: 10 }}>
                        <label htmlFor="file-video-upload">
                          <IconFileUpload />
                        </label>
                      </div>
                      <span style={{ fontSize: 10 }}>
                        {!isVideoUpload
                          ? titles.videoUploadButton
                          : 'Nombre: ' + fileVideoName + ' - Tamaño: ' + fileVideoSize + ' Mb - Tipo: ' + fileVideoType}
                      </span>
                    </center>
                  </div>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <div style={{ border: 'dashed gray', borderRadius: 10, borderWidth: 0.2, height: 80, cursor: 'pointer' }}>
                    <center>
                      <input
                        type="file"
                        id="file-upload"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        accept="application/pdf"
                      />
                      <div htmlFor="file-upload" id="file-upload" style={{ marginTop: 10 }}>
                        <label htmlFor="file-upload">
                          <IconFileUpload />
                        </label>
                      </div>
                      <span style={{ fontSize: 10 }}>
                        {!isUpload
                          ? titles.imageUploadButton
                          : 'Nombre: ' + fileName + ' - Tamaño: ' + fileSize + ' Mb - Tipo: ' + fileType}
                      </span>
                    </center>
                  </div>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <ButtonGroup>
                      <Button
                        variant="contained"
                        startIcon={<IconDeviceFloppy />}
                        size="large"
                        style={uiStyles.createButton}
                        onClick={handleCreateModule}
                      >
                        {titles.buttonAdd}
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<IconCircleX />}
                        size="large"
                        style={uiStyles.cancelButton}
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

      <Modal open={openVideo} onClose={handleCloseVideo} aria-labelledby="modal-modal-video" aria-describedby="modal-modal-video-link">
        <Box sx={uiStyles.modalVideo}>
          <video width="100%" height="100%" autoPlay controls controlsList="nodownload" style={{ borderRadius: 20 }}>
            <source src={fileVideo} type="video/mp4" />
          </video>
        </Box>
      </Modal>

      <Modal open={openEdit} onClose={handleCloseEdit} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.modalStyles}>
          <Typography id="modal-modal-title" variant="h2" component="h2">
            {titles.editModule} {order} <span hidden>{state}</span>
          </Typography>
          <Grid container style={{ marginTop: 10 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="title">
                      <span color="danger">*</span> Título
                    </InputLabel>
                    <OutlinedInput
                      id="title"
                      type="text"
                      name="title"
                      value={title || ''}
                      inputProps={{}}
                      onChange={(ev) => setTitle(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="subtitle">
                      <span color="danger">*</span> Sub título
                    </InputLabel>
                    <OutlinedInput
                      id="subtitle"
                      type="text"
                      name="subtitle"
                      inputProps={{}}
                      value={subTitle || ''}
                      onChange={(ev) => setSubTitle(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12} hidden>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="linkVideo">
                      <span color="danger">*</span> Link Video
                    </InputLabel>
                    <OutlinedInput
                      id="linkVideo"
                      type="text"
                      name="linkVideo"
                      inputProps={{}}
                      value={link || ''}
                      onChange={(ev) => setLink(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInputMultiple }}>
                    <InputLabel htmlFor="detail">
                      <span color="danger">*</span>Detalle
                    </InputLabel>
                    <OutlinedInput
                      id="detail"
                      name="detail"
                      multiline
                      rows={4}
                      value={details || ''}
                      onChange={(ev) => setDetails(ev.target.value)}
                      style={{ paddingTop: 12 }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <div style={{ border: 'dashed gray', borderRadius: 10, borderWidth: 0.2, height: 80, cursor: 'pointer' }}>
                    <center>
                      <input
                        type="file"
                        id="file-video-upload"
                        style={{ display: 'none' }}
                        onChange={handleFileVideoChange}
                        accept="video/mp4,video/x-m4v,video/*"
                      />
                      <div htmlFor="file-video-upload" id="file-video-upload" style={{ marginTop: 10 }}>
                        <label htmlFor="file-video-upload">
                          <IconFileUpload />
                        </label>
                      </div>
                      <span style={{ fontSize: 10 }}>
                        {!isVideoUpload
                          ? titles.videoUploadButton
                          : 'Nombre: ' + fileVideoName + ' - Tamaño: ' + fileVideoSize + ' Mb - Tipo: ' + fileVideoType}
                      </span>
                    </center>
                  </div>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <div style={{ border: 'dashed gray', borderRadius: 10, borderWidth: 0.2, height: 80, cursor: 'pointer' }}>
                    <center>
                      <input
                        type="file"
                        id="file-upload"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        accept="application/pdf"
                      />
                      <div htmlFor="file-upload" id="file-upload" style={{ marginTop: 10 }}>
                        <label htmlFor="file-upload">
                          <IconFileUpload />
                        </label>
                      </div>
                      <span style={{ fontSize: 10 }}>
                        {!isUpload
                          ? titles.imageUploadButton
                          : 'Nombre: ' + fileName + ' - Tamaño: ' + fileSize + ' Mb - Tipo: ' + fileType}
                      </span>
                    </center>
                  </div>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <ButtonGroup>
                      <Button
                        variant="contained"
                        startIcon={<IconDeviceFloppy />}
                        size="large"
                        style={uiStyles.updateButton}
                        onClick={handleEdit}
                      >
                        {titles.buttonSave}
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
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
          </Grid>
        </Box>
      </Modal>

      <Modal open={openDelete} onClose={handleCloseDelete} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.styleDelete}>
          <Typography id="modal-modal-title" variant="h2" component="h2">
            {titles.modalDeleteModule}
          </Typography>
          <Typography id="modal-modal-title" variant="p" component="p" style={uiStyles.modalDeleteTitle}>
            {titles.modaleDeleteModule} <strong>{name}</strong>
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
};

export default Course;
