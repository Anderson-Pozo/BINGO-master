import React, { useState } from 'react';

// material-ui
import {
  Box,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  CardContent,
  Card
} from '@mui/material';

import CreditCard from 'components/creditCard/CreditCard';

// project imports
import { genConst } from 'store/constant';
import { endDateWithParam, initDate } from 'utils/validations';

const Subscription = () => {
  //const [searchParams] = useSearchParams();
  //const id = searchParams.get('id');
  const [type, setType] = useState(null);
  const [method, setMethod] = useState(null);
  const [isType, setIsType] = useState(false);
  //TOTAL PARAMS
  const [total, setTotal] = useState(null);
  const [iva, setIva] = useState(null);
  const [subtotal, setSubtotal] = useState(null);

  //DATE PARAMS
  const [startDate] = useState(initDate());
  const [endDate, setEndDate] = useState(null);

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleRadioChange = (event) => {
    setType(event.target.value);
    if (event.target.value == 1) {
      setIsType(true);
      setType(1);
      let subtotal = Math.round((genConst.CONST_MONTH_VALUE / genConst.CONST_IVA) * 10 ** 2) / 10 ** 2;
      let ivaValue = genConst.CONST_MONTH_VALUE - subtotal;
      let ivaRound = Math.round(ivaValue * 10 ** 2) / 10 ** 2;
      //let totalValue = genConst.CONST_MONTH_VALUE - ivaRound;
      setIva(ivaRound);
      setSubtotal(subtotal);
      setTotal(genConst.CONST_MONTH_VALUE);
      setEndDate(endDateWithParam(genConst.CONST_MONTH_DAYS));
    } else if (event.target.value == 2) {
      setIsType(true);
      setType(2);
      let subtotal = Math.round((genConst.CONST_YEAR_VALUE / genConst.CONST_IVA) * 10 ** 2) / 10 ** 2;
      let ivaValue = genConst.CONST_YEAR_VALUE - subtotal;
      let ivaRound = Math.round(ivaValue * 10 ** 2) / 10 ** 2;
      //let totalValue = genConst.CONST_YEAR_VALUE - ivaValue;
      setIva(ivaRound);
      setSubtotal(subtotal);
      setTotal(genConst.CONST_YEAR_VALUE);
      setEndDate(endDateWithParam(genConst.CONST_YEAR_DAYS));
    }
  };

  const handleMethodChange = (event) => {
    setMethod(event.target.value);
  };

  return (
    <center>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item lg={12}>
          <Box sx={{ maxWidth: '100%' }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              <Step key={1}>
                <StepLabel>{'Selecciona tu Suscripción'}</StepLabel>
                <StepContent>
                  <Card>
                    <CardContent>
                      <Typography variant={'h4'}>{'Si realizas el pago anual, recibes un descuento de dos meses.'}</Typography>
                      <center>
                        <FormControl>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            onChange={handleRadioChange}
                            values={type}
                          >
                            <FormControlLabel value={1} control={<Radio />} label={'Mensual $ ' + genConst.CONST_MONTH_VALUE} />
                            <FormControlLabel value={2} control={<Radio />} label={'Anual $ ' + genConst.CONST_YEAR_VALUE} />
                          </RadioGroup>
                        </FormControl>
                      </center>
                      {isType ? (
                        <center>
                          <Grid container style={{ marginTop: 20 }}>
                            <Grid xs={6}>
                              <Typography variant={'h5'} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                Fecha Inicio:
                              </Typography>
                            </Grid>
                            <Grid xs={6}>
                              <Typography variant={'h5'} style={{ textAlign: 'left', marginLeft: 20 }}>
                                {startDate}
                              </Typography>
                            </Grid>
                            <Grid xs={6}>
                              <Typography variant={'h5'} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                Fecha Fin:
                              </Typography>
                            </Grid>
                            <Grid xs={6}>
                              <Typography variant={'h5'} style={{ textAlign: 'left', marginLeft: 20 }}>
                                {endDate}
                              </Typography>
                            </Grid>
                            <Grid xs={6}>
                              <Typography variant={'h5'} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                Subtotal:
                              </Typography>
                            </Grid>
                            <Grid xs={6}>
                              <Typography variant={'h5'} style={{ textAlign: 'left', marginLeft: 20 }}>
                                $ {subtotal}
                              </Typography>
                            </Grid>
                            <Grid xs={6}>
                              <Typography variant={'h5'} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                IVA:
                              </Typography>
                            </Grid>
                            <Grid xs={6}>
                              <Typography variant={'h5'} style={{ textAlign: 'left', marginLeft: 20 }}>
                                $ {iva}
                              </Typography>
                            </Grid>
                            <Grid xs={6}>
                              <Typography variant={'h5'} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                Total:
                              </Typography>
                            </Grid>
                            <Grid xs={6}>
                              <Typography variant={'h5'} style={{ textAlign: 'left', marginLeft: 20 }}>
                                $ {total}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Button variant="contained" onClick={handleNext} style={{ marginTop: 20 }}>
                            Continuar
                          </Button>
                        </center>
                      ) : (
                        <></>
                      )}
                    </CardContent>
                  </Card>
                </StepContent>
              </Step>
              <Step key={2}>
                <StepLabel>{'Selecciona tu Forma de Pago'}</StepLabel>
                <StepContent>
                  <Card>
                    <CardContent>
                      <center>
                        <FormControl>
                          <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                            onChange={handleMethodChange}
                            values={type}
                          >
                            <FormControlLabel value={1} control={<Radio />} label="Tarjeta de Crédito" />
                            <FormControlLabel value={2} control={<Radio />} label="Deposito o Transferencia" />
                            <FormControlLabel value={3} control={<Radio />} label="Paypal" />
                            <FormControlLabel value={4} control={<Radio />} label="Realizar el pago despúes" />
                          </RadioGroup>
                        </FormControl>
                        <Box sx={{ mb: 2 }}>
                          <center>
                            <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                              {'Continuar'}
                            </Button>
                            <Button disabled={0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                              Regresar
                            </Button>
                          </center>
                        </Box>
                      </center>
                    </CardContent>
                  </Card>
                </StepContent>
              </Step>
              <Step key={3}>
                <StepLabel>{'Realiza el Pago'}</StepLabel>
                <StepContent>
                  <Card>
                    <CardContent>
                      <Typography variant={'h5'} hidden>
                        {'Subtotal: ' + subtotal}
                      </Typography>
                      <Typography variant={'h5'} hidden>
                        {'IVA: ' + iva}
                      </Typography>
                      {method == 1 ? (
                        <CreditCard total={total} type={type} />
                      ) : method == 2 ? (
                        <h4>Deposito</h4>
                      ) : method == 3 ? (
                        <h4>Paypal</h4>
                      ) : (
                        <h4>Pago despues</h4>
                      )}
                      <Box sx={{ mb: 2, mt: 3 }}>
                        <center>
                          <Button disabled={0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                            Regresar
                          </Button>
                        </center>
                      </Box>
                    </CardContent>
                  </Card>
                </StepContent>
              </Step>
            </Stepper>
          </Box>
        </Grid>
      </Grid>
    </center>
  );
};

export default Subscription;
