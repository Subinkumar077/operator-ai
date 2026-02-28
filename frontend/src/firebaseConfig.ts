import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

export const app = initializeApp({
  apiKey: 'AIzaSyCHM9q2pxIV2oq0xvR5S-FWrY9h4LKA11w',
  authDomain: 'bookify-d64a4.firebaseapp.com',
  databaseURL: 'https://bookify-d64a4-default-rtdb.firebaseio.com',
  projectId: 'bookify-d64a4',
  storageBucket: 'bookify-d64a4.firebasestorage.app',
  messagingSenderId: '316599594832',
  appId: '1:316599594832:web:2c50f0e40242dea8464655',
});

export const db = getDatabase(app);
