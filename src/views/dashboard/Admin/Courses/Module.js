/* eslint-disable react/prop-types */
import React from 'react';

// material-ui
//import { styled } from '@mui/material/styles';
import { uiStyles } from './Courses.styles';
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Modal,
  Box,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  ButtonGroup
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
//Player
import ReactPlayer from 'react-player/lazy';

// project imports
//import MainCard from 'components/cards/MainCard';

//Notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  IconFileText,
  IconBrandYoutube,
  IconEyeOff,
  IconEyeCheck,
  IconEdit,
  IconTrash,
  IconDeviceFloppy,
  IconCircleX
} from '@tabler/icons';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Module = ({ id, order, title, subTitle, link, file, details, state }) => {
  const [openVideo, setOpenVideo] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openLoader, setOpenLoader] = React.useState(false);
  const theme = useTheme();

  const [titleE, setTitleE] = React.useState(null);
  const [subTitleE, setSubTitleE] = React.useState(null);
  const [linkE, setLinkE] = React.useState(null);
  const [fileE, setFileE] = React.useState(null);
  const [detailsE, setDetailsE] = React.useState(null);

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    console.log(panel, isExpanded);
    setExpanded(isExpanded ? panel : false);
  };

  const handleOpenVideo = () => {
    setOpenVideo(true);
  };

  const handleCloseVideo = () => {
    setOpenVideo(false);
  };

  const handleOpenEdit = () => {
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleEdit = () => {
    setOpenLoader(true);
  };

  return (
    <>
      <ToastContainer />
      <Accordion style={{ borderRadius: 15 }} expanded={expanded === 'panel'.concat(order)} onChange={handleChange('panel'.concat(order))}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={'panel'.concat(order, 'bh-content')}
          id={'panel'.concat(order, 'bh-header')}
        >
          <Typography style={{ fontWeight: 'bold' }}>Modulo {order}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container style={{ padding: 5 }}>
            <Grid item xs={4}>
              <h4>{title}</h4>
            </Grid>
            <Grid item xs={4}>
              <h4>{subTitle}</h4>
            </Grid>
            <Grid item xs={1}>
              <Button>
                <IconFileText style={{ marginTop: 12 }} />
              </Button>
            </Grid>
            <Grid item xs={1}>
              <Button onClick={handleOpenVideo}>
                <IconBrandYoutube style={{ marginTop: 12 }} />
              </Button>
            </Grid>
            <Grid item xs={1}>
              {state === 1 ? (
                <Button>
                  <IconEyeCheck style={{ marginTop: 12 }} />
                </Button>
              ) : (
                <Button>
                  <IconEyeOff style={{ marginTop: 12 }} />
                </Button>
              )}
            </Grid>
          </Grid>
          <Typography>
            {details}
            {link}
            {file}
          </Typography>
          <Grid container style={{ padding: 5 }}>
            <Grid item lg={9} xs={9}></Grid>
            <Grid item lg={1} xs={1}>
              <Button
                onClick={() => {
                  handleOpenEdit();
                  setTitleE(title);
                  setSubTitleE(subTitle);
                  setLinkE(link);
                  setFileE(file);
                  setDetailsE(details);
                }}
              >
                <IconEdit />
              </Button>
            </Grid>
            <Grid item lg={1} xs={1}>
              <Button>
                <IconTrash />
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Modal open={openVideo} onClose={handleCloseVideo} aria-labelledby="modal-modal-video" aria-describedby="modal-modal-video-link">
        <center>
          <Box sx={uiStyles.modalVideo}>
            <ReactPlayer id={id} url={link} volume={0.4} width="100%" height="100%" playing={true} loop={true} controls={true} />
          </Box>
        </center>
      </Modal>

      <Modal open={openEdit} onClose={handleCloseEdit} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.modalStyles}>
          <Typography id="modal-modal-title" variant="h2" component="h2">
            Editar Módulo {order}
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
                      value={titleE || ''}
                      inputProps={{}}
                      onChange={(ev) => setTitleE(ev.target.value)}
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
                      value={subTitleE || ''}
                      onChange={(ev) => setSubTitleE(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="linkVideo">
                      <span color="danger">*</span> Link Video
                    </InputLabel>
                    <OutlinedInput
                      id="linkVideo"
                      type="text"
                      name="linkVideo"
                      inputProps={{}}
                      value={linkE || ''}
                      onChange={(ev) => setLinkE(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="file">
                      <span color="danger">*</span> Archivo PDF, DOC, XSL O PPT
                    </InputLabel>
                    <OutlinedInput
                      id="file"
                      type="text"
                      name="file"
                      value={fileE || ''}
                      inputProps={{}}
                      onChange={(ev) => setFileE(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="detail">
                      <span color="danger">*</span>Detalle
                    </InputLabel>
                    <OutlinedInput
                      id="detail"
                      name="detail"
                      multiline
                      rows={4}
                      value={detailsE || ''}
                      onChange={(ev) => setDetailsE(ev.target.value)}
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
                        style={{ borderRadius: 15, backgroundColor: '#2DC3F7' }}
                        onClick={handleEdit}
                      >
                        Guardar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<IconCircleX />}
                        size="large"
                        style={{ marginLeft: 10, borderRadius: 15, backgroundColor: '#FF5656' }}
                        onClick={handleCloseEdit}
                      >
                        Cancelar
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
  );
};

export default Module;
