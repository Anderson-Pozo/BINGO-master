import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBmgYAlIyJcHqT3v9Z_1u0w1CCXvMIXVhc',
  authDomain: 'khuska-54cf3.firebaseapp.com',
  projectId: 'khuska-54cf3',
  storageBucket: 'khuska-54cf3.appspot.com',
  messagingSenderId: '1080274008049',
  appId: '1:1080274008049:web:df588dafbc5153c2267650',
  measurementId: 'G-W62GCQBCN0'
};

const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
