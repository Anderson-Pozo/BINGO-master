//Firebase
import { db, authentication } from 'config/firebase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { collection, setDoc, doc, updateDoc, deleteDoc, getDocs, addDoc, where, query } from 'firebase/firestore';
import {
  collAdminUsers,
  collCards,
  collGameInscription,
  collGames,
  collGenNoti,
  collIncomes,
  collLog,
  collMail,
  collPayments,
  collSettings,
  collUserCards,
  collUsers,
  collUsrNoti
} from 'store/collections';
import { genConst } from 'store/constant';
import { labels } from 'store/labels';
import { generateId } from 'utils/idGenerator';
import { generateDate } from 'utils/validations';

//Encontrar Sesión activa
export function isSessionActive(navigate) {
  onAuthStateChanged(authentication, async (user) => {
    if (user) {
      const q = query(collection(db, collUsers), where('id', '==', user.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data().profile == genConst.CONST_PRO_DEF) {
          navigate('/app/dashboard');
        } else {
          navigate('/main/dashboard');
        }
      });
    } else {
      navigate('/auth/signin');
    }
  });
}
//Update Function Profile
export function updateProfileUser(name, lastName) {
  return updateProfile(authentication.currentUser, { displayName: name + ' ' + lastName });
}

//Encontrar Id de Usuario Sesión
export function getUserId() {
  let userId = null;
  onAuthStateChanged(authentication, (user) => {
    if (user) {
      userId = user.uid;
    }
  });
  return userId;
}

//CRUD FUNCTIONS
export function createDocument(table, idRecord, object) {
  return setDoc(doc(db, table, idRecord), object);
}
export function updateDocument(table, idRecord, object) {
  return updateDoc(doc(db, table, idRecord), object);
}
export function deleteDocument(table, idRecord) {
  return deleteDoc(doc(db, table, idRecord));
}
export function getDocuments(table) {
  return getDocs(collection(db, table));
}
export function createLogRecord(object) {
  return addDoc(collection(db, collLog), object);
}
export function createSystemNotification(object) {
  return addDoc(collection(db, collUsrNoti), object);
}
export function createLogRecordWithId(idRecord, object) {
  return setDoc(doc(db, collLog, idRecord), object);
}
export function createGlobalNotification(message, subject) {
  const object = {
    id: generateId(6),
    from: labels.notiAdmin,
    date: generateDate(),
    message: message,
    subject: subject,
    state: genConst.CONST_NOTIF_NL
  };
  return addDoc(collection(db, collGenNoti), object);
}
//Buscar si existe Usuario
export async function isExistUser(id) {
  let isExist = false;
  const q = query(collection(db, collUsers), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size > 0) {
    isExist = true;
  } else {
    isExist = false;
  }
  return isExist;
}
//Obtener Datos Perfil de Usuario por ID
export async function getProfileUser(id) {
  let profile = null;
  const q = query(collection(db, collUsers), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    profile = doc.data().profile;
  });
  return profile;
}
//Obtener Datos Perfil de Usuario Administrador por ID
export async function getProfileUserAdmin(id) {
  let profile = null;
  const q = query(collection(db, collAdminUsers), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    profile = doc.data().profile;
  });
  return profile;
}
//LISTAS
//Obtenemos la lista de Usuarios
export const getUsersData = async () => {
  const list = [];
  const querySnapshot = await getDocs(collection(db, collUsers));
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
    list.sort((a, b) => a.name.localeCompare(b.name));
  });
  return list;
};
//
export const getGeneralNotifications = async () => {
  const list = [];
  const querySnapshot = await getDocuments(collGenNoti);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};
export async function getUserNotifications(id) {
  const list = [];
  const q = query(collection(db, collUsrNoti), where('idUser', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
}
//CARTILLAS
export const getGameCards = async () => {
  const list = [];
  const querySnapshot = await getDocuments(collCards);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
    list.sort((a, b) => a.order - b.order);
  });
  return list;
};
//CARTILLAS POR USUARIO
export const getGameCardsByUser = async (id) => {
  const list = [];
  const q = query(collection(db, collUserCards), where('userId', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
    list.sort((a, b) => a.order - b.order);
  });
  return list;
};
//CARTILLA POR ID
export const getGameCardsById = async (id) => {
  const list = [];
  const q = query(collection(db, collCards), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};
//CARTILLAS POR USUARIO Y EVENTO
export const getGameCardsByUserEvent = async (id, eventId) => {
  const list = [];
  const q = query(collection(db, collUserCards), where('userId', '==', id), where('eventId', '==', eventId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
    list.sort((a, b) => a.order - b.order);
  });
  return list;
};
//
export const getGameCardsByEvent = async (id) => {
  const list = [];
  const q = query(collection(db, collCards), where('event', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
    list.sort((a, b) => a.order - b.order);
  });
  return list;
};
export async function getMail() {
  const list = [];
  const querySnapshot = await getDocuments(collMail);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
}
//Obtenemos la lista de Usuarios Administradores
export const getAdminUsersData = async () => {
  const list = [];
  const q = query(collection(db, collUsers), where('profile', '==', genConst.CONST_PRO_ADM));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};
//Obtenemos la lista de Usuarios Administradores
export const getUsersList = async () => {
  const list = [];
  const q = query(collection(db, collUsers), where('profile', '==', genConst.CONST_PRO_DEF));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};
//Obtenemos la lista de Partidas
export const getGamesList = async () => {
  const list = [];
  const querySnapshot = await getDocuments(collGames);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};
//Obtenemos la lista de Pagos
export const getPaymentsList = async () => {
  const list = [];
  const querySnapshot = await getDocuments(collPayments);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};
//Obtenemos la lista de Usuarios por Partida
export const getGameUsers = async (id) => {
  const list = [];
  const q = query(collection(db, collGameInscription), where('idGame', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};
//Obtenemos la lista de Usuarios por Partida
export const getGameNameById = async (id) => {
  let list = [];
  const q = query(collection(db, collGames), where('ide', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};
//Obtenemos datos de Usuario por codigo
export const getUsersDataByCode = async (code) => {
  const list = [];
  const q = query(collection(db, collUsers), where('ownReferal', '==', code));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};
//Obtenemos lista de Parámetros
export async function getParamsData() {
  const list = [];
  const querySnapshot = await getDocuments(collSettings);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
    list.sort((a, b) => a.type.localeCompare(b.type));
  });
  return list;
}
//Obtenemos el nombre y apellido de Usuario por ID
export async function getUserName(id) {
  let name = null;
  const q = query(collection(db, collUsers), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    name = doc.data().name + ' ' + doc.data().lastName;
  });
  return name;
}
//Obtenemos el nombre y apellido de Usuario por ID
export async function getUserNameByCode(code) {
  let name = null;
  const q = query(collection(db, collUsers), where('ownReferal', '==', code));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    name = doc.data().name + ' ' + doc.data().lastName;
  });
  return name;
}
//STADISTICS COUNT ITEMS
//Obtenemos cantidad de Usuarios Registrados
export const countUser = async () => {
  const q = query(collection(db, collUsers), where('profile', '==', genConst.CONST_PRO_DEF));
  const querySnapshot = await getDocs(q);
  const count = querySnapshot.size;
  return count;
};
//
export const countCardsByEvent = async (id) => {
  const q = query(collection(db, collCards), where('event', '==', id));
  const querySnapshot = await getDocs(q);
  const count = querySnapshot.size;
  return count;
};
//Obtenemos cantidad de Cartillas
export const countCards = async () => {
  const data = collection(db, collCards);
  const querySnapshot = await getDocs(data);
  const count = querySnapshot.size;
  return count;
};
//Obtenemos cantidad de Cartillas
export const countGames = async () => {
  const data = collection(db, collGames);
  const querySnapshot = await getDocs(data);
  const count = querySnapshot.size;
  return count;
};
//Total beneficio
export async function getTotalPaidBenefit() {
  let total = 0;
  const q = query(collection(db, collPayments));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size > 0) {
    querySnapshot.forEach((doc) => {
      total = Number.parseFloat(total) + Number.parseFloat(doc.data().total);
    });
  }
  return total;
}
//Obtenemos cantidad de Usuarios Administradores Registrados
export const countAdminUser = async () => {
  const q = query(collection(db, collUsers), where('profile', '==', genConst.CONST_PRO_ADM));
  const querySnapshot = await getDocs(q);
  const count = querySnapshot.size;
  return count;
};
export const countTotalIncomes = async () => {
  const totalCollection = collection(db, collIncomes);
  const querySnapshot = await getDocs(totalCollection);
  const incomesCount = querySnapshot.size;
  return incomesCount;
};

export async function getUserState(id) {
  let state = null;
  const q = query(collection(db, collUsers), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    state = doc.data().state;
  });
  return state;
}

export async function getUserData(id) {
  let data = [];
  const q = query(collection(db, collUsers), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });
  return data;
}

export const getUserDataObject = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(
      authentication,
      (user) => {
        if (user) {
          resolve(user);
        } else {
          resolve(null);
        }
      },
      reject
    );
  });
};
