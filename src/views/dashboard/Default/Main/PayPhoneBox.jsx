import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { PAYPHONE_CONFIG } from 'store/constant';

const { TOKEN, STORE_ID } = PAYPHONE_CONFIG;

const PayphoneBox = (props) => {
  const { totalValue, invoiceData } = props;
  const ppbRef = useRef(null);
  const total = parseInt(totalValue * 100);

  const clientTransactionId = uuidv4();

  useEffect(() => {
    // Configuración de Payphone
    const ppb = new window.PPaymentButtonBox({
      token: TOKEN,
      amount: total,
      amountWithoutTax: total,
      tax: 0,
      service: 0,
      tip: 0,
      storeId: STORE_ID,
      reference: invoiceData.reference || 'Pago cartillas de Bingo',
      clientTransactionId
    });

    ppbRef.current = ppb;
    ppb.render('#pp-button');
    //clean local storage before render
    // localStorage.removeItem('pyphone_trx');

    localStorage.setItem(
      'pyphone_trx',
      JSON.stringify({
        clientTransactionId,
        invoiceData: {
          ...invoiceData,
          totalValue
        }
      })
    );
  }, []);

  return <div id="pp-button"></div>;
};

PayphoneBox.propTypes = {
  totalValue: PropTypes.number,
  invoiceData: PropTypes.object
};

export default PayphoneBox;
