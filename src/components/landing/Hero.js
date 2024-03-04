/* eslint-disable react/prop-types */
import React from 'react';
import { Collapse, IconButton, Grid } from '@mui/material';
import { uiStyles } from './styles';
import ImageServiceCard from './ImageServiceCard';
import { Link as Scroll } from 'react-scroll';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Hero({ checked }) {
  return (
    <Collapse in={checked} {...(checked ? { timeout: 1000 } : {})} collapsedSize={50}>
      <div style={uiStyles.container}>
        <h3 style={uiStyles.title}>
          JUNTOS HACIA LA CONSTRUCCIÓN
          <br />
          <span style={uiStyles.colorText}> DE UN FUTURO PROSPERO</span>
        </h3>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item lg={4} md={4} sm={4} xs={12}>
                <Link variant="h4" to={''}>
                  <ImageServiceCard place={places[0]} checked={checked} />
                </Link>
              </Grid>
              <Grid item lg={4} md={4} sm={4} xs={12}>
                <Link variant="h4" to={''}>
                  <ImageServiceCard place={places[1]} checked={checked} />
                </Link>
              </Grid>
              <Grid item lg={4} md={4} sm={4} xs={12}>
                <Link variant="h4" to={'auth/signin'}>
                  <ImageServiceCard place={places[2]} checked={checked} />
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Scroll to="about" smooth={true}>
          <IconButton>
            <ExpandMoreIcon style={uiStyles.goDown} />
          </IconButton>
        </Scroll>
      </div>
    </Collapse>
  );
}

const places = [
  {
    title: 'COMPRA VENTA',
    description: '',
    time: 1500
  },
  {
    title: 'DROP SHIPPING',
    description: '',
    time: 1500
  },
  {
    title: 'RED DE MERCADEO',
    description: '',
    time: 1500
  }
];
