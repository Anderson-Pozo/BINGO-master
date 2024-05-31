import React from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { createDocument, updateDocument } from 'config/firebaseEvents';
import { collCards, collPayments, collUserCards } from 'store/collections';
import { generateId } from 'utils/idGenerator';
import { fullDate } from 'utils/validations';

const PayPalButton = (props) => {
  let navigate = useNavigate();
  console.log(props.object);
  return (
    <PayPalButtons
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              description: props.invoice,
              amount: {
                value: props.totalValue
              }
            }
          ]
        });
      }}
      onApprove={async (data, actions) => {
        const order = await actions.order?.capture();
        console.log('order', order);
        if (order.status == 'COMPLETED') {
          const ide = generateId(10);
          const object = props.object;
          console.log('Operación exitosa', object);
          const updateObject = {
            state: 0,
            updateAt: fullDate()
          };
          const paymentObject = {
            id: ide,
            status: order.status,
            details: props.invoice,
            total: props.totalValue,
            card: props.object.idCard,
            paypalOrderId: order.id,
            createAt: fullDate()
          };
          updateDocument(collCards, props.object.idCard, updateObject);
          createDocument(collUserCards, ide, object);
          createDocument(collPayments, ide, paymentObject);
          navigate({
            pathname: '/app/success',
            search: createSearchParams({ status: order.status, order: order.id }).toString()
          });
        } else {
          navigate({
            pathname: '/app/failure',
            search: createSearchParams({ status: order.status, order: order.id }).toString()
          });
        }
      }}
    />
  );
};

PayPalButton.propTypes = {
  invoice: PropTypes.string,
  totalValue: PropTypes.string,
  object: PropTypes.object
};

export default PayPalButton;
