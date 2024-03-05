import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyARlrExQahem3yN_tP6DpT3O6FkYs6fCL8',
  authDomain: 'bingo-master-bd041.firebaseapp.com',
  projectId: 'bingo-master-bd041',
  storageBucket: 'bingo-master-bd041.appspot.com',
  messagingSenderId: '955240353348',
  appId: '1:955240353348:web:c7c2bfb712b47f70743611'
};

const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
