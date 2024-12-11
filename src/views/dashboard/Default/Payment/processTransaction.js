import { createDocument, updateDocument } from 'config/firebaseEvents';
import { collCards, collPayments, collUserCards } from 'store/collections';
import { PAYPHONE_CONFIG } from 'store/constant';
import { generateId } from 'utils/idGenerator';
import { fullDate } from 'utils/validations';
const { SERVER_URL, TOKEN } = PAYPHONE_CONFIG;

const processTransaction = async (transactionId, clientTransactionId, storedTransaction) => {
  try {
    validateTransactionParams(transactionId, clientTransactionId);

    const requestData = {
      id: parseInt(transactionId, 10),
      clientTxId: clientTransactionId
    };

    const response = await fetchTransactionStatus(requestData);
    const result = await response.json();

    savePaymentDetails(
      storedTransaction, // todo: use response instead of storedTransaction
      transactionId,
      clientTransactionId,
      result.statusCode
    );

    if (result.statusCode === 3) {
      const { cards, userId, userName } = storedTransaction.invoiceData;
      saveUserCards(cards, userId, userName);
    }

    // console.log('Resultado de la transacción:', result);
    return result;
  } catch (error) {
    // console.error('Ocurrió un error al confirmar la transacción:', error);
    throw error;
  } finally {
    // Limpiar el local storage
    localStorage.removeItem('pyphone_trx');
  }
};

const fetchTransactionStatus = async (data) => {
  const response = await fetch(SERVER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}, Detalles: ${errorText}`);
  }

  return response;
};

// Guardar cartillas de usuario y actualizar estado de cartillas
const saveUserCards = (cards, userId, userName) => {
  cards?.forEach((item) => {
    const idUserCard = generateId(10);
    const cardObject = {
      id: idUserCard,
      idCard: item.id,
      createAt: fullDate(),
      eventDate: null,
      eventId: item.event,
      eventName: item.eventName,
      bingoNumbers: item.bingoNumbers,
      b: item.b,
      i: item.i,
      n: item.n,
      g: item.g,
      o: item.o,
      num: item.num,
      order: item.order,
      state: 0,
      userId: userId,
      userName: userName
    };

    const idReg = generateId(10);
    createDocument(collUserCards, idReg, cardObject);
    updateDocument(collCards, item.id, { state: 0 });
  });
};

// Guardar detalles de pago
const savePaymentDetails = (storedTransaction, transactionId, clientTransactionId, statusCode) => {
  const { userId, userName, reference, totalValue } = storedTransaction.invoiceData;

  const payment = {
    id: generateId(10),
    createAt: fullDate(),
    userId,
    userName,
    reference,
    total: totalValue,
    transactionId,
    clientTransactionId,
    statusCode,
    status: statusCode === 3 ? 'Aprobado' : 'Cancelado',
    provider: 'PayPhone'
  };

  createDocument(collPayments, payment.id, payment);
};

const validateTransactionParams = (transactionId, clientTransactionId) => {
  if (!transactionId || !clientTransactionId) {
    throw new Error('Faltan parámetros en la URL.');
  }
};

export default processTransaction;
