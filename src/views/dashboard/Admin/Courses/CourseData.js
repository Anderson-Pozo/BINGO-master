/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { styled } from '@mui/material/styles';
import { Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'components/cards/MainCard';

//Notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CardWrapper = styled(MainCard)(() => ({
  backgroundColor: '#FFF',
  color: '#000',
  overflow: 'hidden',
  position: 'relative'
}));

const CourseData = (props) => {
  const { name, description, owner, duration, number, price, language, banner } = props;
  return (
    <>
      <ToastContainer />
      <CardWrapper border={false} content={false}>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={0.2}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <img
                      src={banner}
                      alt="banner-poster"
                      style={{
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer',
                        borderRadius: 15
                      }}
                    />
                  </center>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Typography component="span" variant="h3" sx={{ fontWeight: 500, color: '#000', marginTop: 2, textAlign: 'center' }}>
                    {name}
                  </Typography>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Typography component="span" variant="h4" sx={{ fontWeight: 400, color: '#000' }}>
                    {description}
                  </Typography>
                </Grid>
                <Grid item lg={4} md={6} sm={6} xs={12}>
                  <strong>Tutor: </strong>
                </Grid>
                <Grid item lg={8} md={6} sm={6} xs={12}>
                  {owner}
                </Grid>

                <Grid item lg={4} md={6} sm={6} xs={12}>
                  <strong>Duración: </strong>
                </Grid>
                <Grid item lg={8} md={6} sm={6} xs={12}>
                  {duration} {' horas'}
                </Grid>

                <Grid item lg={4} md={6} sm={6} xs={12}>
                  <strong>Clases: </strong>
                </Grid>
                <Grid item lg={8} md={6} sm={6} xs={12}>
                  {number}
                </Grid>

                <Grid item lg={4} md={6} sm={6} xs={12}>
                  <strong>Precio: </strong>
                </Grid>
                <Grid item lg={8} md={6} sm={6} xs={12}>
                  {' $ ' + price}
                </Grid>

                <Grid item lg={4} md={6} sm={6} xs={12}>
                  <strong>Idioma: </strong>
                </Grid>
                <Grid item lg={8} md={6} sm={6} xs={12}>
                  {language}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </CardWrapper>
    </>
  );
};

CourseData.propTypes = {
  id: PropTypes.string
};

export default CourseData;
