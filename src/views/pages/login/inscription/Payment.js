/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';

// material-ui
import { useTheme } from '@mui/material/styles';
import { FormControl, Grid, InputLabel, OutlinedInput, Button } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthFooter from 'components/cards/AuthFooter';

//Assets
import bg01 from 'assets/images/02.webp';
import { useState } from 'react';
import { genConst } from 'store/constant';
import { generateId } from 'utils/idGenerator';

const Payment = () => {
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const param1 = searchParams.get('param1');
  const param2 = searchParams.get('param2');
  const param3 = searchParams.get('param3');
  const param4 = searchParams.get('param4');

  useEffect(() => {
    console.log(param1, param2, param3, param4);
  }, []);

  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    focus: ''
  });

  const handleInputFocus = (e) => {
    setCardDetails({ ...cardDetails, focus: e.target.name });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handlePayment = () => {
    const object = {
      id: generateId(10),
      idUser: null,
      name: param1 + ' ' + param2,
      email: param3,
      idCourse: param4,
      cardDetails: cardDetails
    };
    console.log(object);
  };

  return (
    <AuthWrapper1
      style={{
        backgroundImage: `url(${bg01})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        margin: 0,
        padding: 0
      }}
    >
      <Grid container direction="column">
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 57px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item xs={12}>
                    <Cards
                      number={cardDetails.number}
                      name={cardDetails.name}
                      expiry={cardDetails.expiry}
                      cvc={cardDetails.cvc}
                      focused={cardDetails.focus}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                      <InputLabel htmlFor="number">Número de Tarjeta</InputLabel>
                      <OutlinedInput
                        id="number"
                        name="number"
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        value={cardDetails.number}
                        placeholder="0000 0000 0000 0000"
                        inputProps={{
                          maxLength: 16,
                          inputMode: 'numeric',
                          pattern: '[0-9s]{13,19}'
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                      <InputLabel htmlFor="name">Nombre en Tarjeta</InputLabel>
                      <OutlinedInput
                        id="name"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        value={cardDetails.name}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                      <InputLabel htmlFor="expiry">Fecha Caducidad</InputLabel>
                      <OutlinedInput
                        id="expiry"
                        name="expiry"
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        value={cardDetails.expiry}
                        placeholder="12/25"
                        inputProps={{
                          maxLength: 5,
                          inputMode: 'numeric',
                          pattern: 'dd/dd'
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                      <InputLabel htmlFor="cvc">CVC</InputLabel>
                      <OutlinedInput
                        id="cvc"
                        name="cvc"
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        value={cardDetails.cvc}
                        inputProps={{
                          maxLength: 3,
                          inputMode: 'numeric',
                          pattern: 'ddd'
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      style={{ margin: 5, borderRadius: 10, backgroundColor: genConst.CONST_CREATE_COLOR }}
                      onClick={handlePayment}
                    >
                      Pagar
                    </Button>
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Payment;
