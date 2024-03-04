//Firebase
import { db, authentication } from 'config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, setDoc, doc, updateDoc, deleteDoc, getDocs, addDoc, where, query } from 'firebase/firestore';
import {
  collAdminUsers,
  collBusiness,
  collCourses,
  collGenNoti,
  collIncomes,
  collKhuskaBenefit,
  collLog,
  collMail,
  collProducts,
  collSubscription,
  collUserBenefit,
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
//Obtener Padre de Hijo
export async function getDad(code) {
  let data = null;
  const q = query(collection(db, collUsers), where('ownReferal', '==', code));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size > 0) {
    querySnapshot.forEach((doc) => {
      data = doc.data();
    });
  }
  return data;
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
//Obtener el Estado de una Usuario por ID
export async function getSubscribeStateUser(id) {
  let state = null;
  const q = query(collection(db, collUsers), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    state = doc.data().state;
  });
  return state;
}
//Obtener el estado de la Subscripción de un Usuario por ID
export async function getUserSubscription(id) {
  let state = null;
  const q = query(collection(db, collSubscription), where('idUser', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    state = doc.data().state;
  });
  return state;
}
//Obtener datos de la Subscripción de un Usuario por ID
export async function getUserDataSubscription(id) {
  let data = null;
  const q = query(collection(db, collSubscription), where('idUser', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data = doc.data();
  });
  return data;
}
//Obtner el Negocio por Id
export async function getBusinessById(id) {
  let data = [];
  const q = query(collection(db, collBusiness), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });
  return data;
}
//Obtner el Producto por Id
export async function getProductById(id) {
  let data = [];
  const q = query(collection(db, collProducts), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });
  return data;
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
export const getBenefits = async () => {
  const list = [];
  const querySnapshot = await getDocuments(collKhuskaBenefit);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};
export const getAllUserBenefits = async () => {
  const list = [];
  const querySnapshot = await getDocuments(collUserBenefit);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};
export const getUserBenefits = async (id) => {
  const list = [];
  const q = query(collection(db, collUserBenefit), where('idRefer', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
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
//Obtener lista de Negocios
export async function getBusinessList() {
  const list = [];
  const querySnapshot = await getDocs(collection(db, collBusiness));
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
    list.sort((a, b) => a.name.localeCompare(b.name));
  });
  return list;
}
//Obtener lista de Productos
export async function getProductsByBusiness(id) {
  const list = [];
  const q = query(collection(db, collProducts), where('idBusiness', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
}
//Obtenemos la Lista de Cursos
export const getCoursesList = async () => {
  const list = [];
  const querySnapshot = await getDocuments(collCourses);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
    list.sort((a, b) => a.name.localeCompare(b.name));
  });
  return list;
};
//Obtenemos los Datos de un Curso por ID
export async function getCourseData(id) {
  let data = [];
  const q = query(collection(db, collCourses), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });
  return data;
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
//Total beneficio por usuario Cancelado
export async function getTotalCancelBenefitByUserId(id) {
  let total = 0;
  const q = query(collection(db, collUserBenefit), where('idRefer', '==', id), where('state', '==', genConst.CONST_BEN_CAN));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size > 0) {
    querySnapshot.forEach((doc) => {
      total = total + doc.data().total;
    });
  }
  return total;
}
//Total beneficio por usuario Pagado
export async function getTotalPaidBenefitByUserId(id) {
  let total = 0;
  const q = query(collection(db, collUserBenefit), where('idRefer', '==', id), where('state', '==', genConst.CONST_BEN_PAI));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size > 0) {
    querySnapshot.forEach((doc) => {
      total = total + doc.data().total;
    });
  }
  return total;
}
//Total beneficio por Pendiente
export async function getTotalPendinBenefitByUserId(id) {
  let total = 0;
  const q = query(collection(db, collUserBenefit), where('idRefer', '==', id), where('state', '==', genConst.CONST_BEN_PEN));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size > 0) {
    querySnapshot.forEach((doc) => {
      total = total + doc.data().total;
    });
  }
  return total;
}
//Total Beneficio
export async function getTotalBenefit() {
  let total = 0;
  const querySnapshot = await getDocuments(collKhuskaBenefit);
  querySnapshot.forEach((doc) => {
    total = total + doc.data().total;
  });
  return total;
}
export async function getBusinessListByUser(id) {
  let data = [];
  const q = query(collection(db, collBusiness), where('userId', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });
  return data;
}

//STADISTICS COUNT ITEMS
//Obtenemos cantidad de Usuarios Registrados
export const countUser = async () => {
  const usersCollection = collection(db, collUsers);
  const querySnapshot = await getDocs(usersCollection);
  const userCount = querySnapshot.size;
  return userCount;
};
//Obtenemos cantidad de Usuarios Administradores Registrados
export const countAdminUser = async () => {
  const q = query(collection(db, collUsers), where('profile', '==', genConst.CONST_PRO_ADM));
  const querySnapshot = await getDocs(q);
  const count = querySnapshot.size;
  return count;
};
//Obtenemos cantidad de Negocios Registrados
export const countBusiness = async () => {
  const collCount = collection(db, collBusiness);
  const querySnapshot = await getDocs(collCount);
  const count = querySnapshot.size;
  return count;
};
//Obtenemos cantidad de Negocios Registrados por Usuario ID
export async function countBusinessById(id) {
  const q = query(collection(db, collBusiness), where('userId', '==', id));
  const querySnapshot = await getDocs(q);
  const count = querySnapshot.size;
  return count;
}
export async function countBusinessByUserId(id) {
  const q = query(collection(db, collBusiness), where('userId', '==', id));
  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
}
//Obtenemos cantidad de Cursos Registrados
export const countCourses = async () => {
  const coursesCollection = collection(db, collCourses);
  const querySnapshot = await getDocs(coursesCollection);
  const courseCount = querySnapshot.size;
  return courseCount;
};
//Obtenemos cantidad de Subscripciones Registradas
export const countSubscriptions = async () => {
  const subsCollection = collection(db, collSubscription);
  const querySnapshot = await getDocs(subsCollection);
  const subsCount = querySnapshot.size;
  return subsCount;
};
export const countTotalIncomes = async () => {
  const totalCollection = collection(db, collIncomes);
  const querySnapshot = await getDocs(totalCollection);
  const incomesCount = querySnapshot.size;
  return incomesCount;
};
//Obtenemos cantidad de Subscripciones Activas Registradas
export async function countActiveSubscriptions() {
  const q = query(collection(db, collSubscription), where('state', '==', 1));
  const querySnapshot = await getDocs(q);
  const count = querySnapshot.size;
  return count;
}
//LOGIN
//Buscamos si correo corresponde a Administrador
export const getAdmin = async (mail) => {
  let isFind = false;
  const q = query(collection(db, collUsers), where('email', '==', mail), where('profile', '==', genConst.CONST_PRO_ADM));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size > 0) {
    isFind = true;
  } else {
    isFind = false;
  }
  return isFind;
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

export async function getUserReferalCode(id) {
  let code = null;
  const q = query(collection(db, collUsers), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    code = doc.data().ownReferal;
  });
  return code;
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

export async function getUserChilds(refer) {
  let data = [];
  const q = query(collection(db, collUsers), where('refer', '==', refer));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });
  return data;
}

export async function getUserCourses(id) {
  let courses = [];
  const q = query(collection(db, collRegUsr), where('idIUser', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    courses.push(doc.data());
  });
  return courses;
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
